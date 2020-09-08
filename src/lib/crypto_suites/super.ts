import { CryptoSuite } from '../../interfaces';
import {
  ctob26,
  b26toc,
  groupByFive,
  ungroupByFive,
  pmod,
  removeNonUppercase,
} from '../utils';

export class Super implements CryptoSuite {
  encrypt(plaintext: string | ArrayBuffer, key: string, opts: any) {
    if (typeof plaintext === 'string') {
      const text = removeNonUppercase(plaintext);
      return this._superBase26(text, key, true, opts);
    } else {
      // TODO: Handle binary
      return '';
    }
  }

  decrypt(ciphertext: string | ArrayBuffer, key: string, opts: any) {
    if (typeof ciphertext === 'string') {
      const text = removeNonUppercase(ciphertext);
      return this._superBase26(text, key, false, opts);
    } else {
      // TODO: Handle binary
      return '';
    }
  }

  private _superBase26(
    plaintext: string,
    key: string,
    encrypt: boolean,
    opts: any
  ) {
    const keyLen = key.length;
    const grouped = opts.display === 'grouped';
    const vigenereRes = [];

    if (grouped && !encrypt) {
      plaintext = ungroupByFive(plaintext);
    }

    for (let i = 0; i < plaintext.length; i++) {
      const ch = ctob26(plaintext[i]);
      const ad = ctob26(key[i % keyLen]);
      const cr = encrypt ? (ch + ad) % 26 : pmod(ch - ad, 26);
      vigenereRes.push(b26toc(cr));
    }

    const textRemainder = vigenereRes.length % 6;
    if (textRemainder !== 0) {
      for (let i = 0; i < 6 - textRemainder; i++)
        vigenereRes.push('Z');
    }

    const vigenereText = vigenereRes.join('').match(/.{1,6}/g) || [];

    let superRes = [];
    for (let i = 0; i < 6; i++) {
      const column = [];
      for (let j = 0; j < vigenereText.length; j++) {
        column.push(vigenereText[j][i]);
      }
      superRes.push(column.join(''));
    }

    let resText = superRes.join('');
    if (grouped && encrypt) {
      resText = groupByFive(resText);
    }

    return resText;
  }
}
