export const readFile = async (file: File, binary?: boolean) => {
  // TODO: Handle binary
  const text = await file.text();
  return text;
};

export const downloadAsFile = (
  content: string,
  filename: string,
  binary?: boolean
) => {
  // TODO: Handle binary
  const el = document.createElement('a');
  const file = new Blob([content], { type: 'text/plain' });
  el.href = URL.createObjectURL(file);
  el.download = filename;

  document.body.appendChild(el);
  el.click();
  document.body.removeChild(el);
};
