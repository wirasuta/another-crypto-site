import { CryptoSuite } from '../../interfaces';
import { ctob26, groupByFive, b26toc, ungroupByFive } from '../utils';
import { strToB26Col, modMultiplyMatrix, modinvMatrix3x3 } from '../matrix';

export class Hill implements CryptoSuite {
  encrypt(plaintext: string | ArrayBuffer, key: string, opts: any) {
    if (typeof plaintext !== 'string')
      throw new Error('Invalid plaintext: should be A-Z');

    const keyMatrix = this._genKeyMatrix(key);
    return this._enc(plaintext, keyMatrix, opts);
  }

  decrypt(ciphertext: string | ArrayBuffer, key: string, opts: any) {
    if (typeof ciphertext !== 'string')
      throw new Error('Invalid plaintext: should be A-Z');

    const keyMatrix = this._genKeyMatrix(key);
    return this._dec(ciphertext, keyMatrix, opts);
  }

  private _enc(plaintext: string, key: number[][], opts: any) {
    const preserve = opts.display === 'preserve';
    const grouped = opts.display === 'grouped';
    const padding = opts.padding ? opts.padding : 'X';
    const res = [];

    let temp: string[] = [];
    let tempStr = '';
    for (let i = 0; i < plaintext.length; i++) {
      const ch = ctob26(plaintext[i]);

      if (preserve && (ch < 0 || ch > 25)) {
        temp.push(plaintext[i]);
      } else {
        temp.push('\x00');
        tempStr += plaintext[i];
      }

      if (tempStr.length === 3) {
        temp = this._processBlock(tempStr, key, temp);
        res.push(...temp);

        tempStr = '';
        temp = [];
      }
    }

    if (temp.length > 0) {
      if (tempStr.length > 0) {
        const lack = 3 - tempStr.length;
        tempStr = tempStr.padEnd(3, padding);
        for (let i = 0; i < lack; i++) {
          temp.push('\x00');
        }

        temp = this._processBlock(tempStr, key, temp);
      }

      res.push(...temp);
    }

    let resText = res.join('');
    if (grouped) {
      resText = groupByFive(resText);
    }

    return resText;
  }

  private _dec(ciphertext: string, key: number[][], opts: any) {
    const preserve = opts.display === 'preserve';
    const grouped = opts.display === 'grouped';
    const padding = opts.padding ? opts.padding : 'X';
    const keyinv = modinvMatrix3x3(key, 26);
    const res = [];

    if (grouped) {
      ciphertext = ungroupByFive(ciphertext);
    }

    let temp: string[] = [];
    let tempStr = '';
    for (let i = 0; i < ciphertext.length; i++) {
      const ch = ctob26(ciphertext[i]);

      if (preserve && (ch < 0 || ch > 25)) {
        temp.push(ciphertext[i]);
      } else {
        temp.push('\x00');
        tempStr += ciphertext[i];
      }

      if (tempStr.length === 3) {
        temp = this._processBlock(tempStr, keyinv, temp);
        res.push(...temp);

        tempStr = '';
        temp = [];
      }
    }

    if (temp.length > 0) {
      if (tempStr.length > 0) {
        const lack = 3 - tempStr.length;
        tempStr = tempStr.padEnd(3, padding);
        for (let i = 0; i < lack; i++) {
          temp.push('\x00');
        }

        temp = this._processBlock(tempStr, keyinv, temp);
      }

      res.push(...temp);
    }

    let resText = res.join('');
    return resText;
  }

  private _processBlock(s: string, key: number[][], t: string[]) {
    const temp = [...t];
    const tempCol = strToB26Col(s);
    const pcCol = modMultiplyMatrix(key, tempCol, 26);
    const pcRow = pcCol.flat();

    for (let j = 0, k = 0; j < temp.length; j++) {
      if (temp[j] === '\x00') {
        temp[j] = b26toc(pcRow[k++]);
      }
    }

    return temp;
  }

  private _genKeyMatrix(s: string) {
    const keyMatrix = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];

    let [r1, r2, r3] = s.split(',', 3);
    [r1, r2, r3] = [r1.trim(), r2.trim(), r3.trim()];
    for (let i = 0; i < 3; i++) {
      keyMatrix[0][i] = ctob26(r1[i]);
      keyMatrix[1][i] = ctob26(r2[i]);
      keyMatrix[2][i] = ctob26(r3[i]);
    }

    return keyMatrix;
  }
}
