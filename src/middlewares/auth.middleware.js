const BadRequestError = require('../helpers/error/badRequestError');
const { parseJOIError } = require('../helpers/error/error.helper');
const RegisterSchema = require('../schemas/register.schema');
const LoginSchema = require('../schemas/login.schema');
const CodeSchema = require('../schemas/code.schema');
const ActivateResetSchema = require('../schemas/sendActivateResetCode.schema');

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
      throw new BadRequestError(parseJOIError(validationResult.error));
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
    throw new BadRequestError(parseJOIError(validationResult.error));
  }

  next();
}

const validateCode = (req, res, next) => {
  const code =  req.body.code || req.query.code;

  if(!code) {
    throw new BadRequestError('Request error: No data received.');
  }

  const validationResult = CodeSchema.validate({ code });

  if(validationResult.error !== undefined) {
    throw new BadRequestError('Code is not valid!');
  }

   next()
}

const validateActivateReset = (req, res, next) => {
  const { type, email } =  req.body;

  if(!type || !email) {
    throw new BadRequestError('Request error: No data received.');
  }

  const validationResult = ActivateResetSchema.validate({ type, email });

  if(validationResult.error !== undefined) {
    throw new BadRequestError('This email address or request is not valid!');
  }

   next()
}

module.exports = {
  validateRegister,
  validateLogin,
  validateCode,
  validateActivateReset
}