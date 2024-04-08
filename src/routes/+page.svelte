<script lang="ts">
  import clsx from "clsx";
  import { otp, generateRandomKey } from "$lib/otp";
  import OptionsIcon from "$lib/assets/options.svg";
  import Modal from "$lib/Modal.svelte";
  import {
    generateAESKey,
    deriveKey,
    encrypt,
    hashKey,
    keyToString,
    generateSalt,
  } from "$lib";
  import { onMount } from "svelte";
  import Select from "$lib/Select.svelte";

  let noteUrl = "";
  let noteContent = "";
  let copied = false;
  let customPassword = "";
  let expiry = "viewing";
  let confirmBeforeViewing = true;
  let mode = "OTP";

  const handleSubmit = async () => {
    // if (noteContent == "") {
    //   return;
    // }

    let key: CryptoKey | null = null;
    let cipherKey = "";
    let s = "";
    let encrypted = "";
    let hash = "";
    let m = "";

    if (mode == "OTP") {
      m = "otp";
      cipherKey = await generateRandomKey(noteContent.length);
      encrypted = otp(noteContent, cipherKey, "encrypt", false);
    } else if (mode == "Password") {
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
    } else if (mode == "Password") {
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

    // clear memory of sensitive data to be safe
    noteContent = "";
    customPassword = "";
    key = null;
    cipherKey = "";
    s = "";
    encrypted = "";
    hash = "";
    m = "";
  };

  let textArea: HTMLTextAreaElement;

  onMount(() => {
    textArea.focus();

    // check if mobile device
    if (window.innerWidth < 768) {
      showOptions = true;
    }
  });

  let showFadeOut = false;
  let fadeOutPercentage = "";

  let showOptions = false;

  const expiryOptions = ["viewing", "1h", "24h", "7d", "30d"];
  const modeOptions = ["OTP", "AES", "Password"];

  function onCustomPasswordChange() {
    if (customPassword !== "") {
      mode = "Password";
    }
  }

  // Set up the reactive statement
  $: if (customPassword !== undefined) onCustomPasswordChange();
</script>

{#if noteUrl == ""}
  <div
    class="flex flex-col sm:flex-row w-full h-full max-w-5xl px-10 sm:gap-24 font-geist mt-6"
  >
    <div class="flex flex-col gap-2 w-full mx-auto max-w-2xl">
      <textarea
        bind:this={textArea}
        on:scroll={() => {
          if (textArea.scrollTop > 0) {
            showFadeOut = true;

            // calculate the percentage of the textArea height equivalent to 20px
            let fadeOutPercentageNumber =
              100 - (100 * 20) / textArea.clientHeight;

            fadeOutPercentage = `${fadeOutPercentageNumber}%`;
          } else {
            showFadeOut = false;
          }
        }}
        on:input={() => {
          textArea.style.height = "auto";
          textArea.style.height = textArea.scrollHeight + "px";
        }}
        placeholder={`type a note that vanishes after ${expiry}`}
        class={clsx(
          showFadeOut && "fade-out",
          "caret-[#845FEE] note-scroll-bar overflow-y-auto min-h-[20px] text-sm w-full font-medium font-mono text-primary bg-transparent selection:bg-orchid/50 placeholder:text-primary/60 focus:outline-none resize-none"
        )}
        required
        style="--percentage: {fadeOutPercentage};"
        bind:value={noteContent}
      />

      <div class="flex gap-1 w-full mt-10">
        <button
          on:click={handleSubmit}
          class={clsx(
            noteContent == ""
              ? "bg-opacity-50 text-primary/60 bg-primary/10 cursor-default"
              : "purple-button bg-orchid hover:bg-orchid-100",
            "w-full text-sm  font-semibold active:translate-y-[2px]   transition rounded-l-lg rounded-r-sm py-2 "
          )}
        >
          generate link
        </button>
        <button
          on:click={() => {
            showOptions = !showOptions;
          }}
          class="active:translate-y-[2px] bg-[#2D2A3D] selected-option py-2 transition flex h-full justify-center items-center rounded-r-lg rounded-l-sm px-1.5 w-14"
        >
          <img class="w-5 h-5 pointer-events-none" src={OptionsIcon} alt="" />
        </button>
      </div>
      {#if showOptions}
        <div class="flex w-full my-10">
          <div
            class="flex flex-col sm:flex-row gap-8 sm:mx-auto w-full sm:w-auto"
          >
            <div class="flex flex-col gap-2">
              <p class=" text-white text-sm font-semibold">Mode</p>
              <Select bind:value={mode} options={modeOptions} />
            </div>
            <div class="h-14 w-[1px] bg-primary/20 hidden sm:block"></div>
            <div class="flex flex-col gap-2">
              <p class=" text-white text-sm font-semibold">Expires After</p>
              <Select bind:value={expiry} options={expiryOptions} />
            </div>
            <div class="h-14 w-[1px] bg-primary/20 hidden sm:block"></div>

            {#if mode == "Password"}
              <div class="flex flex-col gap-2">
                <p class=" text-white text-sm font-semibold">Password</p>
                <input
                  bind:value={customPassword}
                  placeholder="Password"
                  class=" px-2.5 py-1 bg-[#16151C]/50 focus:border-orchid text-sm rounded-lg text-white selection:bg-orchid/40 placeholder:text-primary/60 focus:outline-none"
                  type="text"
                />
              </div>
            {:else if expiry == "viewing"}
              <div class="flex flex-col gap-2">
                <p class=" text-white text-sm font-semibold">
                  Confirm before viewing
                </p>

                <Select
                  bind:value={confirmBeforeViewing}
                  options={[true, false]}
                />
              </div>
            {/if}
          </div>
        </div>
      {/if}
    </div>
  </div>
{:else}
  <div class="flex flex-col m-auto">
    <Modal>
      <svelte:fragment slot="header">
        <h2 class="text-white font-clash font-semibold text-xl">
          shh... Your link is ready.
        </h2>
        <p
          class="text-primary font-clash font-medium text-sm text-center max-w-[300px] mt-3"
        >
          After the link is opened, the note will not be accessible anymore.{" "}
        </p>
      </svelte:fragment>
      <svelte:fragment slot="content">
        <p class="text-sm text-white font-semibold font-geist">
          Shareable Link
        </p>
        <div class="flex gap-1 mt-2.5">
          <input
            on:click={() => {
              navigator.clipboard.writeText(noteUrl);
              copied = true;
            }}
            bind:value={noteUrl}
            readOnly
            class=" bg-[#16151C] w-full font-geist focus:border-orchid text-sm rounded-l-lg rounded-r-sm border border-[#BC9CFF]/10 text-primary selection:bg-orchid/40 placeholder:text-primary/60 disabled:placeholder:text-[#7059a9]/50 px-2.5 py-2 focus:outline-none"
            type="text"
          />
          <button
            on:click={() => {
              navigator.clipboard.writeText(noteUrl);
              copied = true;
            }}
            class="purple-button bg-orchid hover:bg-orchid-100 px-3.5 text-sm text-white font-semibold active:translate-y-[2px] transition rounded-r-lg rounded-l-sm py-2"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </svelte:fragment>
    </Modal>

    <a
      href="/"
      data-sveltekit-reload
      class="text-primary hover:text-white font-medium font-geist text-sm text-center mt-5"
    >
      Make a new note
    </a>
  </div>
{/if}
