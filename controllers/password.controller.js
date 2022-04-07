const { sendPasswordEmailConfirmationToClient } = require("../models/mailing.model");
const { getNewToken, passConverter } = require("../lib/helpers");
const jwt = require("jsonwebtoken");
const prisma = require('../database');


const passwordController = () => {};


passwordController.forgotPassword = async (req, res) => {
    let { email } = req.body;

    try {
        const user = await prisma.users.findMany({
            where: {
                email: email,
                isEmailVerified: true
            }
        });

        if (!user[0]) throw new Error;

        const passwordToken = getNewToken(user[0].username, email, '5m');

        await prisma.users.update({
            where: {
                id: user[0].id
            },
            data: {
                passwordToken: passwordToken
            }
        });

        await sendPasswordEmailConfirmationToClient(user[0].username, email, passwordToken);

    } catch (error) {
        console.error(error);
    }
}

passwordController.passEmailVerify = async (req, res) => {
    let { userEmail } = req.params;

    try {
        const user = await prisma.users.findMany({
            where: {
                email: userEmail,
                isEmailVerified: true
            }
        });

        if (!user[0]) throw new Error;

        const newPasswordToken = getNewToken(user[0].username, userEmail, '5m');

        await prisma.users.update({
            where: {
                id: user[0].id
            },
            data: {
                passwordToken: newPasswordToken
            }
        });

        await sendPasswordEmailConfirmationToClient(user[0].username, userEmail, newPasswordToken);

        res.send({ sent: true })

    } catch (error) {
        res.send({ sent: false })
        console.error(error)
    }
}

passwordController.pwdToken = async (req, res) => {
    let { passwordToken } = req.params;

    try {
        let check = await jwt.verify(passwordToken, process.env.TOKEN_KEY)

        const user = await prisma.users.findMany({
            where: {
                email: check.email,
                passwordToken: passwordToken
            }
        });

        if (!user[0]) throw new Error;

    } catch (error) {
        res.send({ isTokenValid: false });
        console.error(error);
    }
}

passwordController.passwordRequest = async (req, res) => {
    let { passwordToken } = req.params;
    let { password } = req.body;

    try {
        const user = await prisma.users.findMany({
            where: {
                passwordToken: passwordToken
            }
        });

        if (!user[0]) throw new Error;

        let convertedPassword = await passConverter(user[0].username, password);

        await prisma.users.update({
            where: {
                id: user[0].id
            },
            data: {
                pwd: convertedPassword,
                passwordToken: null
            }
        });

        res.send({ updated: true });

    } catch (error) {
        res.send({ updated: false });
        console.error(error);
    }
}

passwordController.changePassword = async (req, res) => {
    let { uid, currentPassword, password } = req.body;

    try {
        const user = await prisma.users.findMany({
            where: {
                uid: uid
            }
        });

        if (!user[0]) throw new Error;

        let hash = await passConverter(user[0].username, currentPassword);

        if (hash !== user[0].pwd) throw new Error;

        let convertedPassword = await passConverter(user[0].username, password, uid);

        await prisma.users.update({
            where: {
                id: user[0].id
            },
            data: {
                pwd: convertedPassword
            }
        });

        res.sendStatus(200)

    } catch (error) {
        res.sendStatus(401);
    }
}

module.exports = passwordController;