import express from 'express';
import { createAuthRequest, requestHandler } from './createRedirRequestController';
import auth from '../../utils/middleware/auth';

const redirectRoutes = express.Router(); 

redirectRoutes.route("/redirect")
.post(requestHandler, auth, createAuthRequest);

export default redirectRoutes;