import express from 'express';

import registerRoute from './routes/auth/registerRoute';
import bodyParser from 'body-parser';
import loginRoute from './routes/auth/loginRoute';
import User from './models/User';
import db, { testSequelize } from './config/db';
import cors from 'cors';
import auth from './utils/middleware/auth';
import logger from './config/logger';
import { initAssociations } from './models/associations';
import teamRoutes from './routes/team/teamRoutes';
import userRouter from './routes/users/userRoutes';
import redirectRoutes from './routes/redirect/redirectRoutes';

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

app.get('/api/v1/', auth, async (req, res) => {
  const users = await User.findAll();
  res.json(users)
});

app.use("/api/v1/", registerRoute, loginRoute);
app.use("/api/v1/", userRouter)
app.use("/api/v1/", redirectRoutes);
app.use("/api/v1/", auth, teamRoutes);


app.listen(port, async () => {

  // logger.fatal("Fatal message");
  // logger.error("Error message");
  // logger.warn("Warn message");
  // logger.info("Info message");
  // logger.debug("Debug message");
  // logger.trace("Trace message");

  await testSequelize();

  initAssociations();

  await db.sync({ alter: true, logging: false });
  logger.info("Tables were updated");

  logger.info(`Express is listening at http://localhost:${port}`);
});
