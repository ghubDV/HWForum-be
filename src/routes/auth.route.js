const { validateRegister, validateLogin, validateCode, validateActivateReset } = require('../middlewares/auth.middleware');
const { protectRoute } = require('../middlewares/protect.middleware');
const { insertUser, loginUser, sendCode, activateAccount, allowResetPassword } = require('../controllers/auth.controller');

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
    validateActivateReset,
    sendCode
  )

  app.get('/sendResetCode', 
    validateActivateReset,
    sendCode
  )

  app.patch('/activateAccount',
    validateCode,
    activateAccount
  )

  app.get('/authorizeReset', 
    validateCode,
    allowResetPassword
  )

  app.get('/protected',
    (req, res) => {
      res.send(`${req.username} authorized on ${req.url}`)
    }
  )
}