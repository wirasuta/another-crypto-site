export interface CryptoSuite {
  encrypt(plaintext: string | ArrayBuffer, key: string, opts: any): string;
  decrypt(ciphertext: string | ArrayBuffer, key: string, opts: any): string;
}
