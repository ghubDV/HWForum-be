const BaseError = require('../helpers/error/baseError');

function logError (err) {
  console.error(err)
 }
 
 function logErrorMiddleware (err, req, res, next) {
  logError(err)
  next(err)
 }
 
 function returnErrorMiddleWare (err, req, res, next) {
  try {
    //db error detected
    if(err.errors) {
      res.status(500).send(err.errors);
    } else {
      res.status(err.status || 500).send([err])
    }
  } catch {
    next(err);
  }
 }
 
 function isOperationalError(err) {
  if (err instanceof BaseError) {
  return err.isOperational
  }
  return false
 }
 
 module.exports = {
  logError,
  logErrorMiddleware,
  returnErrorMiddleWare,
  isOperationalError
 }