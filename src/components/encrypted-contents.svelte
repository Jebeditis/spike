<script lang="ts">
  import { Notyf } from 'notyf';
  import { decryptMessage } from '../utils/decrypt-message';

  export let encryptedAnsiPinBlock: string;
  export let privateKey: CryptoKey;
  export let pan: string;
  export let ansiPinBlock: string;

  const notyf = new Notyf({ position: { x: 'left', y: 'top' } });

  const postToDatapower = async () => {
    const response = await fetch(import.meta.env.VITE_DATAPOWER_URL, {
      method: 'POST',
      body: JSON.stringify({ pan, enc: encryptedAnsiPinBlock }),
    });
    if (response.status < 400) {
      return notyf.success('PIN change was successful');
    }
    return notyf.error('PIN change was unsuccessful');
  };

  const decryptWithPrivateKey = async () => {
    const decryptedAnsiPinBlock = await decryptMessage(encryptedAnsiPinBlock, privateKey);
    const decodedAnsiPinBlock = new TextDecoder().decode(decryptedAnsiPinBlock);
    console.log({ ansiPinBlock, decodedAnsiPinBlock });
    if (ansiPinBlock === decodedAnsiPinBlock) return notyf.success('PIN change was successful');
    return notyf.error('PIN change was unsuccessful');
  };
</script>

<article>
  <h5>Encrypted ANSI PIN block</h5>
  <code>{encryptedAnsiPinBlock}</code>
  <button on:click={postToDatapower}>Post to Datapower</button>
  <button on:click={decryptWithPrivateKey}>Decrypt with private key</button>
</article>

<style>
  article { width: 500px }
  code { max-width: 100%; margin-bottom: 24px }
</style>