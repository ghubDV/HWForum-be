const guardRoute = (req, res, next) => {
  const protected = ['/protected'];

  if(protected.includes(req.baseUrl + req.path)) {
    next();
  }

  req.guardSkip = true;
  next();
}

module.exports = {
  guardRoute
}