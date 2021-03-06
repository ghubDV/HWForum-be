const crypto = require('crypto');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

const generateHashedPassword = (password) => {
  const salt = bcrypt.genSaltSync(SALT_ROUNDS);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
}

const checkPassword = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
}

const encryptData = (data) => {
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(process.env.CRYPTO_ALG, process.env.CRYPTO_SECRET, iv);

  const encrypted = Buffer.concat([ cipher.update(data), cipher.final() ]);

  return {
    iv: iv.toString('hex'),
    data: encrypted.toString('hex')
  }
}

const decryptData = ({ iv, data }) => {
  const decipher = crypto.createDecipheriv(process.env.CRYPTO_ALG, process.env.CRYPTO_SECRET, Buffer.from(iv, 'hex'));

  const decrypted = Buffer.concat([ decipher.update(Buffer.from(data, 'hex')), decipher.final() ]);

  return decrypted.toString();
}

const processDecrypted = (code) => {
  const [iv, data] = [code.slice(0,32), code.slice(32)];

  const decrypted = decryptData({
    iv: iv,
    data: data
  })

  const processed = decrypted.split(';');

  return processed;
}

module.exports = {
  generateHashedPassword,
  checkPassword,
  encryptData,
  decryptData,
  processDecrypted
}