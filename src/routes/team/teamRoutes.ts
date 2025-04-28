import express from "express";
import auth, { AuthenticatedRequest } from "../../utils/middleware/auth";
import TeamsController from "../../controllers/TeamsController";
import { TeamService } from "../../services/TeamService";
import { validate as isUUID } from "uuid";
import teamUserRouter from "./teamUserRoutes";
import validate from "../../utils/middleware/validate";
import { body, param } from "express-validator";

const teamRoutes = express.Router();

teamRoutes.get("/teams", async (req: AuthenticatedRequest, res) => {
    const user = req.user;
    const teams = await TeamService.getFullForUser(user);
    res.status(200).json({ teams });
});

teamRoutes.route("/team")
    .post(auth,
        validate([
            body("name").isString().withMessage("Name is required"),
        ]), async (req: AuthenticatedRequest, res) => {
            const user = req.user;
            const { name } = req.body;

            const createdTeam = await TeamsController.createTeam(user, name);

            const teams = await TeamService.getFullForUser(user);
            res.header("Location", `/api/v1/team/${createdTeam.id}`);

            res.status(201).json({ teams });
        });

teamRoutes.route("/team/:teamId")
    .get(validate([
        param("teamId").isString().custom(isUUID).withMessage("Team id is required and must be a valid UUID"),
    ]),
        async (req: AuthenticatedRequest, res) => {
            const user = req.user;
            const { teamId } = req.params;

            if (!isUUID(teamId)) {
                res.status(400).send("Invalid team id");
                return;
            }

            try {
                const team = await TeamsController.getFullTeamForUser(teamId, user);
                res.status(200).json({ team });
            } catch (error) {
                res.status(403).send(error.message)
            }
        })
    .patch(validate([
        body("name").isString().withMessage("Name is required"),
        param("teamId").isString().custom(isUUID).withMessage("Team id is required and must be a valid UUID"),
    ]), (req: AuthenticatedRequest, res) => {
        const { teamId } = req.params;
        const { name } = req.body;
        const user = req.user;

        TeamsController.updateTeam(teamId, user, name).then(team => {
            res.status(200).json({ team });
        }).catch(error => {
            res.status(403).send(error.message);
        })
    })
    .delete(validate([
        param("teamId").isString().custom(isUUID).withMessage("Team id is required and must be a valid UUID"),
    ]), (req: AuthenticatedRequest, res) => {
        const { teamId } = req.params;
        const user = req.user;

        TeamsController.deleteTeam(teamId, user).then(() => {
            res.status(204).send();
        }).catch(error => {
            res.status(403).send(error.message);
        })
    });


teamRoutes.use("/team", teamUserRouter);

export default teamRoutes;