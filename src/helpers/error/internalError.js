const BaseError = require('./baseError');
const { INTERNAL_SERVER } = require('../../utils/httpStatusCodes.util');

class InternalError extends BaseError {
  constructor(
    message,
    description,
    status = INTERNAL_SERVER,
    isOperational = true
  ) {
    super(message, description, status, isOperational);
  }
}

module.exports = InternalError;