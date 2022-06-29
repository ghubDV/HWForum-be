const { Users } = require('../models');
const { generateHashedPassword, checkPassword, generateAccessToken, encryptData } = require('../helpers/auth/auth.helper');
const { sendEmail } = require('../helpers/email/email.helper');
const { activationEmailTemplate } = require('../utils/email.util');
const UnauthorizedError = require('../helpers/error/unauthorizedError');

const insertUser = async (req, res, next) => {
  try {
    const {
      username,
      email,
      password
    } = req.body

    const user = {
      username: username,
      email: email,
      hashedPassword: generateHashedPassword(password)
    }

    const response = await Users.create(user);

    res.send(response.toJSON());
  } catch (error) {
    next(new UnauthorizedError(error.errors[0].message));
  }
}

const loginUser = async (req, res, next) => {
  try {
    const {
      username,
      password
    } = req.body;

    const user = {
      username,
      password
    }
    
    const getCredentials = await Users.findAll({
      attributes: ['username', 'hashedPassword', 'isActivated'],
      where: {
        username: user.username
      }
    })

    if(getCredentials.length === 0 || !checkPassword(user.password, getCredentials[0].hashedPassword)) {
      throw new UnauthorizedError('Wrong user credentials!')
    } else if (!getCredentials[0].isActivated) {
      throw new UnauthorizedError('Account is not activated!')
    } else {
      const accessToken = generateAccessToken(user.username);
      res.cookie('authorization', accessToken, { httpOnly: true });
      res.send(`Logged in as ${user.username}!`);
    }
  } catch (error) {
    next(error);
  }
}

const sendActivationCode = async (req, res, next) => {
  try {
    const {
      email
    } = req.body;
  
    const userExists =  await Users.findAll({
      attributes: ['username'],
      where: {
        email: email
      }
    })

    if(!userExists) {
      throw new UnauthorizedError('This email doesn\'t belong to an existing account!');
    } else {
      console.log(userExists[0].username);
      const username = userExists[0].username;
      const encrypted = encryptData(username);
      const activationCode = `${encrypted.iv}.${encrypted.data}`;

      await sendEmail(activationEmailTemplate(email, username, activationCode));

      res.send(`Activation code was sent successfuly to ${email}`);
    }
  } catch (error) {
    next(error);
  }
}

module.exports = {
  insertUser,
  loginUser,
  sendActivationCode
}