const jwt = require("jsonwebtoken");

const sha256 = require('crypto-js/sha256');
const Base64 = require('crypto-js/enc-base64');
const { v4: uuidv4 } = require('uuid');

const prisma = require('../database');


exports.getNewToken = (userId, userEmail, userAdminLvl, validity = null) => {
    if (validity) {
        return jwt.sign(
            {
                id: userId,
                email: userEmail,
                adminLvl: userAdminLvl
            },
            process.env.TOKEN_KEY,
            {
                expiresIn: validity,
            }
        );
    } else {
        return jwt.sign(
            {
                id: userId,
                email: userEmail,
                adminLvl: userAdminLvl
            },
            process.env.TOKEN_KEY
        );
    }
}

exports.getNewSessionToken = (userUid, validity) => {
    return jwt.sign(
      {
          userUid: userUid
      },
      process.env.TOKEN_KEY,
      {
          expiresIn: validity,
      }
    );
}

exports.passConverter = async (username, password, uid = null) => {
    let salt;

    if (uid !== null) {
        salt = sha256(uid);
        salt = salt.toString()

    } else {
        const user = await prisma.users.findMany({
            where: {
                username: username
            }
        });

        salt = sha256(user[0].uid);
        salt = salt.toString()
    }

    let hash = sha256('sha256' + '64' + salt + ':' + password);

    return hash.toString()
}

exports.setUserAccountValidated = async (token, tokenVerif) => {
    const user = await prisma.users.findMany({
        where: {
            email: tokenVerif.email,
            isEmailVerified: false,
            emailToken: token
        }
    });

    if (!user[0]) throw new Error;

    await prisma.users.update({
        where: {
            id: user[0].id
        },
        data: {
            isEmailVerified: true
        }
    });
}

exports.getNewUID = () => {
    return uuidv4()
}
