const express = require('express');

const fivemApiRouter = require('./routes/fivem.route');
const authRouter = require('./routes/auth.route');
const mailRouter = require('./routes/email.route');
const passwordRouter = require('./routes/password.route');


const mainRouter = express.Router();

mainRouter.use('/fivemapi', fivemApiRouter);
mainRouter.use('/auth', authRouter);
mainRouter.use('/email', mailRouter);
mainRouter.use('/password', passwordRouter);

module.exports = mainRouter;