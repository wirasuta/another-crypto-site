export const ctob26 = (char: string, baseChar: string = 'A') => {
  return char.charCodeAt(0) - baseChar.charCodeAt(0);
};

export const b26toc = (charcode: number, baseChar: string = 'A') => {
  return String.fromCharCode(charcode + baseChar.charCodeAt(0));
};

export const groupByFive = (text: string) => {
  return text.replace(/(.{5})/g, '$1 ').trim();
};

export const ungroupByFive = (text: string) => {
  return text.replace(/ /g, '').trim();
};
