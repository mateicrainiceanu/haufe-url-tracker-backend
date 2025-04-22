import express from 'express';
import { requestHandler } from './createRedirRequestController';
import auth from '../../utils/middleware/auth';

const redirectRoutes = express.Router(); 

redirectRoutes.route("/redirect")
.post(requestHandler, auth);

export default redirectRoutes;