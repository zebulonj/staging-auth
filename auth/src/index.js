import express from 'express';
import cookies from 'cookie-parser';

import moment from 'moment';
import { sign, verify } from './sign';

const SECRET = process.env.SECRET || 'SECRET';
const PORT = process.env.PORT || 3000;
const COOKIE_NAME = 'auth';

const app = express();

app.use( ( req, res, next ) => {
  console.log( `[staging-auth] Request:`, req.method, req.url );
  next();
});

app.use( cookies(), ( req, res ) => {
  function reject( message ) {
    res.status( 401 );
    res.set( 'WWW-Authenticate', 'Basic realm="Staging"');
    res.clearCookie( COOKIE_NAME );
    res.send( message );
  }

  const { authorization: header } = req.headers || {};
  const { [COOKIE_NAME]: cookie } = req.cookies || {};

  console.log( `[staging-auth] Authorization:`, header );
  console.log( `[staging-auth] Cookie:`, cookie );

  // HTTP-Basic Authentication overrides cookie-based authentication, to allow user more control over session.
  if ( header ) {
    try {
      const { username } = verifyHeader( header );
      const credentials = sign({
        username,
        expires: moment.utc().add( 48, 'hours' ).format()
      }, SECRET );

      console.log( "Setting credentials:", credentials );

      res.cookie( COOKIE_NAME, Buffer.from( JSON.stringify( credentials ) ).toString( 'base64' ) );
      res.send();
    }
    catch( err ) {
      return reject();
    }
  }
  else if ( cookie ) {
    console.log( "Authenticating based on cookie." );

    if ( verifyCookie( cookie ) ) {
      res.send();
    }
    else {
      console.log( "Cookie verification failed." );
      return reject();
    }
  }
  else {
    return reject();
  }
});

app.listen( PORT, () => {
  console.log( `[staging-auth] Listening (port=${ PORT })` );
});

function verifyHeader( header ) {
  const matches = header.match( /^Basic (.+)$/i );

  if ( !matches ) {
    throw new Error( 'Malformed authorization data (header).' );
  }

  const pair = Buffer.from( matches[1], 'base64' ).toString();
  const [username, password] = pair.split( ':' );

  console.log( `[staging-auth] Credentials: ${ username } ${ password }` );

  if ( username !== password ) {
    throw new Error( 'Bad username:password combination.' );
  }

  return {
    username
  };
}

function verifyCookie( cookie ) {
  try {
    const credentials = JSON.parse( Buffer.from( cookie, 'base64' ).toString() );

    console.log( "Verifying credentials:", credentials );

    return verify( credentials, SECRET );
  }
  catch ( err ) {
    return false;
  }
}
