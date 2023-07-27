<script lang="ts">
  import JSBI from 'jsbi';
  import { onMount } from 'svelte';
  import { importPublicKey } from './utils/import-public-key';
  import { importPrivateKey } from './utils/import-private-key';
  import PinBlock from './components/pin-block.svelte';
  import EncryptedContents from './components/encrypted-contents.svelte';

  let pin = '1234';
  let pan = '1040000533921277526';
  let pinBlock = '';
  let panBlock = '';
  let ansiPinBlock = '';
  let encryptedAnsiPinBlock = '';
  let publicKey = null;
  let privateKey = null;

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

  const loadPrivateKey = async () => {
    const response = await fetch('/private.pem');
    const text = await response.text();
    privateKey = await importPrivateKey(text);
  };

  const setEncryptedAnsiPinBlock = encryptedPinBlock => encryptedAnsiPinBlock = encryptedPinBlock;

  onMount(() => {
    loadPublicKey();
    loadPrivateKey();
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

{#if encryptedAnsiPinBlock && privateKey}
  <EncryptedContents {pan} {encryptedAnsiPinBlock} {ansiPinBlock} {privateKey} />
{/if}

<style>
  article { width: 500px }
</style>