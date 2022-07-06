const { Users } = require('../models');
const { generateHashedPassword, checkPassword, generateAccessToken, encryptData, processDecrypted } = require('../helpers/auth/auth.helper');
const { currentMinutes } = require('../helpers/date/date.helper');
const { sendEmail } = require('../helpers/email/email.helper');
const { activationEmailTemplate, resetEmailTemplate } = require('../utils/email.util');
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

    await Users.create(user);

    res.send({message: 'Account was successfully created!'});
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

const sendCode = async (req, res, next) => {
  try {
    const {
      type,
      email
    } = req.body;
  
    let queryData = ['username'];
  
    if(type === 'activate') {
      queryData.push('isActivated');
    }
  
    const userExists =  await Users.findAll({
      attributes: queryData,
      where: {
        email: email
      }
    })
  
    if(!userExists) {
      throw new UnauthorizedError('This email doesn\'t belong to an existing account!');
    } else if (type === 'activate' && userExists[0].isActivated) {
      throw new UnauthorizedError('This account is already active!');
    } else {
      const username = userExists[0].username;
      const data = `${type};${username};${Math.floor(Date.now() / 1000 / 60)}`;
      const encrypted = encryptData(data);
      const code = `${encrypted.iv}.${encrypted.data}`;
  
      switch(type) {
        case 'activate':
          await sendEmail(activationEmailTemplate(email, username, code));
          res.send(`Activation code was sent successfuly to ${email}`);
          break;
        case 'reset':
          await sendEmail(resetEmailTemplate(email, username, code));
          res.send(`Reset password code was sent successfuly to ${email}`);
          break;
      }
    }
  } catch (error) {
    next(error);
  }
}

const activateAccount = async (req, res, next) => {
  try {
    const code = req.body.code || req.query.code;

    const [ action, username, expiration ] = processDecrypted(code);

    const now = currentMinutes();
    

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

const allowResetPassword = async (req, res, next) => {
  try {
    const code = req.body.code || req.query.code;

    const [ action, username, expiration ] = processDecrypted(code);

    const now = currentMinutes();

    if(!action || action !== 'reset' || !username || !expiration || now - expiration > 60 ) {
      throw new UnauthorizedError('Reset code is not valid or expired!');
    }

    const userExists =  await Users.findAll({
      where: {
        username: username
      }
    })

    if(!userExists) {
      throw new InternalError('Reset password failed: Internal Server Error.')
    }

    res.send(`Authorized reset for ${username}`);

  } catch (error) {
    next(error);
  }
}

module.exports = {
  insertUser,
  loginUser,
  sendCode,
  activateAccount,
  allowResetPassword
}