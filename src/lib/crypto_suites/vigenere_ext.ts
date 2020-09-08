import { CryptoSuite } from '../../interfaces';
import {
  ctob256,
  b256toc,
  groupByFive,
  ungroupByFive,
  pmod,
} from '../utils';

export class VigenereExt implements CryptoSuite {
  encrypt(plaintext: string | ArrayBuffer, key: string, opts: any) {
    if (typeof plaintext === 'string') {
      return this._vigenereBase256(plaintext, key, true, opts);
    } else {
      // TODO: Handle binary
      return '';
    }
  }

  decrypt(ciphertext: string | ArrayBuffer, key: string, opts: any) {
    if (typeof ciphertext === 'string') {
      return this._vigenereBase256(ciphertext, key, false, opts);
    } else {
      // TODO: Handle binary
      return '';
    }
  }

  private _vigenereBase256(
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
      const ch = ctob256(plaintext[i]);
      const ad = ctob256(key[i % keyLen]);
      const cr = encrypt ? (ch + ad) % 256 : pmod(ch - ad, 256);
      res.push(b256toc(cr));
    }

    let resText = res.join('');
    if (grouped && encrypt) {
      resText = groupByFive(resText);
    }

    return resText;
  }
}
