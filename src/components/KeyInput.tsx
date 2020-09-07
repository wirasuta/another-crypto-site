import React, { FC, useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';

interface KeyInputProps {
  suite: string;
  value: string;
  onChange: (e: any) => void;
}

const KeyInput: FC<KeyInputProps> = ({ suite, value, onChange }) => {
  const [info, setInfo] = useState('');

  useEffect(() => {
    switch (suite) {
      case 'vigenere':
        setInfo('Input key in uppercase');
        break;
      case 'affine':
        setInfo('Input key in "<a>, <b>" format. E(x) = ax + b (mod 26)');
        break;
      case 'hill':
        setInfo('Input key in "<abc>, <def>, <ghi>" format');
        break;
      default:
        setInfo('');
        break;
    }
    // eslint-disable-next-line
  }, [suite]);

  return (
    <>
      <h5>Key</h5>
      <Form.Group controlId='key' className='mb-0'>
        <Form.Control data-key='key' value={value} onChange={onChange} />
        {info && <Form.Text className='text-muted'>{info}</Form.Text>}
      </Form.Group>
    </>
  );
};

export default KeyInput;
