import { CryptoSuite } from '../../interfaces';
import {
  ctob26,
  b26toc,
  groupByFive,
  ungroupByFive,
  pmod,
  removeNonUppercase,
} from '../utils';

export class Vigenere implements CryptoSuite {
  encrypt(plaintext: string | ArrayBuffer, key: string, opts: any) {
    if (typeof plaintext === 'string') {
      const text = removeNonUppercase(plaintext);
      return this._vigenereBase26(text, key, true, opts);
    } else {
      // TODO: Handle binary
      return '';
    }
  }

  decrypt(ciphertext: string | ArrayBuffer, key: string, opts: any) {
    if (typeof ciphertext === 'string') {
      const text = removeNonUppercase(ciphertext);
      return this._vigenereBase26(text, key, false, opts);
    } else {
      // TODO: Handle binary
      return '';
    }
  }

  private _vigenereBase26(
    plaintext: string,
    key: string,
    encrypt: boolean,
    opts: any
  ) {
    const keyLen = key.length;
    const grouped = opts.display === 'grouped';
    const res = [];

    if (grouped && !encrypt) {
      plaintext = ungroupByFive(plaintext);
    }

    for (let i = 0; i < plaintext.length; i++) {
      const ch = ctob26(plaintext[i]);
      const ad = ctob26(key[i % keyLen]);
      const cr = encrypt ? (ch + ad) % 26 : pmod(ch - ad, 26);
      res.push(b26toc(cr));
    }

    let resText = res.join('');
    if (grouped && encrypt) {
      resText = groupByFive(resText);
    }

    return resText;
  }
}
