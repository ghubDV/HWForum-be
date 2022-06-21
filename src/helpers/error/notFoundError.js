const BaseError = require('./baseError');
const { NOT_FOUND } = require('../../utils/util.httpStatusCodes');

class NotFoundError extends BaseError {
  constructor(
    message,
    description,
    status = NOT_FOUND,
    isOperational = true
  ) {
    super(message, description, status, isOperational);
  }
}

module.exports = NotFoundError;