import express from 'express';
import trackerDevRoutes from "./trackerDevRoutes";
import auth from "../../utils/middleware/auth";
import configDevRoutes from "./configDevRoutes";

const devRoutes = express.Router();

//api
devRoutes.use("/dev/:apiKey/", trackerDevRoutes);

//config
devRoutes.use("/dev/config/", auth, configDevRoutes);

export default devRoutes;