export const ctob26 = (char: String, baseChar: String = 'A') => {
  return char.charCodeAt(0) - baseChar.charCodeAt(0);
};

export const b26toc = (charcode: number, baseChar: String = 'A') => {
  return String.fromCharCode(charcode + baseChar.charCodeAt(0));
};
