const BaseError = require('./baseError');
const { FORBIDDEN } = require('../../utils/httpStatusCodes.util');

class ForbiddenError extends BaseError {
  constructor(
    message,
    description,
    status = FORBIDDEN,
    isOperational = true
  ) {
    super(message, description, status, isOperational);
  }
}

module.exports = ForbiddenError;