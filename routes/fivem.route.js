const express = require('express');
const fivemApiRouter = express.Router();

const fivemController = require("../controllers/fivem.controller");

fivemApiRouter.post('/players', fivemController.getPlayers);
fivemApiRouter.post('/server-infos', fivemController.getServerInfos);

module.exports = fivemApiRouter;