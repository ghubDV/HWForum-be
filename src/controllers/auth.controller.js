const { Users, Profiles } = require('../models');
const { generateHashedPassword, checkPassword, encryptData } = require('../helpers/auth/auth.helper');
const { sendEmail } = require('../helpers/email/email.helper');
const { currentMinutes } = require('../helpers/date/date.helper');
const { activationEmailTemplate, resetEmailTemplate } = require('../utils/emailTemplates.util');
const UnauthorizedError = require('../helpers/error/unauthorizedError');
const BadRequestError = require('../helpers/error/badRequestError');
const InternalError = require('../helpers/error/internalError');
const ForbiddenError = require('../helpers/error/forbiddenError');

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
    next(error);
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
      include: {
        model: Profiles,
        attributes: ['profileName']
      },
      where: {
        username: user.username
      }
    })

    if(!getUser || !checkPassword(user.password, getUser.hashedPassword)) {
      throw new BadRequestError('Wrong user credentials!')
    } else if (!getUser.isActivated) {
      throw new BadRequestError('Account is not activated!')
    } else {
      let profileName;

      if(getUser.Profile !== null) {
        profileName = getUser.Profile.profileName;
      }

      req.session.user = {
        id: getUser.id,
        username: getUser.username,
        ...profileName && { profileName }
      };

      res.send({ message: `Logged in as ${user.username}!`, username: user.username, profileName: profileName});
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
    req.session.destroy()
    res.end();
  } else {
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
      const data = `${type};${username};${currentMinutes()}`;
      const encrypted = encryptData(data);
      const code = `${encrypted.iv}${encrypted.data}`;
  
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
    const {
      username
    } = req.body;

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

const checkResetCode = async (req, res, next) => {
  try {
    const {
      username
    } = req.body;

    const user =  await Users.findOne({
      where: {
        username: username
      }
    })

    if(!user) {
      throw new InternalError('Reset password failed: Internal Server Error.')
    }

    res.send({ message: `You can reset your password!`, user: username });

  } catch (error) {
    next(error);
  }
}

const resetPassword = async (req, res, next) => {
  try { 
    const {
      username,
      password,
    } = req.body;
  
    if(!username || !password) {
      throw new BadRequestError('No data received!')
    }

    const resetPassword = await Users.update({ 
      hashedPassword: generateHashedPassword(password)
    },
    {
      where: {
        username: username
      }
    });

    if(resetPassword[0] === 0) {
      throw new InternalError('Reset password failed: Internal Server Error.')
    }

    res.send({ message: `Password was changed successfully` });

  } catch(error) {
    next(error);
  }
}



const checkAuthenthication = (req, res, next) => {
  if(!req.guardSkip) {
    const {
      user
    } = req.session;
  
    if(user) {
      if(req.guard) {
        req.auth = {
          authorized: true,
          user: {
            ...user
          }
        }
      } else {
        res.send({ authorized: true, username: user.username, profileName: user.profileName });
      }
    }
  
    if(!user) {
      res.clearCookie(process.env.SESSION_NAME);
      if(req.guard) {
        throw new ForbiddenError('You have to log in!');
      }
      throw new UnauthorizedError('You have to log in to access this!');
    }
  } else {
    next();
  }
}

module.exports = {
  insertUser,
  loginUser,
  logoutUser,
  sendCode,
  activateAccount,
  checkResetCode,
  resetPassword,
  checkAuthenthication
}