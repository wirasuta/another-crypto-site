import React, { FC, useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';

interface OptsInputState {
  initialOpts: any;
  suite: string;
  onChange: (opts: any) => void;
}

const OptsInput: FC<OptsInputState> = ({ initialOpts, onChange }) => {
  const [opts, setOpts] = useState(initialOpts);

  useEffect(() => {
    onChange(opts);
    // eslint-disable-next-line
  }, [opts]);

  const handleOptsChange = (e: any) => {
    const key = e.target.dataset!.key as string;
    const value = e.target.value as string;

    setOpts({
      ...opts,
      [key]: value,
    });
  };

  return (
    <>
      <h5>Cipher options</h5>
      <div>
        <Form.Check
          inline
          name='displayRadios'
          id='display-radio-no-space'
          label='No space'
          type='radio'
          data-key='display'
          value='no-space'
          checked={opts.display === 'no-space'}
          onChange={handleOptsChange}
        />
        <Form.Check
          inline
          name='displayRadios'
          id='display-radio-group'
          label='Group of five'
          type='radio'
          data-key='display'
          value='grouped'
          checked={opts.display === 'grouped'}
          onChange={handleOptsChange}
        />
      </div>
    </>
  );
};

export default OptsInput;
