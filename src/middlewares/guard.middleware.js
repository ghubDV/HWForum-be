const guardRoute = (req, res, next) => {
  const protected = [
    '/protected', 
    '/createProfile',
    '/getProfile',
    '/updateProfile'
  ];

  if(protected.includes(req.baseUrl + req.path)) {
    req.guard = true;
    next();
  }

  req.guardSkip = true;
  next();
}

module.exports = {
  guardRoute
}