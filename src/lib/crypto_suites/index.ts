import { useState, useEffect } from 'react';
import { CryptoSuitesState } from '../../interfaces';

import { Affine } from './affine';
import { Vigenere } from './vigenere';
import { Hill } from './hill';
import { VigenereExt } from './vigenere_ext';
import { Playfair } from './playfair';
import { Super } from './super';
import { VigenereAuto } from './vigenere_auto';
import { VigenereFull } from './vigenere_full';
import { Enigma } from './enigma';

export const useCryptoSuites = () => {
  const [cryptoSuites, setCryptoSuites] = useState<CryptoSuitesState>({});

  useEffect(() => {
    setCryptoSuites({
      vigenere: new Vigenere(),
      vigenere_auto: new VigenereAuto(),
      vigenere_full: new VigenereFull(),
      affine: new Affine(),
      hill: new Hill(),
      vigenere_ext: new VigenereExt(),
      playfair: new Playfair(),
      super: new Super(),
      enigma: new Enigma(),
    });
  }, []);

  return cryptoSuites;
};
