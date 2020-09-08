export interface CryptoSuite {
  encrypt(plaintext: string, key: string, opts: any): string;
  decrypt(ciphertext: string, key: string, opts: any): string;
}
