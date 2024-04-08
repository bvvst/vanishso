<script lang="ts">
  import Expand from "$lib/assets/expand.svg";
  export let options: string[] | boolean[] = [];
  export let value: string | boolean = "";
</script>

<div
  class="bg-[#2D2A3D] flex selected-option text-white text-sm rounded-md relative"
>
  <img
    class="absolute top-1 right-1 w-5 h-5 pointer-events-none"
    src={Expand}
    alt=""
  />

  <select class="px-2.5 pr-7 py-1" bind:value>
    {#each options as option, i}
      <option selected={i == 0}>{option}</option>
    {/each}
  </select>
</div>
