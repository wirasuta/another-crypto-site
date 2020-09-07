import { CryptoSuite } from '../../interfaces';

export class Hill implements CryptoSuite {
  encrypt(plaintext: string | ArrayBuffer, key: string, opts: any) {
    return '';
  }

  decrypt(ciphertext: string | ArrayBuffer, key: string, opts: any) {
    return '';
  }
}
