const { authorizeAccessToken } = require('../helpers/auth/auth.helper');
const UnauthorizedError = require('../helpers/error/unauthorizedError');

const protectRoute = async (req, res, next) => {
  try {
    const protected = ['/protected'];

    if(protected.includes(req.baseUrl + req.path)) {
      const decoded = authorizeAccessToken(req.cookies.authorization);

      if(decoded) {
        req.username = decoded.username;
      }
    }

    next();
  } catch {
    next(new UnauthorizedError('Not authorized to access this route!'));
  }
}

module.exports = {
  protectRoute
}