const BadRequestError = require('../helpers/error/badRequestError');
const { parseJOIError } = require('../helpers/error/error.helper');
const ProfileSchema = require('../schemas/profile.schema');

const validateProfile = (req, res, next) => {
  const {
    profileName,
    firstName,
    lastName
  } = req.body

  const validationResult = ProfileSchema.validate({ profileName, firstName, lastName });

  if(!profileName) {
    throw new BadRequestError('No data received!');
  }

  if(validationResult.error !== undefined) {
    throw new BadRequestError(parseJOIError(validationResult.error));
  }

  next();
}

module.exports = {
  validateProfile
}