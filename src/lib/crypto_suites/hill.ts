import { CryptoSuite } from '../../interfaces';
import {
  ctob26,
  groupByFive,
  b26toc,
  ungroupByFive,
  removeNonUppercase,
} from '../utils';
import { strToB26Col, modMultiplyMatrix, modinvMatrix3x3 } from '../matrix';

export class Hill implements CryptoSuite {
  encrypt(plaintext: string | ArrayBuffer, key: string, opts: any) {
    if (typeof plaintext !== 'string')
      throw new Error('Invalid plaintext: should be A-Z');

    const keyMatrix = this._genKeyMatrix(key);
    const text = removeNonUppercase(plaintext);
    return this._enc(text, keyMatrix, opts);
  }

  decrypt(ciphertext: string | ArrayBuffer, key: string, opts: any) {
    if (typeof ciphertext !== 'string')
      throw new Error('Invalid plaintext: should be A-Z');

    const keyMatrix = this._genKeyMatrix(key);
    const text = removeNonUppercase(ciphertext);
    return this._dec(text, keyMatrix, opts);
  }

  private _enc(plaintext: string, key: number[][], opts: any) {
    const grouped = opts.display === 'grouped';
    const padding = opts.padding ? opts.padding : 'X';
    const res = [];

    let groupOfThree = '';
    for (let i = 0; i < plaintext.length; i++) {
      groupOfThree += plaintext[i];

      if (groupOfThree.length === 3) {
        res.push(...this._processBlock(groupOfThree, key));
        groupOfThree = '';
      }
    }

    if (groupOfThree.length > 0) {
      groupOfThree = groupOfThree.padEnd(3, padding);
      res.push(...this._processBlock(groupOfThree, key));
    }

    let resText = res.join('');
    if (grouped) {
      resText = groupByFive(resText);
    }

    return resText;
  }

  private _dec(ciphertext: string, key: number[][], opts: any) {
    const grouped = opts.display === 'grouped';
    const padding = opts.padding ? opts.padding : 'X';
    const keyinv = modinvMatrix3x3(key, 26);
    const res = [];

    if (grouped) {
      ciphertext = ungroupByFive(ciphertext);
    }

    let groupOfThree = '';
    for (let i = 0; i < ciphertext.length; i++) {
      groupOfThree += ciphertext[i];

      if (groupOfThree.length === 3) {
        res.push(...this._processBlock(groupOfThree, keyinv));
        groupOfThree = '';
      }
    }

    if (groupOfThree.length > 0) {
      groupOfThree = groupOfThree.padEnd(3, padding);
      res.push(...this._processBlock(groupOfThree, keyinv));
    }

    let resText = res.join('');
    return resText;
  }

  private _processBlock(s: string, key: number[][]) {
    const temp = [];
    const tempCol = strToB26Col(s);
    const pcCol = modMultiplyMatrix(key, tempCol, 26);
    const pcRow = pcCol.flat();

    for (let j = 0, k = 0; j < pcRow.length; j++) {
      temp.push(b26toc(pcRow[k++]));
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
