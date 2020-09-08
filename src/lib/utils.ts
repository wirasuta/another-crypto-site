export const ctob26 = (char: string, baseChar: string = 'A') => {
  return char.charCodeAt(0) - baseChar.charCodeAt(0);
};

export const b26toc = (charcode: number, baseChar: string = 'A') => {
  return String.fromCharCode(charcode + baseChar.charCodeAt(0));
};

export const ctob256 = (char: string) => {
  return char.charCodeAt(0);
};

export const b256toc = (charcode: number) => {
  return String.fromCharCode(charcode);
};

export const removeNonUppercase = (text: string) => {
  return text.replace(/[^A-Z]/g, '').trim();
};

export const groupByFive = (text: string) => {
  return text.replace(/(.{5})/g, '$1 ').trim();
};

export const ungroupByFive = (text: string) => {
  return text.replace(/ /g, '').trim();
};

export const gcd = (a: number, b: number): number => {
  if (b === 0) return a;
  else return gcd(b, a % b);
};

export const egcd = (a: number, b: number): number[] => {
  if (b === 0) {
    return [a, 1, 0];
  }

  const [gcd, x1, y1] = egcd(b, a % b);
  const y = x1 - Math.floor(a / b) * y1;
  const x = y1;

  return [gcd, x, y];
};

export const pmod = (a: number, m: number) => ((a % m) + m) % m;

export const modinv = (a: number, m: number) => {
  if (a < 0) a = pmod(a, m);

  const [gcd, x] = egcd(a, m);

  if (gcd !== 1) return 0;
  else return pmod(x, m);
};

export const isCoprime = (a: number, b: number) => {
  return gcd(a, b) === 1;
};

export const splice = (originalText: string, idx: number, text: string) => {
  return [originalText.slice(0, idx), text, originalText.slice(idx)].join('')
}
