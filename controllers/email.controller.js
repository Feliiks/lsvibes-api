const { emailConfirmation } = require("../models/mailing.model");
const { getNewToken, setUserAccountValidated } = require("../lib/helpers");
const jwt = require("jsonwebtoken");
const prisma = require("../database");


const emailController = () => {};

emailController.accountEmailVerify = async (req, res) => {
    try {
        const user = await prisma.users.findMany({
            where: {
                email: req.params.userEmail
            }
        });

        const newToken = getNewToken(user[0].username, req.params.userEmail, '1h');

        await prisma.users.update({
            where: {
                id: user[0].id
            },
            data: {
                emailToken: newToken,
            }
        });

        await emailConfirmation(user[0].username, req.params.userEmail, newToken);

        res.sendStatus(200);

    } catch (error) {
        res.sendStatus(400);
        console.error(error);
    }
}

emailController.accountConfirmation = async (req, res) => {
    let { emailToken } = req.params;

    try {
        const check = jwt.verify(emailToken, process.env.TOKEN_KEY);

        const user = await prisma.users.findMany({
            where: {
                email: check.email
            }
        });

        console.log(user)

        await setUserAccountValidated(emailToken, check);

        await prisma.users.update({
            where: {
                id: user[0].id
            },
            data: {
                emailToken: null,
            }
        });

        res.sendStatus(200);

    } catch (error) {
        res.sendStatus(400);
        console.error(error)
    }
}

module.exports = emailController;