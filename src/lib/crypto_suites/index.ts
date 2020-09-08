import { useState, useEffect } from 'react';
import { CryptoSuitesState } from '../../interfaces';

import { Affine } from './affine';
import { Vigenere } from './vigenere';
import { Hill } from './hill';
import { VigenereExt } from './vigenere_ext';
import { Playfair } from './playfair';
import { Super } from './super';

export const useCryptoSuites = () => {
  const [cryptoSuites, setCryptoSuites] = useState<CryptoSuitesState>({});

  useEffect(() => {
    setCryptoSuites({
      vigenere: new Vigenere(),
      affine: new Affine(),
      hill: new Hill(),
      vigenere_ext: new VigenereExt(),
      playfair: new Playfair(),
      super: new Super(),
    });
  }, []);

  return cryptoSuites;
};
