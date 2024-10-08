// utility.js
export function generateRandomString(length) {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    return Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('');
  }
  
  export function base64URLEncode(str) {
    return btoa(String.fromCharCode.apply(null, new Uint8Array(str)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }
  
  export async function sha256(plain) {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return await window.crypto.subtle.digest('SHA-256', data);
  }
  
  export async function generateCodeChallenge(codeVerifier) {
    const hashed = await sha256(codeVerifier);
    return base64URLEncode(hashed);
  }
  