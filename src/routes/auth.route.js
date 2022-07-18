const { validateRegister, validateLogin, validateCode, validateActivateReset } = require('../middlewares/auth.middleware');
const { insertUser, loginUser, logoutUser, sendCode, activateAccount, allowResetPassword, checkAuthenthication } = require('../controllers/auth.controller');

module.exports = (app) => {
  app.post('/register', 
    validateRegister,
    insertUser,
    sendCode
  )

  app.post('/login',
    validateLogin,
    loginUser
  )

  app.delete('/logout',
    logoutUser
  )

  app.post('/sendActivationCode',
    validateActivateReset,
    sendCode
  )

  app.post('/sendResetCode', 
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

  app.get('/checkAuthenthication',
    checkAuthenthication
  )

  app.get('/protected',
    (req, res) => {
      res.send(`${req.username} authorized on ${req.url}`)
    }
  )
}