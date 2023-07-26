const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

export const encryptMessage = async (
  encodedMessage: BufferSource,
  key: CryptoKey
) => {
  const ciphertext = await window.crypto.subtle.encrypt(
    { name: 'RSA-OAEP' },
    key,
    encodedMessage
  );
  return arrayBufferToBase64(ciphertext);
};
