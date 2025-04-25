import express from 'express';
import RedirectController from '../../controllers/RedirectController';
import logger from '../../config/logger';
import Redirect from '../../models/Redirect';
import Tracker from '../../models/Tracker';

const rootRouter = express.Router();

rootRouter.route("/:id").get(
    async (req, res) => {
        const { id } = req.params;

        try {
            const redirect = await RedirectController.findByKw(id);
            logger.info(`Redirecting [${redirect.id}]`);
            res.redirect(302, redirect.url);

        } catch (error) {
            logger.error(`Failed to redirect [${id}] - ${error.message}`);
            res.status(500).send(error.message || "An error occurred");
        }

    }
)

export default rootRouter;
