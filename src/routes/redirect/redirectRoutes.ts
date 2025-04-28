import express from 'express';
import { createAuthRequest, requestHandler } from './createRedirRequestController';
import auth from '../../utils/middleware/auth';
import validate from '../../utils/middleware/validate';
import { body } from 'express-validator';

const redirectRoutes = express.Router(); 

redirectRoutes.route("/redirect")
.post(validate([
    body("url").isURL().withMessage("URL is required and must be a valid URL"),
]), requestHandler, auth, createAuthRequest);

export default redirectRoutes;