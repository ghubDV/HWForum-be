const BaseError = require('./baseError');
const { UNAUTHORIZED } = require('../../utils/httpStatusCodes.util');

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