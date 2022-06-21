const BaseError = require('./baseError');
const { INTERNAL_SERVER } = require('../../utils/util.httpStatusCodes');

class InternalError extends BaseError {
  constructor(
    message,
    description,
    status = INTERNAL_SERVER,
    isOperational = false
  ) {
    super(message, description, status, isOperational);
  }
}

module.exports = InternalError;