import { CryptoSuite } from './crypto-suites';

interface OptsType {
  [key: string]: any;
}

export interface CryptoSuitesState {
  [key: string]: CryptoSuite;
}

export interface AppDataState {
  suite: string;
  plaintext: string;
  ciphertext: string;
  key: string;
  opts: OptsType;
}
