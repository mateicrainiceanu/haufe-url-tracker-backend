import express from 'express';

import registerRoute from './routes/auth/registerRoute';
import bodyParser from 'body-parser';
import loginRoute from './routes/auth/loginRoute';

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use("/api/v1/", registerRoute, loginRoute);

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
