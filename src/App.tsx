import React, { FC, useState } from 'react';
import { Container, Row, Navbar, Form, Col, Button } from 'react-bootstrap';

import { AppDataState } from './interfaces';
import { useCryptoSuites } from './lib/crypto_suites';
import { readFile, downloadAsFile } from './lib/files';
import KeyInput from './components/KeyInput';
import OptsInput from './components/OptsInput';

const App: FC = () => {
  const cryptoSuites = useCryptoSuites();
  const [formData, setFormData] = useState<AppDataState>({
    suite: '',
    plaintext: '',
    ciphertext: '',
    key: '',
    filename: '',
    cipherfilename: '',
    isPlainBinary: false,
    isCipherBinary: false,
    opts: {
      display: 'no-space',
    },
    rotor1: 0,
    rotor2: 1,
    rotor3: 2,
    rotor4: -1,
    ring1: 0,
    ring2: 0,
    ring3: 0,
    ring4: 0,
    reflector: 'ukwa',
    plugboard: '',
  });

  const handleChange = (e: any) => {
    let value = e.target.value as string;
    const key = e.target.dataset!.key as string;
    const isKey = key === 'key';
    const isEncrypt = key === 'ciphertext';
    const isDecrypt = key === 'plaintext';

    if (isKey || isEncrypt || isDecrypt) {
      value = value.toUpperCase();
    }

    const isbinarykey = isEncrypt
      ? 'isCipherBinary'
      : isDecrypt
        ? 'isPlainBinary'
        : '';
    const filenamekey = isEncrypt
      ? 'cipherfilename'
      : isDecrypt
        ? 'filename'
        : '';

    setFormData({
      ...formData,
      [key]: value,
      [isbinarykey]: false,
      [filenamekey]: '',
    });
  };

  const handleFileChange = async (e: any) => {
    const key = e.target.dataset!.key as string;
    const isEncrypt = key === 'ciphertext';
    const filenamekey = isEncrypt ? 'cipherfilename' : 'filename';
    const isbinarykey = isEncrypt ? 'isCipherBinary' : 'isPlainBinary';
    const isBinary = formData.suite === 'vigenere_ext';
    const file = e.target.files[0] as File;
    const text = await readFile(file, isEncrypt, isBinary);

    setFormData({
      ...formData,
      [filenamekey]: file.name,
      [key]: text,
      [isbinarykey]: isBinary,
    });
  };

  const handleOptsChange = (opts: any) => {
    setFormData({
      ...formData,
      opts,
    });
  };

  const handleDownload = (e: any) => {
    const key = e.target.dataset!.key as string;
    const isEncrypt = key === 'ciphertext';
    const isBinary = formData.suite === 'vigenere_ext';
    let encFilename = formData.filename.length ? formData.filename : 'out';
    encFilename = encFilename + (isBinary && !isEncrypt ? '' : '.enc');

    downloadAsFile(
      isEncrypt ? formData.ciphertext : formData.plaintext,
      encFilename,
      isEncrypt,
      isBinary
    );
  };

  const handleEncrypt = () => {
    const ciphertext = cryptoSuites[formData.suite]?.encrypt(
      formData.plaintext,
      formData.key,
      {
        ...formData.opts,
        rotorChoice: [formData.rotor1, formData.rotor2, formData.rotor3, formData.rotor4],
        ringSetting: [formData.ring1, formData.ring2, formData.ring3, formData.ring4],
        refChoice: formData.reflector,
        pbInput: formData.plugboard,
      }
    );

    setFormData({
      ...formData,
      ciphertext,
      isCipherBinary: false,
    });
  };

  const handleDecrypt = () => {
    const plaintext = cryptoSuites[formData.suite]?.decrypt(
      formData.ciphertext,
      formData.key,
      {
        ...formData.opts,
        rotorChoice: [formData.rotor1, formData.rotor2, formData.rotor3, formData.rotor4],
        ringSetting: [formData.ring1, formData.ring2, formData.ring3, formData.ring4],
        refChoice: formData.reflector,
        pbInput: formData.plugboard,
      }
    );

    setFormData({
      ...formData,
      plaintext,
      isPlainBinary: false,
    });
  };

  return (
    <>
      <Navbar bg='dark' variant='dark'>
        <Navbar.Brand>Another Crypto Site</Navbar.Brand>
      </Navbar>
      <Container className='my-4 mx-2 mx-md-auto w-auto'>
        <Form>
          <Row>
            <Form.Control
              as='select'
              data-key='suite'
              value={formData.suite}
              onChange={handleChange}
            >
              <option>Chose cipher suite...</option>
              <option value='vigenere'>Vigenere</option>
              <option value='vigenere_full'>Full Vigenere</option>
              <option value='vigenere_auto'>Auto-Key Vigenere</option>
              <option value='vigenere_ext'>Extended Vigenere</option>
              <option value='playfair'>Playfair</option>
              <option value='super'>Super (Vigenere + Transposition)</option>
              <option value='affine'>Affine</option>
              <option value='hill'>Hill</option>
              <option value='enigma'>Enigma</option>
            </Form.Control>
          </Row>
          <Row className='mt-3 flex-column'>
            <OptsInput
              initialOpts={formData.opts}
              suite={formData.suite}
              onChange={handleOptsChange}
            />
          </Row>
          <Row className='mt-3 flex-column'>
            <KeyInput
              suite={formData.suite}
              value={formData.key}
              onChange={handleChange}
            />
          </Row>
          {formData.suite === 'enigma' && <Row className='mt-3'>
            <Col className='pr-2 pl-0'>
              <h6>Rotor 1</h6>
              <Form.Control
                as='select'
                data-key='rotor1'
                value={formData.rotor1}
                onChange={handleChange}
              >
                <option value='0'>I</option>
                <option value='1'>II</option>
                <option value='2'>III</option>
                <option value='3'>IV</option>
                <option value='4'>V</option>
                <option value='5'>VI</option>
                <option value='6'>VII</option>
                <option value='7'>VIII</option>
              </Form.Control>
              <Form.Control className='mt-3' data-key='ring1' value={formData.ring1} onChange={handleChange} />
            </Col>
            <Col className='pr-2 pl-2'>
              <h6>Rotor 2</h6>
              <Form.Control
                as='select'
                data-key='rotor2'
                value={formData.rotor2}
                onChange={handleChange}
              >
                <option value='0'>I</option>
                <option value='1'>II</option>
                <option value='2'>III</option>
                <option value='3'>IV</option>
                <option value='4'>V</option>
                <option value='5'>VI</option>
                <option value='6'>VII</option>
                <option value='7'>VIII</option>
              </Form.Control>
              <Form.Control className='mt-3' data-key='ring2' value={formData.ring2} onChange={handleChange} />
            </Col>
            <Col className='pr-2 pl-2'>
              <h6>Rotor 3</h6>
              <Form.Control
                as='select'
                data-key='rotor3'
                value={formData.rotor3}
                onChange={handleChange}
              >
                <option value='0'>I</option>
                <option value='1'>II</option>
                <option value='2'>III</option>
                <option value='3'>IV</option>
                <option value='4'>V</option>
                <option value='5'>VI</option>
                <option value='6'>VII</option>
                <option value='7'>VIII</option>
              </Form.Control>
              <Form.Control className='mt-3' data-key='ring3' value={formData.ring3} onChange={handleChange} />
            </Col>
            <Col className='pr-0 pl-2'>
              <h6>Rotor 4</h6>
              <Form.Control
                as='select'
                data-key='rotor4'
                value={formData.rotor4}
                onChange={handleChange}
              >
                <option value='-1'>None</option>
                <option value='0'>I</option>
                <option value='1'>II</option>
                <option value='2'>III</option>
                <option value='3'>IV</option>
                <option value='4'>V</option>
                <option value='5'>VI</option>
                <option value='6'>VII</option>
                <option value='7'>VIII</option>
              </Form.Control>
              <Form.Control className='mt-3' data-key='ring4' value={formData.ring4} onChange={handleChange} />
            </Col>
          </Row>}
          {formData.suite === 'enigma' && <Row className='mt-3'>
            <Col className='pr-2 pl-0'>
              <h6>Reflector</h6>
              <Form.Control
                as='select'
                data-key='reflector'
                value={formData.reflector}
                onChange={handleChange}
              >
                <option value='ukwa'>UKW A</option>
                <option value='ukwb'>UKW B</option>
                <option value='ukwc'>UKW C</option>
              </Form.Control>
            </Col>
            <Col className='pr-2 pl-2'>
              <h6>Plugboard</h6>
              <Form.Control
                data-key='plugboard'
                value={formData.plugboard}
                onChange={handleChange}
                placeholder='Pairs of letter to be swapped (e.g. AB CD EF)'
              />
            </Col>
          </Row>}
          <Row className='mt-3 flex-column'>
            <h5>Plaintext</h5>
            <Form.Group>
              <Form.File
                id='plainFile'
                data-key='plaintext'
                label={
                  formData.filename.length
                    ? formData.filename
                    : 'Choose plaintext file'
                }
                onChange={handleFileChange}
                custom
                disabled={!formData.suite}
              />
            </Form.Group>
            <Form.Group controlId='plainTextArea'>
              <Form.Control
                as='textarea'
                data-key='plaintext'
                rows={3}
                value={!formData.isPlainBinary ? formData.plaintext : ''}
                placeholder={
                  'Type your plaintext here (binary file is not displayed)'
                }
                onChange={handleChange}
              />
            </Form.Group>
            <Button
              data-key='plaintext'
              variant='outline-success'
              block
              onClick={handleDownload}
            >
              Download
            </Button>
          </Row>
          <hr />
          <Row>
            <Col className='pl-0'>
              <Button
                variant='outline-primary'
                block
                disabled={
                  !formData.key || !formData.plaintext || !formData.suite
                }
                onClick={handleEncrypt}
              >
                Encrypt
              </Button>
            </Col>
            <Col className='pr-0'>
              <Button
                variant='outline-success'
                block
                disabled={
                  !formData.key || !formData.ciphertext || !formData.suite
                }
                onClick={handleDecrypt}
              >
                Decrypt
              </Button>
            </Col>
          </Row>
          <hr />
          <Row className='mt-3 flex-column'>
            <h5>Ciphertext</h5>
            <Form.Group>
              <Form.File
                id='cipherFile'
                data-key='ciphertext'
                label={
                  formData.cipherfilename.length
                    ? formData.cipherfilename
                    : 'Choose ciphertext file'
                }
                onChange={handleFileChange}
                custom
                disabled={!formData.suite}
              />
            </Form.Group>
            <Form.Group controlId='cipherTextArea'>
              <Form.Control
                as='textarea'
                data-key='ciphertext'
                rows={3}
                value={!formData.isCipherBinary ? formData.ciphertext : ''}
                placeholder={
                  'Type your plaintext here (binary file is not displayed)'
                }
                onChange={handleChange}
              />
            </Form.Group>
            <Button
              data-key='ciphertext'
              variant='outline-success'
              block
              onClick={handleDownload}
            >
              Download
            </Button>
          </Row>
        </Form>
      </Container>
    </>
  );
};

export default App;
