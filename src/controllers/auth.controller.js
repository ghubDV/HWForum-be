const { Users } = require('../models');
const { generateHashedPassword, checkPassword, encryptData, processDecrypted } = require('../helpers/auth/auth.helper');
const { currentMinutes } = require('../helpers/date/date.helper');
const { sendEmail } = require('../helpers/email/email.helper');
const { activationEmailTemplate, resetEmailTemplate } = require('../utils/emailTemplates.util');
const UnauthorizedError = require('../helpers/error/unauthorizedError');
const BadRequestError = require('../helpers/error/badRequestError');
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

    req.body.message = `Account was successfully created.\nAn email with the activation code has been sent to ${email}.`;
    req.body.type = 'activate';

    next()
  } catch (error) {
    next(new BadRequestError(error.errors[0].message));
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
    
    const getUser = await Users.findOne({
      attributes: ['id', 'username', 'hashedPassword', 'isActivated'],
      where: {
        username: user.username
      }
    })

    if(!getUser || !checkPassword(user.password, getUser.hashedPassword)) {
      throw new BadRequestError('Wrong user credentials!')
    } else if (!getUser.isActivated) {
      throw new BadRequestError('Account is not activated!')
    } else {
      req.session.user = {
        id: getUser.id,
        username: getUser.username
      };
      res.send({ message: `Logged in as ${user.username}!`, username: user.username});
    }
  } catch (error) {
    next(error);
  }
}

const logoutUser = (req, res) => {
  const {
    user
  } = req.session;

  if(user) {
    res.clearCookie(process.env.SESSION_NAME);
    req.session.destroy();
    res.end();
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
  
    const user =  await Users.findOne({
      attributes: queryData,
      where: {
        email: email
      }
    })
  
    if(!user) {
      throw new BadRequestError('This email doesn\'t belong to an existing account!');
    } else if (type === 'activate' && user.isActivated) {
      throw new BadRequestError('This account is already active!');
    } else {
      const username = user.username;
      const data = `${type};${username};${Math.floor(Date.now() / 1000 / 60)}`;
      const encrypted = encryptData(data);
      const code = `${encrypted.iv}.${encrypted.data}`;
  
      switch(type) {
        case 'activate':
          await sendEmail(activationEmailTemplate(email, username, code));
          res.send({ message: req.body.message || `Activation code was sent successfuly to ${email}` });
          break;
        case 'reset':
          await sendEmail(resetEmailTemplate(email, username, code));
          res.send({ message: `Reset password code was sent successfuly to ${email}` });
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
      throw new BadRequestError('Activation code is not valid or expired!');
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

    res.send({ message: 'Account activated successfully. You can Log in!' });

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
      throw new BadRequestError('Reset code is not valid or expired!');
    }

    const user =  await Users.findOne({
      where: {
        username: username
      }
    })

    if(!user) {
      throw new InternalError('Reset password failed: Internal Server Error.')
    }

    res.send(`Authorized reset for ${username}`);

  } catch (error) {
    next(error);
  }
}

const checkAuthenthication = (req, res, next) => {
  if(req.guardSkip) {
    next();
  }

  const {
    user
  } = req.session;

  if(user) {
    res.send({ authorized: true, username: user.username });
  }

  if(!user) {
    res.clearCookie(process.env.SESSION_NAME);
    throw new UnauthorizedError('You have to log in to access this!');
  }
}

module.exports = {
  insertUser,
  loginUser,
  logoutUser,
  sendCode,
  activateAccount,
  allowResetPassword,
  checkAuthenthication
}