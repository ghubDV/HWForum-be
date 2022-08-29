const ThreadSchema = require('../schemas/thread.schema');
const { parseJOIError } = require('../helpers/error/error.helper');
const BadRequestError = require('../helpers/error/badRequestError');

const validateThread = (req, res, next) => {
  const {
    topic,
    name,
    content
  } = req.body;

  const textContent = content.text;

  const validationResult = ThreadSchema.validate({ topic, name, content: textContent });

  if(validationResult.error !== undefined) {
    throw new BadRequestError(parseJOIError(validationResult.error));
  }

  next();
}

module.exports = {
  validateThread
}