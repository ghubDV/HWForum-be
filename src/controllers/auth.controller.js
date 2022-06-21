const {User} = require('../models');
const UnauthorizedError = require('../helpers/error/unauthorizedError');

module.exports = {
  insertUser (req, res, next) {
    const {
      username,
      email,
      password
    } = req.body

    const user = {
      username: username,
      email: email,
      hashedPassword: password
    }

    User.create(user)
      .then(response => {
        res.send(response.toJSON());       
      })
      .catch(error => {
        next(new UnauthorizedError(error.errors[0].message))
      });
  }
}