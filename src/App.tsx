import React, { FC, useState, useEffect } from 'react';
import { Container, Row, Navbar, Form, Col, Button } from 'react-bootstrap';

import { Vigenere } from './lib/crypto_suites/vigenere';
import { AppDataState, CryptoSuitesState } from './interfaces';

const App: FC = () => {
  const [cryptoSuites, setCryptoSuites] = useState<CryptoSuitesState>({});
  const [formData, setFormData] = useState<AppDataState>({
    suite: '',
    plaintext: '',
    ciphertext: '',
    key: '',
    opts: {},
  });

  useEffect(() => {
    setCryptoSuites({
      vigenere: new Vigenere(),
    });
  }, []);

  const handleChange = (e: any) => {
    // TODO: Validate
    const value = e.target.value as string;
    const key = e.target.dataset!.key as string;

    setFormData({
      ...formData,
      [key]: value,
    });
  };

  const handleEncrypt = () => {
    const ciphertext = cryptoSuites[formData.suite]?.encrypt(
      formData.plaintext,
      formData.key,
      formData.opts
    );

    setFormData({
      ...formData,
      ciphertext,
    });
  };

  const handleDecrypt = () => {
    const plaintext = cryptoSuites[formData.suite]?.decrypt(
      formData.ciphertext,
      formData.key,
      formData.opts
    );

    setFormData({
      ...formData,
      plaintext,
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
              <option value='vigenere-full'>Full Vigenere</option>
              <option value='vigenere-auto'>Auto-Key Vigenere</option>
              <option value='vigenere-ext'>Extended Vigenere</option>
              <option value='playfair'>Playfair</option>
              <option value='super'>Super (Vigenere + Transposition)</option>
              <option value='affine'>Affine</option>
              <option value='hill'>Hill</option>
              <option value='enigma'>Enigma</option>
            </Form.Control>
          </Row>
          <Row className='mt-3 flex-column'>
            <h5>Cipher options</h5>
            <div>
              <Form.Check
                inline
                name='displayRadios'
                id='display-radio-preserve'
                label='Preserve puncutation'
                type='radio'
              />
              <Form.Check
                inline
                name='displayRadios'
                id='display-radio-group'
                label='Group of five'
                type='radio'
              />
            </div>
          </Row>
          <Row className='mt-3 flex-column'>
            <h5>Key</h5>
            <Form.Group controlId='key' className='mb-0'>
              <Form.Control
                data-key='key'
                value={formData.key}
                onChange={handleChange}
              />
            </Form.Group>
          </Row>
          <Row className='mt-3 flex-column'>
            <h5>Plaintext</h5>
            <Form.Group>
              <Form.File id='plainFile' />
            </Form.Group>
            <Form.Group controlId='plainTextArea' className='mb-0'>
              <Form.Control
                as='textarea'
                data-key='plaintext'
                rows={3}
                value={formData.plaintext}
                onChange={handleChange}
              />
            </Form.Group>
          </Row>
          <hr />
          <Row>
            <Col>
              <Button variant='outline-primary' block onClick={handleEncrypt}>
                Encrypt
              </Button>
            </Col>
            <Col>
              <Button variant='outline-success' block onClick={handleDecrypt}>
                Decrypt
              </Button>
            </Col>
          </Row>
          <hr />
          <Row className='mt-3 flex-column'>
            <h5>Ciphertext</h5>
            <Form.Group controlId='cipherTextArea'>
              <Form.Control
                as='textarea'
                data-key='ciphertext'
                rows={3}
                value={formData.ciphertext}
                onChange={handleChange}
              />
            </Form.Group>
          </Row>
        </Form>
      </Container>
    </>
  );
};

export default App;
