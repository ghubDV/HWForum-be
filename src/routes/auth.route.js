const { validateRegister, validateLogin, validateCode, validateEmail } = require('../middlewares/auth.middleware');
const { protectRoute } = require('../middlewares/protect.middleware');
const { insertUser, loginUser, sendActivationCode, sendResetCode, activateAccount } = require('../controllers/auth.controller');

module.exports = (app) => {
  app.all('*', protectRoute)

  app.post('/register', 
    validateRegister,
    insertUser  
  )

  app.get('/login',
    validateLogin,
    loginUser
  )

  app.get('/sendActivationCode',
    validateEmail,
    sendActivationCode
  )

  app.get('/forgot', 
    validateEmail,
    sendResetCode
  )

  app.patch('/activateAccount',
    validateCode,
    activateAccount
  )

  app.get('/protected',
    (req, res) => {
      res.send(`${req.username} authorized on ${req.url}`)
    }
  )
}