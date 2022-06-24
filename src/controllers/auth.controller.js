const { Users } = require('../models');
const { generateHashedPassword, checkPassword, generateAccessToken } = require('../helpers/auth/auth.helper');
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
      attributes: ['username', 'hashedPassword'],
      where: {
        username: user.username
      }
    })

    if(getCredentials.length !== 0 && checkPassword(user.password, getCredentials[0].hashedPassword)) {
      const accessToken = generateAccessToken(user.username);
      res.cookie('accessToken', accessToken, { httpOnly: true });
      res.send(`Logged in as ${user.username}!`);
    } else {
      throw new UnauthorizedError('Wrong user credentials!')
    }
  } catch (error) {
    next(error);
  }
}

module.exports = {
  insertUser,
  loginUser
}