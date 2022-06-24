const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SALT_ROUNDS = 10;

const generateHashedPassword = (password) => {
  const salt = bcrypt.genSaltSync(SALT_ROUNDS);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
}

const checkPassword = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
}

const generateAccessToken = (username) => {
  return jwt.sign({ username }, process.env.TOKEN_SECRET, { expiresIn: '300s' });
}

module.exports = {
  generateHashedPassword,
  checkPassword,
  generateAccessToken
}