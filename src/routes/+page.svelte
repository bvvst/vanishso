<script lang="ts">
  import Options from "./Options.svelte";
  import clsx from "clsx";
  import { otp, generateRandomKey } from "$lib/otp";
  import {
    generateAESKey,
    deriveKey,
    encrypt,
    hashKey,
    keyToString,
    generateSalt,
  } from "$lib";

  let noteUrl = "";
  let noteContent = "";
  let copied = false;
  let focused = false;
  let customPassword = "";
  let expiry = "viewing";
  let confirmBeforeViewing = true;
  let mode = "OTP";

  const handleSubmit = async () => {
    let key: CryptoKey | null = null;
    let cipherKey = "";
    let s = "";
    let encrypted = "";
    let hash = "";
    let m = "";

    if (mode == "OTP") {
      m = "otp";
      cipherKey = await generateRandomKey(noteContent.length);
      encrypted = await otp(noteContent, cipherKey, "encrypt", false);
    } else if (mode == "Custom Password") {
      m = "p";
      s = await generateSalt();
      key = await deriveKey(customPassword, s);
      encrypted = await encrypt(key, noteContent);
      hash = await hashKey(key);
    } else {
      m = "k";
      key = await generateAESKey();
      encrypted = await encrypt(key, noteContent);
      hash = await hashKey(key);
    }

    const res = await fetch("/api/new", {
      method: "POST",
      body: JSON.stringify({
        mode: m,
        encrypted: encrypted,
        exp: expiry,
        h: hash,
        confirmBeforeViewing: confirmBeforeViewing,
        s: s,
      }),
    });

    const { noteid } = await res.json();

    if (!res.ok) {
      // do error handling
      return;
    }

    if (mode == "OTP") {
      noteUrl = window.location.href + "n/" + noteid + "#" + cipherKey;
    } else if (mode == "Custom Password") {
      noteUrl = window.location.href + "n/" + noteid;
    } else {
      if (!key) {
        // do some error handling here
        return;
      }
      const _keyString = await keyToString(key);
      if (!_keyString) return;
      noteUrl = window.location.href + "n/" + noteid + "#" + _keyString;
    }
  };
</script>

{#if noteUrl == ""}
  <div class="flex flex-col m-auto items-center gap-2 w-full md:w-[34rem] px-4">
    <div
      class={clsx(
        focused
          ? "border border-[#352A7A] outer-ring"
          : "border border-[#241C52]/80",
        "flex flex-col w-full rounded-lg overflow-hidden group transition"
      )}
    >
      <textarea
        on:focus={() => {
          focused = true;
        }}
        on:blur={() => {
          focused = false;
        }}
        placeholder="type a note that vanishes after viewing..."
        class="bg-gradient-to-b text-[#D0C1F6] from-[#381881]/30 to-transparent bg-transparent selection:bg-[#28205B] placeholder:text-[#7059a9] resize-none h-[12rem] px-3.5 py-2.5 focus:outline-none"
        required
        bind:value={noteContent}
      />
      <Options
        bind:mode
        bind:confirmBeforeViewing
        bind:expiry
        bind:customPassword
      />
    </div>
    <button
      on:click={handleSubmit}
      class="mt-2 w-full font-medium active:translate-y-[2px] bg-white hover:bg-opacity-95 transition rounded-[6px] depth-white py-2"
    >
      Generate Link
    </button>
  </div>
{:else}
  <div class="flex flex-col m-auto items-center gap-2 w-full md:w-[34rem] px-4">
    <h2 class="text-[#D0C1F6] font-obv font-medium">Your link is ready.</h2>
    <p class="text-[#5B478D] font-obv text-sm text-center max-w-xs">
      After the link is opened, the note will not be accessible anymore.{" "}
    </p>
    <input
      bind:value={noteUrl}
      readOnly
      class="focus:outline-none mt-8 focus:border focus:border-[#352A7A] focus:outer-ring bg-gradient-to-b rounded-md bg-transparent px-2.5 py-1.5 overflow-hidden text-[#D0C1F6] from-[#381881]/10 to-transparent border border-[#241C52]/80 w-full"
      type="text"
    />
    <button
      on:click={() => {
        navigator.clipboard.writeText(noteUrl);
        copied = true;
      }}
      class="mt-2 w-full font-medium active:translate-y-[2px] active:shadow-none bg-white hover:bg-opacity-95 transition rounded-[6px] depth-white py-1.5"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
    <a
      href="/"
      data-sveltekit-reload
      class="text-[#5B478D] hover:underline font-obv text-sm text-center max-w-xs mt-2"
    >
      Make a new note
    </a>
  </div>
{/if}
