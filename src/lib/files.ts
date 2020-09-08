import {
  ctob256,
  b256toc,
} from '../lib/utils';

export const readFile = async (file: File, encrypt: boolean, binary?: boolean) => {
  let content;

  if (binary && !encrypt) {
    const arrayBuffer = await file.arrayBuffer();
    const uintArrayBuffer = new Uint8Array(arrayBuffer);
    const charArr = [];
    for (let i = 0; i < uintArrayBuffer.length; i++) {
      charArr.push(b256toc(uintArrayBuffer[i]));
    }
    content = charArr.join('');
  } else {
    content = await file.text();
  }

  return content;
};

export const downloadAsFile = (
  content: string,
  filename: string,
  encrypt: boolean,
  binary?: boolean
) => {
  let file;

  if (binary && !encrypt) {
    const uintArray = [];
    for (let i = 0; i < content.length; i++) {
      uintArray.push(ctob256(content[i]));
    }
    const uintArrayBuffer = new Uint8Array(uintArray);
    const arrayBuffer = uintArrayBuffer.buffer;
    file = new Blob([arrayBuffer], { type: 'application/octet-stream' });
  } else {
    file = new Blob([content], { type: 'text/plain' });
  }

  const el = document.createElement('a');
  el.href = URL.createObjectURL(file);
  el.download = filename;

  document.body.appendChild(el);
  el.click();
  document.body.removeChild(el);
};
