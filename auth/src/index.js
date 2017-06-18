import express from 'express';

const PORT = process.env.PORT || 3000;
const COOKIE_NAME = 'auth';

const app = express();

app.use( ( req, res, next ) => {
  console.log( `[staging-auth] Request:`, req.method, req.url );
  next();
});

app.use( ( req, res ) => {
  function reject( message ) {
    res.status( 401 );
    res.set( 'WWW-Authenticate', 'Basic realm="Staging"');
    res.send( message );
  }

  const { authorization } = req.headers || {};
  console.log( `[staging-auth] Authorization:`, authorization );

  if ( !authorization ) {
    return reject();
  }

  const matches = authorization.match( /^Basic (.+)$/i );

  if ( !matches ) {
    return reject( 'Malformed authorization data.' );
  }

  const pair = Buffer.from( matches[1], 'base64' ).toString();
  const [username, password] = pair.split( ':' );

  console.log( `[staging-auth] Credentials: ${ username } ${ password }` );

  if ( username !== password ) {
    return reject();
  }
  else {
    res.cookie( COOKIE_NAME, Buffer.from( JSON.stringify({ username }) ).toString( 'base64' ) );
    res.send();
  }
});

app.listen( PORT, () => {
  console.log( `[staging-auth] Listening (port=${ PORT })` );
});
