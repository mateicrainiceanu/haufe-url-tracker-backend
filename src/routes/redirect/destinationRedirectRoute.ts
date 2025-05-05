import express from 'express';
import RedirectController from '../../controllers/RedirectController';
import logger from '../../config/logger';
import AccessController from '../../controllers/AccessController';

const rootRouter = express.Router();

rootRouter.route("/:id").get(
    async (req, res) => {
        const { id } = req.params;

        const redirect = await RedirectController.findByKw(id);
        logger.info(`Redirecting [${redirect.id}]`);
        res.redirect(302, redirect.url);

        if (redirect.tracker) {
            await AccessController.newLog(redirect.tracker, req);
        }
    }
)

export default rootRouter;
