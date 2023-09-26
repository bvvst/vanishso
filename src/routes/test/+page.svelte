<script lang="ts">
  import { otp, generateRandomKey } from "$lib/otp";
  let input = "";

  const handle = async () => {
    const key = await generateRandomKey(input.length);
    const encrypted = otp(input, key, "encrypt", false);
    console.log("encrypted: ", encrypted);
    console.log("key: ", key);
    const decrypted = otp(encrypted, key, "decrypt", false);
    console.log("decrypted: ", decrypted);
  };
</script>

<div>
  <input bind:value={input} type="text" />
  <button on:click={handle} class="px-3 py-2 bg-blue-500">cipher</button>
</div>
