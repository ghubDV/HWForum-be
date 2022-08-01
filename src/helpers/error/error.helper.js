const parseJOIError = error => {
  return error.details[0].message;
}

const parseDBErrors = errors => {
  const parsedErrors = errors.map(error => {
    return {
      message: error.message,
      origin: error.origin,
      path: error.path,
      validator: error.validatorKey
    }
  })

  return parsedErrors;
}

module.exports = {
  parseJOIError,
  parseDBErrors
}