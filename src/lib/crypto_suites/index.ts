import { useState, useEffect } from 'react';
import { CryptoSuitesState } from '../../interfaces';

import { Affine } from './affine';
import { Vigenere } from './vigenere';
import { Hill } from './hill';

export const useCryptoSuites = () => {
  const [cryptoSuites, setCryptoSuites] = useState<CryptoSuitesState>({});

  useEffect(() => {
    setCryptoSuites({
      vigenere: new Vigenere(),
      affine: new Affine(),
      hill: new Hill(),
    });
  }, []);

  return cryptoSuites;
};
