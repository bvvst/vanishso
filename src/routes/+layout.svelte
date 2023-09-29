<script>
  import "../app.css";
  import security from "$lib/assets/security.svg";
  import source from "$lib/assets/source.svg";
  import email from "$lib/assets/email.svg";
  import heart from "$lib/assets/heart.svg";
  import { inject } from "@vercel/analytics";
  import { dev } from "$app/environment";

  inject({ mode: dev ? "development" : "production" });
</script>

<svelte:head>
  <title>vanish.so - secure vanishing notes</title>
  <meta
    name="description"
    content="open source end-to-end encrypted vanishing notes"
  />

  <meta property="og:url" content="https://www.vanish.so/" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="vanish.so - secure vanishing notes" />
  <meta
    property="og:description"
    content="open source end-to-end encrypted vanishing notes"
  />
  <meta property="og:image" content="https://www.vanish.so/og.png" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta property="twitter:domain" content="vanish.so" />
  <meta property="twitter:url" content="https://www.vanish.so/" />
  <meta name="twitter:title" content="vanish.so - secure vanishing notes" />
  <meta
    name="twitter:description"
    content="open source end-to-end encrypted vanishing notes"
  />
  <meta name="twitter:image" content="https://www.vanish.so/og.png" />
</svelte:head>
<main
  class="w-screen md:gap-0 gap-20 md:h-screen min-h-screen overflow-hidden flex flex-col items-center relative"
>
  <div
    class="absolute mx-auto bg-[#6F32F0] w-[40rem] rounded-[50%] h-[10rem] blur-[100px] -top-32 -z-10"
  />
  <div
    class="absolute mx-auto bg-[#6F32F0] w-[40rem] rounded-[50%] h-[10rem] blur-[100px] -bottom-56 -z-10"
  />
  <div
    class="absolute mx-auto bg-[#CDB8FC] w-[40rem] rounded-[50%] h-[10rem] blur-[200px] -bottom-64 -z-10"
  />
  <svg class="absolute mx-auto -z-10" width="900" height="200">
    <circle cx="7" cy="78" r="1" fill="white" fill-opacity="0.52" />
    <circle cx="42" cy="125" r="1" fill="white" fill-opacity="0.67" />
    <circle cx="362" cy="116" r="1" fill="white" fill-opacity="0.45" />
    <circle cx="707" cy="197" r="1" fill="white" fill-opacity="0.89" />
    <circle cx="601" cy="18" r="1" fill="white" fill-opacity="0.76" />
    <circle cx="852" cy="97" r="1" fill="white" fill-opacity="0.33" />
    <circle cx="234" cy="88" r="1" fill="white" fill-opacity="0.95" />
    <circle cx="800" cy="170" r="1" fill="white" fill-opacity="0.21" />
    <circle cx="296" cy="4" r="1" fill="white" fill-opacity="0.58" />
    <circle cx="406" cy="88" r="1" fill="white" fill-opacity="0.41" />
    <circle cx="103" cy="158" r="1" fill="white" fill-opacity="0.62" />
  </svg>
  <div class="flex flex-col items-center px-10">
    <a href="/" data-sveltekit-reload>
      <h1 class="font-fancy text-white font-obvwide text-3xl mt-8">
        vanish<span class="text-[#BCA4F5]/30">.</span><span
          class="text-[#A988F6]">so</span
        >
      </h1>
    </a>

    <span class="text-[#5B478D] text-sm mt-4 font-obv text-center"
      >vanishing notes. open source. end to end encrypted.</span
    >
  </div>
  <slot />
  <script
    async
    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7783535633029345"
    crossorigin="anonymous"
  ></script>
  <!-- r -->
  <ins
    class="adsbygoogle"
    style="display:block"
    data-ad-client="ca-pub-7783535633029345"
    data-ad-slot="6198772991"
    data-ad-format="auto"
    data-full-width-responsive="true"
  />
  <script>
    (adsbygoogle = window.adsbygoogle || []).push({});
  </script>
  <div
    class="flex flex-col md:flex-row items-center mx-auto mb-8 gap-6 md:gap-20 text-[#7059a9] font-fancy font-obv font-medium text-sm"
  >
    <a href="/" class="flex gap-2 items-center">
      <img class="h-4 w-4" alt="security icon" src={security} />
      <p class="mb-1.5">security</p>
    </a>
    <a href="https://github.com/bvvst/vanishso" class="flex gap-2 items-center">
      <img class="h-4 w-4" alt="source icon" src={source} />
      <p class="mb-1.5">source code</p>
    </a>
    <a href="/" class="flex gap-2 items-center">
      <img class="h-4 w-4" alt="email icon" src={email} />
      <p class="mb-1.5">contact</p>
    </a>
    <a href="/" class="flex gap-2 items-center">
      <img class="h-4 w-4" alt="heart icon" src={heart} />
      <p class="mb-1.5">support me</p>
    </a>
  </div>
</main>
