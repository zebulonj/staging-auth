import express from 'express';

const PORT = process.env.PORT || 3000;

const app = express();

app.use( ( req, res, next ) => {
  console.log( `[staging-auth] Request:`, req.method, req.url );
  next();
});

app.use( '/unauthorized', ( req, res ) => {
  res.status( 401 ).send({ message: 'Unauthorized' });
})

app.use( ( req, res ) => {
  res.send({ message: 'Hello World!' });
});

app.listen( PORT, () => {
  console.log( `[staging-auth-app] Listening (port=${ PORT })` );
});
