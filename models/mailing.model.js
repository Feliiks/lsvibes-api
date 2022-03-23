const transporter = require('../lib/transporter')

exports.emailConfirmation = async (username, email, token) => {
  return await transporter.sendMail(
    {
      from: 'account@lsvibes.fr',
      to: email,
      subject: 'Confirmation de votre compte LS Vibes',
      html: `
          Bonjour ${username},<br><br>
          Confirmez votre compte LS Vibes en cliquant <a href='http://localhost:3000/register/account-confirmation/${token}' target='_blank'>sur ce lien</a>.
        `,
    },
  )
}

exports.sendPasswordEmailConfirmationToClient = async (
  username, email, token) => {
  return await transporter.sendMail(
    {
      from: 'account@lsvibes.fr',
      to: email,
      subject: 'Récupération de votre mot de passe LS Vibes',
      html: `
          Bonjour ${username},<br><br>
          Récupérez votre mot de passe en cliquant sur <a href='http://localhost:3000/password/passwordrequest/${token}' target='_blank'>ce lien</a>.
        `,
    },
  )
}
