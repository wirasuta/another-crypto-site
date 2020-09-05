import { CryptoSuite } from '../../interfaces';
import { ctob26, b26toc } from '../utils';

export class Vigenere implements CryptoSuite {
  encrypt(plaintext: string | ArrayBuffer, key: string, opts: any) {
    if (typeof plaintext === 'string') {
      return this._vigenereBase26(plaintext, key, true);
    } else {
      // TODO: Handle binary
      return '';
    }
  }

  decrypt(ciphertext: string | ArrayBuffer, key: string, opts: any) {
    if (typeof ciphertext === 'string') {
      return this._vigenereBase26(ciphertext, key, false);
    } else {
      // TODO: Handle binary
      return '';
    }
  }

  private _vigenereBase26(plaintext: string, key: string, encrypt: boolean) {
    const keyLen = key.length;
    const res = [];

    for (let i = 0; i < plaintext.length; i++) {
      const ch = ctob26(plaintext[i]);
      const ad = ctob26(key[i % keyLen]);
      const cr = encrypt ? (ch + ad) % 26 : (((ch - ad) % 26) + 26) % 26;
      res.push(b26toc(cr));
    }

    return res.join('');
  }
}
