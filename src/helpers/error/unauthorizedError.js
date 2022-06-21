const BaseError = require('./baseError');
const { UNAUTHORIZED } = require('../../utils/util.httpStatusCodes');

class UnauthorizedError extends BaseError {
  constructor(
    message,
    description,
    status = UNAUTHORIZED,
    isOperational = true
  ) {
    super(message, description, status, isOperational);
  }
}

module.exports = UnauthorizedError;