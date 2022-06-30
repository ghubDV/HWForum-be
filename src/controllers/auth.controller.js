const { Users } = require('../models');
const { generateHashedPassword, checkPassword, generateAccessToken, encryptData, decryptData } = require('../helpers/auth/auth.helper');
const { sendEmail } = require('../helpers/email/email.helper');
const { activationEmailTemplate } = require('../utils/email.util');
const UnauthorizedError = require('../helpers/error/unauthorizedError');
const InternalError = require('../helpers/error/internalError');

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
      attributes: ['username', 'isActivated'],
      where: {
        email: email
      }
    })

    if(!userExists) {
      throw new UnauthorizedError('This email doesn\'t belong to an existing account!');
    } else if(userExists[0].isActivated) {
      throw new UnauthorizedError('This account is already active!');
    } else {
      const username = userExists[0].username;
      const data = `activate;${username};${Math.floor(Date.now() / 1000 / 60)}`;
      const encrypted = encryptData(data);
      const activationCode = `${encrypted.iv}.${encrypted.data}`;

      await sendEmail(activationEmailTemplate(email, username, activationCode));

      res.send(`Activation code was sent successfuly to ${email}`);
    }
  } catch (error) {
    next(error);
  }
}

const activateAccount = async (req, res, next) => {
  try {
    const activationCode = req.body.code || req.query.code;
    
    const [ iv, data ] = activationCode.split('.');

    const decrypted = decryptData({
      iv: iv,
      data: data
    })

    const [ action, username, expiration ] = decrypted.split(';');
    const now = Math.floor(Date.now() / 1000 / 60);
    

    if(!action || action !== 'activate' || !username || !expiration || now - expiration > 60 ) {
      throw new UnauthorizedError('Activation code is not valid or expired!');
    }

    const activationResult = await Users.update({ 
      isActivated: true
    },
    {
      where: {
        username: username,
        isActivated: false
      }
    });

    if(activationResult[0] === 0) {
      throw new InternalError('Activation failed: activation code is not valid or the account is already active.')
    }

    res.send('Your account was activated successfully!');

  } catch (error) {
    next(error);
  }
}

module.exports = {
  insertUser,
  loginUser,
  sendActivationCode,
  activateAccount
}