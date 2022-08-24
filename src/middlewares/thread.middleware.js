const ThreadSchema = require('../schemas/thread.schema');
const { parseJOIError } = require('../helpers/error/error.helper');
const BadRequestError = require('../helpers/error/badRequestError');

const validateThread = (req, res, next) => {
  const {
    name,
    content
  } = req.body;

  const validationResult = ThreadSchema.validate({ name, content });

  if(validationResult.error !== undefined) {
    throw new BadRequestError(parseJOIError(validationResult.error));
  }

  next();
}

module.exports = {
  validateThread
}