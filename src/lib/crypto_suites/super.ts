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
    const grouped = opts.display === 'grouped';
    let vigenereRes = [];
    let superRes = [];
    let resText = '';

    if (grouped && !encrypt) {
      plaintext = ungroupByFive(plaintext);
    }

    if (encrypt) {
      vigenereRes = this._vigenereBase26(plaintext, key, encrypt);
      console.log('vig', vigenereRes);
      superRes = this._transpose(vigenereRes, encrypt);
      resText = superRes.join('');
    } else {
      superRes = this._transpose(plaintext.split(''), encrypt);
      const superResText = superRes.join('').replace(/Z*$/g, '');
      vigenereRes = this._vigenereBase26(superResText, key, encrypt);
      resText = vigenereRes.join('');
    }

    if (grouped && encrypt) {
      resText = groupByFive(resText);
    }

    return resText;
  }

  private _vigenereBase26(
    plaintext: string,
    key: string,
    encrypt: boolean
  ) {
    const keyLen = key.length;
    const vigenereRes = [];

    for (let i = 0; i < plaintext.length; i++) {
      const ch = ctob26(plaintext[i]);
      const ad = ctob26(key[i % keyLen]);
      const cr = encrypt ? (ch + ad) % 26 : pmod(ch - ad, 26);
      vigenereRes.push(b26toc(cr));
    }

    return vigenereRes;
  }

  private _transpose(
    text: Array<string>,
    encrypt: boolean
  ): Array<string> {
    const textRemainder = text.length % 6;
    if (textRemainder !== 0) {
      for (let i = 0; i < 6 - textRemainder; i++)
        text.push('Z');
    }

    const colNum = encrypt ? 6 : Math.ceil(text.length / 6);
    const regex = new RegExp(`.{1,${colNum}}`, 'g');
    const vigenereArr = text.join('').match(regex) || [];

    let superRes = [];
    for (let i = 0; i < colNum; i++) {
      const column = [];
      for (let j = 0; j < vigenereArr.length; j++) {
        column.push(vigenereArr[j][i]);
      }
      superRes.push(column.join(''));
    }

    return superRes || [];
  }
}
