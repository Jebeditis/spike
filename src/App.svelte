<script lang="ts">
  import JSBI from 'jsbi';
  import { onMount } from 'svelte';
  import { importPublicKey } from './utils/import-public-key';
  import PinBlock from './components/pin-block.svelte';
  import EncryptedContents from './components/encrypted-contents.svelte';

  let pin = '1234';
  let pan = '1040000533921277526';
  let pinBlock = '';
  let panBlock = '';
  let ansiPinBlock = '';
  let encryptedAnsiPinBlock = '';
  let publicKey = null;

  const reset = () => {
    pinBlock = '';
    panBlock = '';
    ansiPinBlock = '';
    encryptedAnsiPinBlock = '';
  };

  const createPinBlock = (pin: string) => {
    const MAX_PIN_LENGTH = 16;
    const basePin = `0${pin.length}${pin}`;
    return basePin.padEnd(MAX_PIN_LENGTH, 'F');
  };

  const createPanBlock = (pan: string) => {
    const PAN_LENGTH = pan.length;
    const MAX_PAN_LENGTH = 12;
    return `0000${pan.substring(PAN_LENGTH - MAX_PAN_LENGTH - 1, PAN_LENGTH - 1)}`;
  };

    const createXorHexStrings = (input: string, key: string) => {
    // Convert HEX strings to binary strings
    const binaryA = JSBI.BigInt(`0x${input}`).toString(2);
    const binaryB = JSBI.BigInt(`0x${key}`).toString(2);

    // Ensure both binary strings have the same length by padding zeros
    const maxLength = Math.max(binaryA.length, binaryB.length);
    const paddedBinaryA = binaryA.padStart(maxLength, '0');
    const paddedBinaryB = binaryB.padStart(maxLength, '0');
    const binaryXor = Array.from(
      { length: maxLength },
      (_, idx) => paddedBinaryA[idx] ^ paddedBinaryB[idx],
    ).join('');

    // Convert the resulting binary string back to HEX
    return JSBI.BigInt(`0b${binaryXor}`)
      .toString(16)
      .toUpperCase()
      .padStart(16, '0');
  };

  const generateAnsiPinBlock = () => {
    pinBlock = createPinBlock(pin);
    panBlock = createPanBlock(pan);
    ansiPinBlock = createXorHexStrings(pinBlock, panBlock);
  };

  const loadPublicKey = async () => {
    const response = await fetch('/public.pem');
    const text = await response.text();
    publicKey = await importPublicKey(text);
  };

  const setEncryptedAnsiPinBlock = encryptedPinBlock => encryptedAnsiPinBlock = encryptedPinBlock;

  onMount(() => {
    loadPublicKey();
  });
</script>

<article>
  <h5>Enter PIN and PAN</h5>
  <label>
    PIN
    <input on:input={reset} bind:value={pin} placeholder="pin" />
  </label>
  <label>
    PAN
    <input on:input={reset} bind:value={pan} placeholder="pan" />
  </label>
  <button on:click={generateAnsiPinBlock}>Generate PIN block</button>
</article>

{#if pinBlock && panBlock && ansiPinBlock}
  <PinBlock {panBlock} {pinBlock} {ansiPinBlock} {publicKey} {setEncryptedAnsiPinBlock} />
{/if}

{#if encryptedAnsiPinBlock}
  <EncryptedContents {pan} {encryptedAnsiPinBlock} />
{/if}

  <!-- {#if !decodedAnsiPinBlock && encryptedAnsiPinBlock}
    <button on:click={() => setDecryptedAnsiPinBlock(encryptedAnsiPinBlock)}>Decrypt ANSI PIN block using private key</button>
  {/if}

  {#if decodedAnsiPinBlock}
    <p>Decrypted ANSI PIN block<br /> {decodedAnsiPinBlock}</p>
    <p>PIN block after passing decrypted ANSI PIN block and PAN block through xor cipher function<br /> {pinBlockFromDecodedAnsiPinBlock}</p>
  {/if} -->
<style>
  article { width: 500px }
</style>