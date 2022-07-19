const {
  validateRegister,
  validateLogin,
  validateCode,
  validateActivateReset,
  validateResetPassword
} = require('../middlewares/auth.middleware');

const {
  insertUser,
  loginUser,
  logoutUser,
  sendCode,
  activateAccount,
  checkResetCode,
  checkAuthenthication,
  resetPassword 
} = require('../controllers/auth.controller');

module.exports = (app) => {

  app.delete('/logout',
    logoutUser
  )

  app.get('/checkAuthenthication',
    checkAuthenthication
  )

  app.get('/protected',
    (req, res) => {
      res.send(`${req.username} authorized on ${req.url}`)
    }
  )

  app.patch('/activateAccount',
    validateCode,
    activateAccount
  )

  app.patch('/resetPassword',
    validateResetPassword,
    resetPassword
  )

  app.post('/register', 
    validateRegister,
    insertUser,
    sendCode
  )

  app.post('/login',
    validateLogin,
    loginUser
  )

  app.post('/sendCode',
    validateActivateReset,
    sendCode
  )

  app.post('/checkReset', 
    validateCode,
    checkResetCode
  )
}