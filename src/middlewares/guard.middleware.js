const guardRoute = (req, res, next) => {
  const protected = [
    '/createComment',
    '/createProfile',
    '/createThread',
    '/updatePost',
    '/deletePost',
    '/protected', 
    '/updateProfile',
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