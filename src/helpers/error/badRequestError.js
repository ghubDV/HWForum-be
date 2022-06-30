const BaseError = require('./baseError');
const { BAD_REQUEST } = require('../../utils/httpStatusCodes.util');

class BadRequestError extends BaseError {
  constructor(
    message,
    description,
    status = BAD_REQUEST,
    isOperational = true
  ) {
    super(message, description, status, isOperational);
  }
}

module.exports = BadRequestError;