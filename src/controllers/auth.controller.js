const { User } = require('../models');
const { getHashedPassword } = require('../helpers/auth/auth.helper');
const UnauthorizedError = require('../helpers/error/unauthorizedError');

module.exports = {
  async insertUser (req, res, next) {
    try {
      const {
        username,
        email,
        password
      } = req.body
  
      const user = {
        username: username,
        email: email,
        hashedPassword: getHashedPassword(password)
      }
  
      const response = await User.create(user);
  
      res.send(response.toJSON());
    } catch (error) {
      next(new UnauthorizedError(error.errors[0].message));
    }
  }
}