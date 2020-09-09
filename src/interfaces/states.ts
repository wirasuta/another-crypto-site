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
  filename: string;
  cipherfilename: string;
  isPlainBinary: boolean;
  isCipherBinary: boolean;
  rotor1: number;
  rotor2: number;
  rotor3: number;
  rotor4: number;
  ring1: number;
  ring2: number;
  ring3: number;
  ring4: number;
  reflector: string;
  plugboard: string;
  opts: OptsType;
}
