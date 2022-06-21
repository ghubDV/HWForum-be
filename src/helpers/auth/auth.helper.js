const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

const getHashedPassword = (password) => {
  const salt = bcrypt.genSaltSync(SALT_ROUNDS);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
}

module.exports = {
  getHashedPassword
}