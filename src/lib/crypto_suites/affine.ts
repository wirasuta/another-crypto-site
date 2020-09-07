import { CryptoSuite } from '../../interfaces';
import {
  isCoprime,
  groupByFive,
  ctob26,
  b26toc,
  modinv,
  ungroupByFive,
  pmod,
} from '../utils';

export class Affine implements CryptoSuite {
  encrypt(plaintext: string | ArrayBuffer, key: string, opts: any) {
    if (typeof plaintext !== 'string')
      throw new Error('Invalid plaintext: should be A-Z');

    const [m, b] = this._genCoeff(key);
    return this._affineEnc(plaintext, m, b, opts);
  }

  decrypt(ciphertext: string | ArrayBuffer, key: string, opts: any) {
    if (typeof ciphertext !== 'string')
      throw new Error('Invalid ciphertext: should be A-Z');

    const [m, b] = this._genCoeff(key);
    return this._affineDec(ciphertext, m, b, opts);
  }

  private _affineEnc(plaintext: string, m: number, b: number, opts: any) {
    const preserve = opts.display === 'preserve';
    const grouped = opts.display === 'grouped';
    const res = [];

    for (let i = 0; i < plaintext.length; i++) {
      const ch = ctob26(plaintext[i]);

      if (preserve && (ch < 0 || ch > 25)) {
        res.push(plaintext[i]);
        continue;
      }

      const cr = (m * ch + b) % 26;
      res.push(b26toc(cr));
    }

    let resText = res.join('');
    if (grouped) {
      resText = groupByFive(resText);
    }

    return resText;
  }

  private _affineDec(ciphertext: string, m: number, b: number, opts: any) {
    const preserve = opts.display === 'preserve';
    const grouped = opts.display === 'grouped';
    const minv = modinv(m, 26);
    const res = [];

    if (grouped) {
      ciphertext = ungroupByFive(ciphertext);
    }

    for (let i = 0; i < ciphertext.length; i++) {
      const ch = ctob26(ciphertext[i]);

      if (preserve && (ch < 0 || ch > 25)) {
        res.push(ciphertext[i]);
        continue;
      }

      const cr = pmod(minv * (ch - b), 26);
      res.push(b26toc(cr));
    }

    let resText = res.join('');
    return resText;
  }

  private _genCoeff(s: string) {
    const [ms, bs] = s.split(',', 2);
    const m = parseInt(ms.trim());
    const b = parseInt(bs.trim());

    if (!isCoprime(m, 26))
      throw new Error('Invalid key: m should be coprime with 26');

    return [m, b];
  }
}
