import { useState, useEffect } from 'react';
import { CryptoSuitesState } from '../../interfaces';

import { Affine } from './affine';
import { Vigenere } from './vigenere';

export const useCryptoSuites = () => {
  const [cryptoSuites, setCryptoSuites] = useState<CryptoSuitesState>({});

  useEffect(() => {
    setCryptoSuites({
      vigenere: new Vigenere(),
      affine: new Affine(),
    });
  }, []);

  return cryptoSuites;
};
