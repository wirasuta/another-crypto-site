/*  Matrix      Column Matrix   Row Matrix
    [[a b c]    [[x]            [[j k l]]
     [d e f]     [y]
     [g h i]]    [z]]
*/

import { modinv, pmod } from './utils';

export const multiplyMatrix = (m: number[][], n: number[][]) => {
  if (m[0].length !== n.length) throw new Error('Invalid matrix size');

  const mn = [];
  const mCols = m[0].length;
  const mnCols = n[0].length;
  const mnRows = m.length;

  for (let i = 0; i < mnRows; i++) {
    const row = [];
    for (let j = 0; j < mnCols; j++) {
      let sum = 0;
      for (let k = 0; k < mCols; k++) {
        sum += m[i][k] * n[k][j];
      }
      row.push(sum);
    }
    mn.push(row);
  }

  return mn;
};

export const modMultiplyMatrix = (
  m: number[][],
  n: number[][],
  mod: number
) => {
  if (m[0].length !== n.length) throw new Error('Invalid matrix size');
  const res = multiplyMatrix(m, n);
  const resCols = res[0].length;
  const resRows = res.length;

  for (let i = 0; i < resRows; i++) {
    for (let j = 0; j < resCols; j++) {
      res[i][j] = pmod(res[i][j], mod);
    }
  }

  return res;
};

export const modinvMatrix3x3 = (m: number[][], mod: number) => {
  if (m.length !== 3 || m[0].length !== 3)
    throw new Error('Invalid matrix size');

  const detinv = modinv(detMatrix3x3(m), mod);
  if (detinv === 0) throw new Error('Matrix not invertible');

  const mt = [
    [
      m[1][1] * m[2][2] - m[2][1] * m[1][2],
      -1 * (m[0][1] * m[2][2] - m[2][1] * m[0][2]),
      m[0][1] * m[1][2] - m[1][1] * m[0][2],
    ],
    [
      -1 * (m[1][0] * m[2][2] - m[2][0] * m[1][2]),
      m[0][0] * m[2][2] - m[2][0] * m[0][2],
      -1 * (m[0][0] * m[1][2] - m[1][0] * m[0][2]),
    ],
    [
      m[1][0] * m[2][1] - m[2][0] * m[1][1],
      -1 * (m[0][0] * m[2][1] - m[2][0] * m[0][1]),
      m[0][0] * m[1][1] - m[0][1] * m[1][0],
    ],
  ];

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      mt[i][j] = pmod(mt[i][j] * detinv, mod);
    }
  }

  return mt;
};

export const detMatrix3x3 = (m: number[][]) => {
  if (m.length !== 3 || m[0].length !== 3)
    throw new Error('Invalid matrix size');

  return (
    m[0][0] * (m[1][1] * m[2][2] - m[2][1] * m[1][2]) +
    m[0][1] * -1 * (m[1][0] * m[2][2] - m[2][0] * m[1][2]) +
    m[0][2] * (m[1][0] * m[2][1] - m[2][0] * m[1][1])
  );
};
