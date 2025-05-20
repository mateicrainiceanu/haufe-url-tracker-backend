import {Router} from 'express';
import validate from '../../utils/middleware/validate';
import {body, param} from "express-validator";
import {validate as isUUID} from "uuid";
import team from "../../utils/middleware/teamMiddleware";
import auth from "../../utils/middleware/auth";
import DevKeysController from "../../controllers/DevKeysController";

const configDevRoutes = Router();

configDevRoutes.post('/api-key',
    validate([body("teamId").custom(isUUID).withMessage("Team id is mandatory and has to be valid teamId")]),
    auth, team,
    async (req, res) => {
        const {team} = req;

        const key = await DevKeysController.generateDevKey(team);
        res.json({key});
    });

configDevRoutes.get("/api-keys/:teamId",
    validate([param("teamId").custom(isUUID).withMessage("Team id is mandatory and has to be valid teamId")]),
    auth, team,
    (req, res) => {
        res.json({team: req.team, devKeys: req.team.devKeys})
    });

configDevRoutes.delete("/api-key/:keyId",
    validate([param("keyId").custom(isUUID).withMessage("Key id is mandatory and has to be valid")]),
    auth, async (req, res) => {
        await DevKeysController.deleteDevKey(req.params.keyId, req.user);
        res.status(200).send("DevKey was deleted successfully");
    });

export default configDevRoutes;