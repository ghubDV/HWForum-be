const parseJOIError = error => {
  return error.details[0].message;
}

module.exports = {
  parseJOIError
}