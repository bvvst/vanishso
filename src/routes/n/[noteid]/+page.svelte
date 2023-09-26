<script lang="ts">
  import { onMount } from "svelte";
  import { decrypt, deriveKey, hashKey, keyToString, stringToKey } from "$lib";
  import clsx from "clsx";
  import { otp } from "$lib/otp";

  interface NoteData {
    id: string;
    confirmBeforeViewing: boolean;
    mode: "p" | "k" | "otp";
    encrypted: "";
    exp: number;
    h: string;
    cs: string;
  }

  interface Data {
    noteData: NoteData | null;
  }

  export let data: Data;

  const { noteData } = data;

  let decryptedNoteContent = "";
  let decrypted = false;
  let password = "";
  let countdown = "";

  async function readNoteWithKey(key: CryptoKey) {
    if (!noteData) return;
    const hash = await hashKey(key);

    try {
      const response = await fetch("/api/read", {
        method: "POST",
        body: JSON.stringify({ id: noteData.id, auth: hash }),
        headers: {
          "content-type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("bad response");
      }

      const { content } = await response.json();

      decryptedNoteContent = await decrypt(key, content);
      decrypted = true;
    } catch (e) {
      //handle the error
      console.error(e);
    }
  }

  async function readNoteWithCipherKey(key: string) {
    if (!noteData) return;

    try {
      const response = await fetch("/api/read", {
        method: "POST",
        body: JSON.stringify({ id: noteData.id, auth: "" }),
        headers: {
          "content-type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("bad response");
      }

      const { content } = await response.json();

      decryptedNoteContent = await otp(content, key, "decrypt", false);
      decrypted = true;
    } catch (e) {
      //handle the error
      console.error(e);
    }
  }

  async function viewNote() {
    if (!noteData) return;

    if (noteData.mode == "otp") {
      const fragment = window.location.href.split("#")[1] || "";
      if (fragment == "") {
        console.log("bruh");
        return;
      }
      readNoteWithCipherKey(fragment);
    } else if (noteData.mode == "p") {
      const key = await deriveKey(password, noteData.cs);
      console.log("reading with key: ", await keyToString(key));
      readNoteWithKey(key);
    } else {
      const fragment = window.location.href.split("#")[1] || "";
      if (fragment == "") {
        console.log("bruh");
        return;
      }
      const key = await stringToKey(fragment);
      readNoteWithKey(key);
    }
  }

  //chat gpt code
  function countdownToTimestamp(targetTimestamp: number): string {
    const now = Math.floor(Date.now()); // Convert current time to Unix timestamp (seconds)
    let difference = targetTimestamp - now;

    if (difference < 0) {
      return "00:00:00"; // If the time has already passed, return zeros
    }

    const hours = Math.floor(difference / 3600000);
    difference -= hours * 3600000;

    const minutes = Math.floor(difference / 60000);
    difference -= minutes * 60000;

    const seconds = Math.floor(difference / 1000);

    // Pad numbers to make sure they are always two digits
    const padNumber = (num: number) => (num < 10 ? "0" + num : num.toString());

    return `${padNumber(hours)}:${padNumber(minutes)}:${padNumber(seconds)}`;
  }

  onMount(async () => {
    if (!noteData) return;
    // run only if the note should be vanished without warning
    if (!noteData.confirmBeforeViewing) {
      viewNote();
    }
    // ---------------
    // set countdown if there's a countdown

    if (noteData?.exp !== 0) {
      countdown = countdownToTimestamp(noteData.exp);
      setInterval(() => {
        countdown = countdownToTimestamp(noteData.exp);
        if (countdown == "00:00:00") {
          location.reload();
        }
      }, 1000);
    }
  });
</script>

{#if !noteData}
  <div class="flex flex-col items-center m-auto w-[34rem]">
    <h2 class="text-[#D0C1F6] font-obv font-medium">
      This note doesn't exist, or it already expired.
    </h2>
    <a
      href="/"
      class="text-[#5B478D] hover:underline font-obv text-sm text-center max-w-xs mt-2"
    >
      Make a new note
    </a>
  </div>
{:else if decrypted}
  <div class="flex flex-col items-center m-auto w-full md:w-[34rem] px-4">
    <h2 class="text-[#D0C1F6] font-obv font-medium">
      {#if noteData?.exp == 0}
        This note can only be viewed once.
      {:else}
        This note expires in {countdown}
      {/if}
    </h2>
    <p class="text-[#5B478D] font-obv text-sm text-center max-w-sm mt-2">
      {#if noteData?.exp == 0}
        This note has already vanished. Before leaving, ensure you've copied it
        if necessary.
      {:else if noteData.mode == "p"}
        You'll need to re-enter the password if you leave or refresh.
      {/if}
    </p>

    <textarea
      class="border mt-8 border-[#241C52]/80 flex flex-col w-full rounded-lg group bg-gradient-to-b text-[#D0C1F6] from-[#381881]/30 to-transparent bg-transparent selection:bg-[#28205B] resize-none h-[12rem] px-3.5 py-2.5 outline-none"
      readonly
      bind:value={decryptedNoteContent}
    />
  </div>
{:else}
  <div class="flex flex-col items-center m-auto w-full md:w-[34rem] px-4">
    <h2 class="text-[#D0C1F6] font-obv font-medium">
      {#if noteData?.exp == 0}
        This note can only be viewed once.
      {:else}
        This note expires in {countdown}
      {/if}
    </h2>
    {#if noteData?.exp == 0}
      <p class="text-[#5B478D] font-obv text-sm text-center max-w-xs mt-2">
        After the link is opened, the note will not be accessible anymore.{" "}
      </p>
    {/if}

    {#if noteData?.mode == "p"}
      <input
        bind:value={password}
        placeholder="Password"
        class="w-full mt-8 focus:border-[#352A7A] focus:outer-ring text-sm rounded-lg border border-[#241C52]/80 bg-gradient-to-b disabled:bg-none text-[#D0C1F6] from-[#381881]/30 to-transparent bg-transparent selection:bg-[#28205B] placeholder:text-[#7059a9] disabled:placeholder:text-[#7059a9]/50 px-3 py-2 focus:outline-none"
        type="text"
      />
    {/if}
    <button
      on:click={viewNote}
      class={clsx(
        noteData?.mode == "p" ? "mt-3" : "mt-8",
        " w-full font-medium active:translate-y-[2px] bg-white hover:bg-opacity-95 transition rounded-[6px] depth-white py-2"
      )}
    >
      View Note
    </button>
  </div>
{/if}
