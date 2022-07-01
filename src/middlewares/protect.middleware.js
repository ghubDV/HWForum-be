const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../helpers/error/unauthorizedError');

const protectRoute = async (req, res, next) => {
  try {
    const notProtected = [
      '/login', 
      '/register', 
      '/sendActivationCode', 
      '/sendResetCode',
      '/activateAccount',
      '/authorizeReset'
    ];

    if(!notProtected.includes(req.baseUrl + req.path)) {
      const cookies = req.headers.cookie.split(';');  
      const accessToken = cookies.map( cookie => {
        if(cookie.includes('authorization')) {
          return cookie.split('=')[1];
        }
      })

      const decoded = jwt.verify(accessToken[0], process.env.TOKEN_SECRET);

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