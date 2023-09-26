<script lang="ts">
  import clsx from "clsx";
  import expiryIcon from "$lib/assets/expiry.svg";
  import lockIcon from "$lib/assets/lock.svg";
  import keyIcon from "$lib/assets/key.svg";
  import viewIcon from "$lib/assets/view.svg";

  export let expiry: string;
  export let customPassword: string;
  export let confirmBeforeViewing: boolean;
  export let mode: string;

  let expanded = false;
  const expiryOptions = ["viewing", "1h", "24h", "7d", "30d"];
  const modeOptions = ["OTP", "AES", "Custom Password"];

  // Define the function
  function onCustomPasswordChange() {
    if (customPassword !== "") {
      mode = "Custom Password";
    }
  }

  // Set up the reactive statement
  $: if (customPassword !== undefined) onCustomPasswordChange();
</script>

<div class="flex flex-col w-full border-t border-[#241C52]/80">
  {#if expanded}
    <div
      class="p-4 pl-5 flex md:flex-row flex-col items-center justify-between"
    >
      <div class="gap-2 flex items-center">
        <img alt="expiry icon" src={keyIcon} />
        <p class=" text-[#8C77C0] text-sm font-medium">Mode</p>
      </div>
      <div
        class="ring-1 md:mt-0 mt-4 ring-[#241C52]/80 bg-black/5 flex rounded-full overflow-hidden p-0.5 gap-0.5"
      >
        {#each modeOptions as option}
          <button
            on:click={() => {
              mode = option;
            }}
            class={clsx(
              option == mode
                ? "bg-[#281A55] text-white"
                : "hover:bg-[#281A55]/40 text-[#8C77C0]",
              "py-1.5 px-3 text-sm rounded-md first:first-tab last:last-tab"
            )}
          >
            {option}
          </button>
        {/each}
      </div>
    </div>
    <div
      class="p-4 pl-5 pt-2 flex md:flex-row flex-col items-center justify-between"
    >
      <div class="gap-2 flex items-center">
        <img alt="expiry icon" src={expiryIcon} />
        <p class=" text-[#8C77C0] text-sm font-medium">Expires After</p>
      </div>
      <div
        class="ring-1 md:mt-0 mt-4 ring-[#241C52]/80 bg-black/5 flex rounded-full overflow-hidden p-0.5 gap-0.5"
      >
        {#each expiryOptions as option}
          <button
            on:click={() => {
              expiry = option;
            }}
            class={clsx(
              option == expiry
                ? "bg-[#281A55] text-white"
                : "hover:bg-[#281A55]/40 text-[#8C77C0]",
              "py-1.5 px-3 text-sm rounded-md first:first-tab last:last-tab"
            )}
          >
            {option}
          </button>
        {/each}
      </div>
    </div>

    <div class="p-4 pl-5 pt-2 flex flex-col">
      <div class="flex items-center justify-between">
        <div class="gap-2 flex items-center w-full">
          <img alt="lock icon" src={lockIcon} />
          <p class=" text-[#8C77C0] text-sm font-medium">Custom Password</p>
        </div>
        <input
          bind:value={customPassword}
          placeholder="Custom Password (Optional)"
          class="w-full focus:border-[#352A7A] focus:outer-ring text-sm rounded-lg border border-[#241C52]/80 bg-gradient-to-b disabled:bg-none text-[#D0C1F6] from-[#381881]/30 to-transparent bg-transparent selection:bg-[#28205B] placeholder:text-[#7059a9] disabled:placeholder:text-[#7059a9]/50 px-3 py-2 focus:outline-none"
          type="text"
        />
      </div>
    </div>
    {#if customPassword == ""}
      {#if expiry == "viewing"}
        <div class="p-4 pl-5 pt-2 flex items-center justify-between">
          <div class="gap-2 flex items-center">
            <img alt="view icon" src={viewIcon} />
            <p class=" text-[#8C77C0] text-sm font-medium md:w-full w-32">
              Show confirmation before viewing and vanishing
            </p>
          </div>
          <button
            on:click={() => {
              confirmBeforeViewing = !confirmBeforeViewing;
            }}
            class={clsx(
              confirmBeforeViewing ? "bg-[#D0C1F6]" : "",
              "rounded-full bg-[#6448A7] w-10 h-7 flex items-center pl-0.5 transition"
            )}
          >
            <div
              class={clsx(
                confirmBeforeViewing ? "translate-x-3 " : "",
                "rounded-full w-6 h-6 bg-[#121420] transition"
              )}
            />
          </button>
        </div>
      {/if}
    {/if}
  {/if}

  <button
    on:click={() => {
      expanded = !expanded;
    }}
    type="button"
    class="bg-transparent font-medium hover:bg-[#381881]/10 text-[#8C77C0] w-full py-2 text-sm"
  >
    {expanded ? "Hide Options" : "Show Options"}
  </button>
</div>
