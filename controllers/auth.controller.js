const { emailConfirmation } = require('../models/mailing.model')
const { getNewToken, getNewSessionToken, passConverter, getNewUID } = require('../lib/helpers')
const prisma = require('../database')

const authController = () => {}

authController.register = async (req, res) => {
  const { username, password, email, newsletter } = req.body
  try {
    const user = await prisma.users.findMany({
      where: {
        OR: [
          { username: username },
          { email: email },
        ],
      },
    })

    if (!user[0]) {
      let emailToken = getNewToken(username, email, '1h')
      let uid = getNewUID()
      let convertedPass = await passConverter(username, password, uid)

      await prisma.users.create({
        data: {
          uid: uid,
          username: username,
          email: email,
          pwd: convertedPass,
          newsletter: newsletter,
          emailToken: emailToken,
          isEmailVerified: true
        },
      })

      await emailConfirmation(username, email, emailToken)

      res.sendStatus(201)
    } else {
      res.sendStatus(401)
      throw new Error
    }

  } catch (error) {
    console.error(error)
  }
}

authController.login = async (req, res) => {
  const { username, password } = req.body

  try {

    const user = await prisma.users.findMany({
      where: {
        username: username,
      },
    })

    let hash = await passConverter(username, password)

    if (!user[0] || user[0].pwd !== hash || !user[0].isEmailVerified) throw new Error

    let token = getNewSessionToken(user[0].uid, '24h')


    res.status(200).json({ token: token })

  } catch (error) {
    res.sendStatus(401)
    console.error(error)
  }
}

authController.newSession = async (req, res) => {
  const { uid } = req.body;

  try {
    let user = await prisma.users.findMany({
      where: {
        uid: uid
      }
    })

    if (!user[0]) throw new Error()

    res.status(200).json(user[0])
  } catch (err) {
    console.log(err)
    res.sendStatus(400)
  }
}

module.exports = authController
