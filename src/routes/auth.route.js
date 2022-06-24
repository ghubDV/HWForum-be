const { validateRegister, validateLogin } = require('../middlewares/auth.middleware');
const { insertUser, loginUser } = require('../controllers/auth.controller');

module.exports = (app) => {
  app.post('/register', 
    validateRegister,
    insertUser  
  )

  app.get('/login',
    validateLogin,
    loginUser
  )
}