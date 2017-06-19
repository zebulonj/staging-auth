import path from 'path';
import test from 'tape';

import htpasswd from './htpasswd';

test.only( "htpasswd...", sub => {
  sub.test( "...md5: should authenticate with valid credentials", assert => {
    assert.plan( 1 );

    const authenticate = htpasswd( path.resolve( __dirname, '../test/.htpasswd' ) );

    authenticate( 'testA', 'testApassword' )
      .then(
        authenticated => {
          assert.ok( authenticated, 'The user should be authenticated.' );
          assert.end();
        },
        err => assert.fail( err )
      );
  });

  sub.test( "...md5: should reject with invalid credentials", assert => {
    assert.plan( 1 );

    const authenticate = htpasswd( path.resolve( __dirname, '../test/.htpasswd' ) );

    authenticate( 'testA', 'testA-BADpassword' )
      .then(
        authenticated => {
          assert.equals( authenticated, false, 'The user should NOT be authenticated.' );
          assert.end();
        },
        err => assert.fail( err )
      );
  });
});
