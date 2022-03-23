const axios = require("axios");
const fivemController = () => {};

fivemController.getPlayers = async (req, res) => {
    let result = await axios.get("http://193.70.36.221:30120/players.json");
    res.send({ value: result.data.length });
}

fivemController.getServerInfos = async (req, res) => {
    let result = await axios.get("http://193.70.36.221:30120/info.json");
    res.send({ value: result.data.vars.sv_maxClients });
}

module.exports = fivemController;