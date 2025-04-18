import express from 'express';

import registerRoute from './routes/auth/registerRoute';
import bodyParser from 'body-parser';
import loginRoute from './routes/auth/loginRoute';
import User from './models/User';
import db from './config/db';
import cors from 'cors'; 
import auth from './utils/middleware/auth';

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

app.get('/api/v1/', auth, async (req, res) => {
  const users = await User.findAll();
  res.json(users)
});

app.use("/api/v1/", registerRoute, loginRoute);

app.listen(port, async () => {

  db.sync({ alter: true, logging: false });
  console.log("Tables were updated");

  return console.log(`Express is listening at http://localhost:${port}`);
});
