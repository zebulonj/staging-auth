import test from 'tape';

import { sign, verify } from './sign';

const SECRET = 'SECRET';

test( "sign/sign()...", sub => {
  sub.test( "...should add a 'signature' property to the supplied object.", assert => {
    assert.plan( 2 );

    const input = {
      username: 'iambeta'
    };

    const output = sign( input, SECRET );
    const { signature, ...props } = output;

    assert.deepEquals( { ...props }, input, 'The input properties should be preseved.' );
    assert.ok( signature, 'The signature property should be set.' );
    assert.end();
  });

  sub.test( "...should generate the same signature, regardless of property order.", assert => {
    assert.plan( 1 );

    const A = {
      X: 'Montana',
      Y: 'Colorado',
      Z: 'California'
    };

    const B = {
      Z: 'California',
      X: 'Montana',
      Y: 'Colorado'
    };

    assert.deepEquals( sign( A, SECRET ), sign( B, SECRET ), 'The signatures should be the same.' );
    assert.end();
  });

  sub.test( "...should generate different signatures, for different inputs.", assert => {
    assert.plan( 1 );

    const A = {
      X: 'Montana',
      Y: 'Colorado',
      Z: 'California'
    };

    const B = {
      Z: 'Florida',
      X: 'Montana',
      Y: 'Colorado'
    };

    assert.ok( sign( A, SECRET ).signature !== sign( B, SECRET ).signature, 'The signatures should be different.' );
    assert.end();
  });
});

test( "sign/verify()...", sub => {
  sub.test( "...should be successful for a signed input.", assert => {
    assert.plan( 1 );

    const input = {
      username: 'iambeta'
    };

    const output = sign( input, SECRET );

    assert.deepEqual( verify( output, SECRET ), input, 'A signed object should be verified.' );
    assert.end();
  });

  sub.test( "...should fail for a modified input.", assert => {
    assert.plan( 1 );

    const input = {
      username: 'iambeta'
    };

    const output = sign( input, SECRET );

    assert.equals( verify({ ...output, expires: 'never' }, SECRET ), false, 'A modified object should return false on verification.' );
    assert.end();
  });

  sub.test( "...should fail for unsigned input.", assert => {
    assert.plan( 1 );

    const input = {
      username: 'iambeta'
    };

    assert.equals( verify( input, SECRET ), false, 'An unsigned object should return false on verification.' );
    assert.end();
  });
});
