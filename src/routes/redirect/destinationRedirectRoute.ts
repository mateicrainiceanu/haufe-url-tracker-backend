import express from 'express';
import RedirectController from '../../controllers/RedirectController';
import logger from '../../config/logger';
import * as UAParserJS from "ua-parser-js"
import geoip from 'geoip-lite';
import AccessController from '../../controllers/AccessController';

const rootRouter = express.Router();

rootRouter.route("/:id").get(
    async (req, res) => {
        const { id } = req.params;

        try {
            const redirect = await RedirectController.findByKw(id);
            logger.info(`Redirecting [${redirect.id}]`);
            res.redirect(302, redirect.url);

            if (redirect.tracker) {
                await AccessController.newLog(redirect.tracker, req);
            }
        } catch (error) {
            logger.error(`Failed to redirect [${id}] - ${error.message}`);
            res.status(500).send(error.message || "An error occurred");
        }

    }
)

export default rootRouter;
