const express = require('express');
const passwordRouter = express.Router();

const passwordController = require('../controllers/password.controller');

passwordRouter.post('/forgotpassword', passwordController.forgotPassword);
passwordRouter.post('/passemailverify/:userEmail', passwordController.passEmailVerify);
passwordRouter.post('/prjwtverif/:passwordToken', passwordController.pwdToken);
passwordRouter.post('/passwordrequest/:passwordToken', passwordController.passwordRequest);


module.exports = passwordRouter;