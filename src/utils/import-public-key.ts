const str2ab = (str: string) => {
  const buffer = new ArrayBuffer(str.length);
  const bufferView = new Uint8Array(buffer);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufferView[i] = str.charCodeAt(i);
  }
  return buffer;
};

export const importPublicKey = (pem: string) => {
  const pemHeader = `-----BEGIN PUBLIC KEY-----`;
  const pemFooter = `-----END PUBLIC KEY-----`;
  const pemContents = pem.substring(
    pemHeader.length,
    pem.length - pemFooter.length
  );
  // base64 decode the string to get the binary data
  const binaryDerString = window.atob(pemContents);
  return window.crypto.subtle.importKey(
    'spki',
    str2ab(binaryDerString),
    {
      name: 'RSA-OAEP',
      hash: { name: 'SHA-256' },
    },
    true,
    ['encrypt']
  );
};
