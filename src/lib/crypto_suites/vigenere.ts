import { CryptoSuite } from '../../interfaces';
import { ctob26, b26toc, groupByFive, ungroupByFive, pmod } from '../utils';

export class Vigenere implements CryptoSuite {
  encrypt(plaintext: string | ArrayBuffer, key: string, opts: any) {
    if (typeof plaintext === 'string') {
      return this._vigenereBase26(plaintext, key, true, opts);
    } else {
      // TODO: Handle binary
      return '';
    }
  }

  decrypt(ciphertext: string | ArrayBuffer, key: string, opts: any) {
    if (typeof ciphertext === 'string') {
      return this._vigenereBase26(ciphertext, key, false, opts);
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
    const preserve = opts.display === 'preserve';
    const grouped = opts.display === 'grouped';
    const res = [];

    if (grouped && !encrypt) {
      plaintext = ungroupByFive(plaintext);
    }

    for (let i = 0; i < plaintext.length; i++) {
      const ch = ctob26(plaintext[i]);

      if (preserve && (ch < 0 || ch > 25)) {
        res.push(plaintext[i]);
        continue;
      }

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
