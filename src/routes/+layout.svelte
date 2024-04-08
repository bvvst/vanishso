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
  class="w-screen h-screen overflow-hidden flex flex-col items-center relative"
>
  <div
    class="absolute mx-auto bg-[#6F32F0]/25 w-[40rem] rounded-[50%] h-[10rem] blur-[100px] -top-48 -z-10"
  />
  <div
    class="absolute mx-auto bg-[#6F32F0] w-[40rem] rounded-[50%] h-[10rem] blur-[200px] -bottom-96 -z-10"
  />
  <div class="flex items-center justify-between w-full max-w-5xl my-6 px-10">
    <a href="/" data-sveltekit-reload>
      <h1 class="font-semibold text-white font-clash text-2xl">
        vanish<span class="text-[#BCA4F5]/30">.</span><span
          class="text-[#8F69FA]">so</span
        >
      </h1>
    </a>
    <div class="flex items-center gap-6 text-primary font-medium text-sm">
      <a href="/" class="flex gap-2 items-center">
        <img class="h-4 w-4" alt="security icon" src={security} />
        <p class="hover:text-white transition-colors hidden sm:block">
          security
        </p>
      </a>
      <a
        href="https://github.com/bvvst/vanishso"
        class="flex gap-2 items-center"
      >
        <img class="h-4 w-4" alt="source icon" src={source} />
        <p class="hover:text-white transition-colors hidden sm:block">
          source code
        </p>
      </a>
      <a href="/" class="flex gap-2 items-center">
        <img class="h-4 w-4" alt="email icon" src={email} />
        <p class="hover:text-white transition-colors hidden sm:block">
          contact
        </p>
      </a>
    </div>
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
</main>
