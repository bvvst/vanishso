<script lang="ts">
  import { onMount } from "svelte";
  import { decrypt, deriveKey, hashKey, keyToString, stringToKey } from "$lib";
  import clsx from "clsx";
  import { otp } from "$lib/otp";
  import Modal from "$lib/Modal.svelte";
  import Caution from "$lib/assets/caution.svg";

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
      await readNoteWithCipherKey(fragment);
    } else if (noteData.mode == "p") {
      const key = await deriveKey(password, noteData.cs);
      console.log("reading with key: ", await keyToString(key));
      await readNoteWithKey(key);
    } else {
      const fragment = window.location.href.split("#")[1] || "";
      if (fragment == "") {
        console.log("bruh");
        return;
      }
      const key = await stringToKey(fragment);
      await readNoteWithKey(key);
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

  let textArea: HTMLTextAreaElement;
  let showFadeOut = false;
  let fadeOutPercentage = "";
</script>

{#if !noteData}
  <div class="flex flex-col items-center m-auto max-w-[34rem] px-4">
    <h2 class="text-white font-semibold text-xl">404</h2>
    <a
      href="/"
      class="text-primary hover:underline font-medium text-sm text-center max-w-xs mt-2"
    >
      This note doesn’t exist, or it expired, or maybe it never existed.
    </a>
  </div>
{:else if decrypted}
  <div class="flex flex-col w-full max-w-2xl h-full px-10 mt-6">
    <div class="flex font-geist text-primary items-start gap-2">
      <img class="mt-1" src={Caution} alt="" />
      <p class="font-normal font-obv text-sm max-w-s">
        {#if noteData?.exp == 0}
          This note has vanished. Before leaving, ensure you've copied it if
          necessary.
        {:else if noteData.mode == "p"}
          You'll need to re-enter the password if you leave or refresh.
        {:else}
          This note vanishes in
          <span class="font-semibold">{countdown}</span>
        {/if}
      </p>
    </div>
    <div class="flex w-full h-full gap-24 font-geist mt-7">
      <div class="flex flex-col h-full gap-2 w-full mx-auto max-w-2xl">
        <textarea
          bind:this={textArea}
          on:scroll={() => {
            if (textArea.scrollTop > 0) {
              console.log("true");
              showFadeOut = true;

              // calculate the percentage of the textArea height equivalent to 20px
              let fadeOutPercentageNumber =
                100 - (100 * 20) / textArea.clientHeight;

              fadeOutPercentage = `${fadeOutPercentageNumber}%`;
            } else {
              showFadeOut = false;
            }
          }}
          class={clsx(
            showFadeOut && "fade-out",
            "caret-[#845FEE] note-scroll-bar h-full min-h-[20px] text-sm w-full font-medium font-mono text-primary bg-transparent selection:bg-orchid/50 placeholder:text-primary/60 focus:outline-none resize-none"
          )}
          style="
        max-height: calc(100vh - 256px);
        --percentage: {fadeOutPercentage};
      "
          bind:value={decryptedNoteContent}
        />
      </div>
    </div>
  </div>
{:else}
  <Modal>
    <svelte:fragment slot="header">
      <h2 class="text-white text-center font-clash font-semibold text-xl">
        {#if noteData?.exp == 0}
          This note can only be viewed once.
        {:else}
          This note vanishes in
        {/if}
      </h2>
      {#if noteData?.exp == 0}
        <p
          class="text-primary font-clash font-medium text-sm text-center max-w-[300px] mt-3"
        >
          After the link is opened, the note will not be accessible anymore.{" "}
        </p>
      {:else}
        <h2 class="text-primary font-clash font-semibold text-xl">
          {countdown}
        </h2>
      {/if}
    </svelte:fragment>
    <svelte:fragment slot="content">
      {#if noteData?.mode == "p"}
        <input
          bind:value={password}
          placeholder="Password"
          class=" bg-[#16151C] w-full font-geist focus:border-orchid text-sm rounded-lg border border-[#BC9CFF]/10 text-primary selection:bg-orchid/40 placeholder:text-primary/60 disabled:placeholder:text-[#7059a9]/50 px-2.5 py-2 focus:outline-none"
          type="text"
        />
      {/if}
      <button
        on:click={viewNote}
        class={clsx(
          noteData?.mode == "p" && "mt-4",
          "purple-button bg-orchid hover:bg-orchid-100 px-3.5 text-sm text-white font-semibold active:translate-y-[2px] transition rounded-lg py-2"
        )}
      >
        View Note
      </button>
    </svelte:fragment>
  </Modal>
{/if}
