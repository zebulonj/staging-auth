/**
 * For proof-of-concept, this file wraps an existing http-basic module (http-auth),
 * to take advantage of its handling of .htpasswd files. TODO: For production,
 * this should be replaced with more efficient, direct, handling of the .htpasswd
 * file.
 */

import auth from 'http-auth';

export function htpasswd( file ) {
  const middleware = auth.connect( auth.basic({
    realm: "Ignored",
    file
  }));

  return function authenticator( username, password ) {
    const authorization = `Basic ${ Buffer.from( [username, password].join( ':' ) ).toString( 'base64' ) }`;

    return new Promise( resolve => {
      const req = {
        headers: { authorization }
      };

      const res = {
        setHeader() {},
        writeHead() {},

        end() {
          resolve( false );
        }
      };

      const next = () => resolve( true );

      middleware( req, res, next );
    });
  }
}

export default htpasswd;
