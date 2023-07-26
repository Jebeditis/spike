<script lang="ts">
  import { encryptMessage } from '../utils/encrypt-message.ts';

  export let pinBlock: string;
  export let panBlock: string;
  export let ansiPinBlock: string;
  export let publicKey: CryptoKey;
  export let setEncryptedAnsiPinBlock: (string) => void;

  const encryptPinBlock = async () => {
    const encodedAnsiPinBlock = new TextEncoder().encode(ansiPinBlock);
    const encryptedAnsiPinBlock = await encryptMessage(encodedAnsiPinBlock, publicKey);
    setEncryptedAnsiPinBlock(encryptedAnsiPinBlock);
  };
</script>

<article>
  <h5>Pin block</h5>
  <p>PIN block<br/> {pinBlock}</p>
  <p>PAN block<br/> {panBlock}</p>
  <p>ANSI PIN block<br/> {ansiPinBlock}</p>
  <button on:click={encryptPinBlock}>Encrypt PIN block</button>
</article>