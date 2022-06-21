class BaseError extends Error {
  constructor(message, description, status, isOperational) {
    super(description); 

    Object.setPrototypeOf(this, new.target.prototype)
    this.message = message;
    this.status = status;
    this.isOperational = isOperational;
    Error.captureStackTrace(this);
  }
}

module.exports = BaseError;