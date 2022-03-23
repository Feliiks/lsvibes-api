const express = require('express');
const mailRouter = express.Router();

const emailController = require("../controllers/email.controller");

mailRouter.post('/accountemailverify/:userEmail', emailController.accountEmailVerify);
mailRouter.post('/account-confirmation/:emailToken', emailController.accountConfirmation);

module.exports = mailRouter;