import { CryptoSuite } from '../../interfaces';
import {
  ctob26,
  b26toc,
  groupByFive,
  ungroupByFive,
  removeNonUppercase,
} from '../utils';

const DEFAULT_TABLE = [
  'PJWOCVIYDRQGBFALUNTKXSHZEM',
  'FYWRAHLVOKXIEUGNBPJSTZQMCD',
  'SPWMLXVZHNEAIQGFUOCKJRDTYB',
  'SPGWOJLIAQBYFURTMCXDHKEVNZ',
  'QXYLNJGHERKMBWPVAOCSZDUITF',
  'KSENWHRZGBOCTJXLQVAUFMIDPY',
  'POFUXTDWCBJRELYSNZHAQKGIVM',
  'EJGIUQBRWFLCAHYZTXPOKVDMNS',
  'KRAZOWQMFYDINTXPLGEHVUJCBS',
  'OZQGWDTSXHBJFNEAKRUCPLIVYM',
  'FNDAQWLGYHPTJMCUEBKXIZOSRV',
  'YZDVWUKJQNSFCBEIRTXHOGMLPA',
  'CXSGWBPFZRNMQVLOTEUYJIAHKD',
  'YNMQLVWOPEGHTAXJIRFBKZUSDC',
  'OERYJWGVQLCDKBHNXFPMSIUZTA',
  'KURJCHWNAZVMBQYPSDTFOGIEXL',
  'CHMLBQPVWEKGASNJIROUFYTXZD',
  'PGUYKQOVDFRCEXTBWNISZAJHLM',
  'BKZLAWCIXFVSEQDTGHJPYMNRUO',
  'GSKAIRTBQMFZVWLJOPYHUXENCD',
  'OUSPWBLCFHGJYMRAETXZKDNVQI',
  'SFWKVMCLQPNOXAHEJBRDYZIGTU',
  'RVZYSCAWFXGQMPLDBKIHNTJOUE',
  'VNCEBLZUSPXRHTWQDKOYGAIJMF',
  'KRIWZLTVHSMNJCBDPFQEAYUXOG',
  'MYBWPXCLEVQGDFSOZTJNAIRKHU',
];

export class VigenereFull implements CryptoSuite {
  encrypt(plaintext: string, key: string, opts: any) {
    const text = removeNonUppercase(plaintext);
    const table = opts.table ? this._genTable(opts.table) : DEFAULT_TABLE;
    return this._vigenereFullBase26(text, key, table, true, opts);
  }

  decrypt(ciphertext: string, key: string, opts: any) {
    const text = removeNonUppercase(ciphertext);
    const table = opts.table ? this._genTable(opts.table) : DEFAULT_TABLE;
    return this._vigenereFullBase26(text, key, table, false, opts);
  }

  private _vigenereFullBase26(
    plaintext: string,
    key: string,
    table: string[],
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
      const cr = encrypt
        ? table[ad][ch]
        : this._findOriginalChar(table[ad], ch);
      res.push(cr);
    }

    let resText = res.join('');
    if (grouped && encrypt) {
      resText = groupByFive(resText);
    }

    return resText;
  }

  private _genTable(s: string) {
    const ss = removeNonUppercase(s);
    const table = ss.split(',', 26);

    if (table.length !== 26) throw new Error('Invalid full vignere table');
    for (let i = 0; i < table.length; i++) {
      if (table[i].length !== 26) throw new Error('Invalid full vignere table');
    }

    // TODO: Check for uniqueness
    return table;
  }

  private _findOriginalChar(r: string, ch: number) {
    const chr = b26toc(ch);
    return b26toc(r.indexOf(chr));
  }
}
