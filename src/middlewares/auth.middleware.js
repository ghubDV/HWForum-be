const UnauthorizedError = require('../helpers/error/unauthorizedError');
const BadRequestError = require('../helpers/error/badRequestError');
const RegisterSchema = require('../schemas/register.schema');
const LoginSchema = require('../schemas/login.schema');
const CodeSchema = require('../schemas/code.schema');

const validateRegister = (req, res, next) => {
    const {
      username,
      email,
      password,
      confirm_password
    } = req.body;
  
    const user = {
      username,
      email,
      password,
      confirm_password
    }
  
    const validationResult = RegisterSchema.validate(user);
  
    if(validationResult.error !== undefined) {
      throw new UnauthorizedError(validationResult.error.details[0].message);
    }

    next()
}

const validateLogin = (req, res, next) => {
  const {
    username,
    password
  } = req.body;

  const user = {
    username,
    password
  }

  const validationResult = LoginSchema.validate(user);

  if(validationResult.error !== undefined) {
    throw new UnauthorizedError(validationResult.error.details[0].message);
  }

  next();
}

const validateActivationCode = (req, res, next) => {
  const activationCode =  req.body.code || req.query.code;

  if(!activationCode) {
    throw new BadRequestError('Request error: No data received.');
  }

  const validationResult = CodeSchema.validate({ activationCode });

  if(validationResult.error !== undefined) {
    throw new UnauthorizedError('Activation code is not valid!');
  }

   next()
}

module.exports = {
  validateRegister,
  validateLogin,
  validateActivationCode
}