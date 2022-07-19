const BadRequestError = require('../helpers/error/badRequestError');
const { parseJOIError } = require('../helpers/error/error.helper');
const { currentMinutes } = require('../helpers/date/date.helper');
const { processDecrypted } = require('../helpers/auth/auth.helper');
const RegisterSchema = require('../schemas/register.schema');
const LoginSchema = require('../schemas/login.schema');
const CodeSchema = require('../schemas/code.schema');
const ActivateResetSchema = require('../schemas/sendActivateResetCode.schema');
const ResetPasswordSchema = require('../schemas/resetPassword.schema');

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
  const {
    type,
    code
  } = req.body;

  if(!code) {
    throw new BadRequestError('No data received!');
  }

  const validationResult = CodeSchema.validate({ code });

  if(validationResult.error !== undefined) {
    throw new BadRequestError('Activation code is not valid or expired!');
  }

  const [ action, username, expiration ] = processDecrypted(code);

  const now = currentMinutes();
  

  if(!action || action !== type || !username || !expiration || now - expiration > 60 ) {
    throw new BadRequestError('Activation code is not valid or expired!');
  }

  req.body = {
    username: username
  }

  next();
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

const validateResetPassword = (req, res, next) => {
  const { password, confirm_password } = req.body;

  const validationResult = ResetPasswordSchema.validate({ password, confirm_password });

  if(validationResult.error !== undefined) {
    throw new BadRequestError(parseJOIError(validationResult.error));
  }

  next();
}

module.exports = {
  validateRegister,
  validateLogin,
  validateCode,
  validateActivateReset,
  validateResetPassword
}