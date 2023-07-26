<script lang="ts">
  import { Notyf } from 'notyf';

  export let encryptedAnsiPinBlock: string;
  export let pan: string;

  const notyf = new Notyf({ position: { x: 'left', y: 'top' } });
  const DATAPOWER_URL = '';

  const postToDatapower = async () => {
    const response = await fetch(DATAPOWER_URL, {
      method: 'POST',
      body: JSON.stringify({ pan, encrypted: encryptedAnsiPinBlock }),
    });
    if (response.status < 400) {
      return notyf.success('PIN change was successful');
    }
    return notyf.error('PIN change was unsuccessful');
  }
</script>

<article>
  <h5>Encrypted ANSI PIN block</h5>
  <code>{encryptedAnsiPinBlock}</code>
  <button on:click={() => postToDatapower(encryptedAnsiPinBlock)}>Post to Datapower</button>
</article>

<style>
  article { width: 500px }
  code { max-width: 100%; margin-bottom: 24px }
</style>