import crypto from 'crypto';

function digest( string, secret ) {
  const hmac = crypto.createHmac( 'sha256', secret );

  return hmac.update( string ).digest();
}

export function sign({ ...props }, secret ) {
  const signature = Object.keys( props ).sort().reduce( ( acc, key ) => digest( props[key], acc ), secret ).toString( 'base64' );

  return {
    ...props,
    signature
  };
}

export function verify({ signature, ...props }, secret ) {
  console.log( signature, props );

  if ( signature === sign( props, secret ).signature ) {
    return props;
  }

  return false;
}
