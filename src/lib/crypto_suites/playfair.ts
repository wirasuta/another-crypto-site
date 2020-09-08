import { CryptoSuite } from '../../interfaces';
import {
  groupByFive,
  ungroupByFive,
  removeNonUppercase,
  pmod,
  splice,
} from '../utils';

export class Playfair implements CryptoSuite {
  encrypt(plaintext: string | ArrayBuffer, key: string, opts: any) {
    if (typeof plaintext === 'string') {
      const text = removeNonUppercase(plaintext);
      key = removeNonUppercase(key);
      return this._enc(text, key, opts);
    } else {
      // TODO: Handle binary
      return '';
    }
  }

  decrypt(ciphertext: string | ArrayBuffer, key: string, opts: any) {
    if (typeof ciphertext === 'string') {
      const text = removeNonUppercase(ciphertext);
      key = removeNonUppercase(key);
      return this._dec(text, key, opts);
    } else {
      // TODO: Handle binary
      return '';
    }
  }

  private _enc(
    plaintext: string,
    key: string,
    opts: any
  ) {
    const grouped = opts.display === 'grouped';

    const keyMatrix = this._generateKeyMatrix(key);
    const processedText = this._handlePlainText(plaintext);

    const encryptedText = processedText?.map((text) => {
      let pos1 = this._getCharPos(text[0], keyMatrix);
      let pos2 = this._getCharPos(text[1], keyMatrix);

      if (pos1[0] === pos2[0]) {
        pos1[1] = pmod(pos1[1] - 1, 5);
        pos2[1] = pmod(pos2[1] - 1, 5);
      } else if (pos1[1] === pos2[1]) {
        pos1[0] = pmod(pos1[0] - 1, 5);
        pos2[0] = pmod(pos2[0] - 1, 5);
      } else {
        const colPos1 = pos1[1];
        pos1 = [pos1[0], pos2[1]];
        pos2 = [pos2[0], colPos1];
      }

      return this._getPosChar(pos1, keyMatrix) + this._getPosChar(pos2, keyMatrix);
    });

    let resText = encryptedText ? encryptedText.join('') : '';
    if (grouped) {
      resText = groupByFive(resText);
    }

    return resText;
  }

  private _dec(
    plaintext: string,
    key: string,
    opts: any
  ) {
    const grouped = opts.display === 'grouped';
    if (grouped) {
      plaintext = ungroupByFive(plaintext);
    }

    const keyMatrix = this._generateKeyMatrix(key);
    const processedText = this._handlePlainText(plaintext);

    const encryptedText = processedText?.map((text) => {
      let pos1 = this._getCharPos(text[0], keyMatrix);
      let pos2 = this._getCharPos(text[1], keyMatrix);

      if (pos1[0] === pos2[0]) {
        pos1[1] = (pos1[1] + 1) % 5;
        pos2[1] = (pos2[1] + 1) % 5;
      } else if (pos1[1] === pos2[1]) {
        pos1[0] = (pos1[0] + 1) % 5;
        pos2[0] = (pos2[0] + 1) % 5;
      } else {
        const colPos1 = pos1[1];
        pos1 = [pos1[0], pos2[1]];
        pos2 = [pos2[0], colPos1];
      }

      return this._getPosChar(pos1, keyMatrix) + this._getPosChar(pos2, keyMatrix);
    });

    let resText = encryptedText ? encryptedText.join('') : '';

    return resText.replace(/[X]/g, '');
  }

  private _getUniqueOccr = (text: string) => {
    return text.split('')
      .filter((item, pos, self) => {
        return self.indexOf(item) === pos;
      })
      .join('');
  }

  private _getMissingOccr = (text: string) => {
    const alphabets = 'ABCDEFGHIKLMNOPQRSTUVWXYZ'; // Without J

    return alphabets.split('')
      .filter((item) => {
        return text.indexOf(item) < 0;
      })
      .join('');
  }

  private _generateKeyMatrix = (text: string) => {
    const replacedText = text.replace(/[J]/g, '');
    const uniqueOccr = this._getUniqueOccr(replacedText);
    const matrixContent = uniqueOccr.concat(this._getMissingOccr(uniqueOccr));

    return matrixContent;
  }

  private _handlePlainText = (text: string) => {
    let replacedText = text.replace(/[J]/g, 'I');

    for (let i = 0; i < replacedText.length; i += 2) {
      if (replacedText[i] === replacedText[i + 1])
        replacedText = splice(replacedText, i + 1, 'X');
    }

    if (replacedText.length % 2 === 1)
      replacedText = splice(replacedText, replacedText.length, 'X');

    return replacedText.match(/.{1,2}/g);
  }

  private _getCharPos = (char: string, key: string) => {
    return [Math.floor(key.indexOf(char) / 5), key.indexOf(char) % 5];
  }

  private _getPosChar = (pos: Array<number>, key: string) => {
    return key[pos[0] * 5 + pos[1]];
  }
}
