import {Router} from 'express';
import validate from '../../utils/middleware/validate';
import {body} from "express-validator";
import {validate as isUUID} from "uuid";
import team from "../../utils/middleware/teamMiddleware";
import auth from "../../utils/middleware/auth";
import DevKeysController from "../../controllers/DevKeysController";

const configDevRoutes = Router();

// configDevRoutes.get('/:teamId', (req, res) => {})

configDevRoutes.post('/api-key', auth, team,
    validate([body("teamId").custom(isUUID).withMessage("Team id is mandatory and has to be valid teamId")]),
    async (req, res) => {
        const {team} = req;

        const key = await DevKeysController.generateDevKey(team);
        res.json({key});
    });

configDevRoutes.get("/api-keys/:teamId", auth, team, (req, res) => {
        // const {team} = req;
        res.send("Not implemented")
    }
);

configDevRoutes.delete("/api-key/:keyId", auth, async (req, res) => {
    await DevKeysController.deleteDevKey(req.params.keyId, req.user);
    res.status(200).send("DevKey was deleted successfully");
});

export default configDevRoutes;