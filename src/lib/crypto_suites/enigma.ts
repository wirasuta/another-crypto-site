import { CryptoSuite } from '../../interfaces';
import {
  ctob26,
  b26toc,
  groupByFive,
  ungroupByFive,
  pmod,
  removeNonUppercase,
} from '../utils';

export class Enigma implements CryptoSuite {
  encrypt(plaintext: string | ArrayBuffer, key: string, opts: any) {
    if (typeof plaintext === 'string') {
      const text = removeNonUppercase(plaintext);
      return this._enigmaBase26(text, key, true, opts);
    } else {
      // TODO: Handle binary
      return '';
    }
  }

  decrypt(ciphertext: string | ArrayBuffer, key: string, opts: any) {
    if (typeof ciphertext === 'string') {
      const text = removeNonUppercase(ciphertext);
      return this._enigmaBase26(text, key, false, opts);
    } else {
      // TODO: Handle binary
      return '';
    }
  }

  private _enigmaBase26(
    plaintext: string,
    key: string,
    encrypt: boolean,
    opts: any
  ) {
    const grouped = opts.display === 'grouped';
    const res = [];

    if (grouped && !encrypt) {
      plaintext = ungroupByFive(plaintext);
    }

    const rotors = ['BDFHJLCPRTXVZNYEIWGAKMUSQO',
      'AJDKSIRUXBLHWTMCQGZNPYFVOE',
      'EKMFLGDQVZNTOWYHXUSPAIBRCJ']; // Rotor Type III, II, I
    const rotorRingSetting = [0, 0, 0];
    const rotorNotch = ['V', 'E', 'Q']; // Rotor Type III, II, I
    const rotorsCount = rotors.length;
    const reflector = 'YRUHQSLDPXNGOKMIEBFZCWVJAT'; // UKW B
    const plugboard = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // Not plugged
    let keyArr = key.split('');

    for (let i = 0; i < rotorsCount; i++) {
      if (rotorRingSetting[i] > 0) {
        const shiftCount = rotorRingSetting[i];
        let shiftedRotor = rotors[i].split('').map((x) => b26toc((ctob26(x) + shiftCount) % 26)).join('');
        rotors[i] = [shiftedRotor.slice(26 - shiftCount, 26), shiftedRotor.slice(0, 26 - shiftCount)].join('');
      }
    }

    for (let i = 0; i < plaintext.length; i++) {
      keyArr = this._incKey(keyArr, rotorNotch);
      let currInput = plaintext[i];
      let prevKey = 0;
      let currKey = 0;

      // Plugboard
      currInput = plugboard[ctob26(currInput)];

      // Rotor 3 to Rotor 1
      for (let j = rotorsCount - 1; j >= 0; j--) {
        currKey = ctob26(keyArr[j]);
        currInput = b26toc(pmod(ctob26(currInput) + currKey - prevKey, 26));
        currInput = rotors[j][ctob26(currInput)];
        prevKey = currKey;
      }

      // Reflector
      currKey = 0;
      currInput = b26toc(pmod(ctob26(currInput) + currKey - prevKey, 26));
      currInput = reflector[ctob26(currInput)];
      prevKey = currKey;

      // Rotor 1 to Rotor 3
      for (let j = 0; j < rotorsCount; j++) {
        currKey = ctob26(keyArr[j]);
        currInput = b26toc(pmod(ctob26(currInput) + currKey - prevKey, 26));
        // currInput = rotors[j][ctob26(currInput)];
        currInput = b26toc(rotors[j].indexOf(currInput));
        prevKey = currKey;
      }

      // Plugboard
      currKey = 0;
      currInput = b26toc(pmod(ctob26(currInput) + currKey - prevKey, 26));
      currInput = plugboard[ctob26(currInput)];

      res.push(currInput);
    }

    let resText = res.join('');
    if (grouped && encrypt) {
      resText = groupByFive(resText);
    }

    return resText;
  }

  private _incKey(keyArr: Array<string>, rotorNotch: Array<string>) {
    const lenKeyArr = keyArr.length;
    const intKeyArr = keyArr.map((x) => ctob26(x));
    const intRotorNotch = rotorNotch.map((x) => ctob26(x));

    if (intKeyArr[lenKeyArr - 1] === intRotorNotch[lenKeyArr - 1]) {
      intKeyArr[lenKeyArr - 2]++;
    }
    intKeyArr[lenKeyArr - 1]++;

    for (let i = lenKeyArr - 1; i >= 0; i--) {
      if (intKeyArr[i] >= 26) {
        intKeyArr[i] = intKeyArr[i] % 26;
        intKeyArr[pmod(i - 1, lenKeyArr)]++;
      }
    }

    keyArr = intKeyArr.map((x) => b26toc(x));

    return keyArr;
  }
}
