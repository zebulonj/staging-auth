import express from 'express';

const PORT = process.env.PORT || 3000;

const app = express();

app.use( ( req, res ) => {
  const { authorization } = req.headers || {};
  console.log( `[staging-auth] Request:`, authorization );

  res.send();
});

app.listen( PORT, () => {
  console.log( `[staging-auth] Listening (port=${ PORT })` );
});
