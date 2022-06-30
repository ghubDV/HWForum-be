const { validateRegister, validateLogin, validateActivationCode } = require('../middlewares/auth.middleware');
const { protectRoute } = require('../middlewares/protect.middleware');
const { insertUser, loginUser, sendActivationCode, activateAccount } = require('../controllers/auth.controller');

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
    sendActivationCode
  )

  app.patch('/activateAccount',
    validateActivationCode,
    activateAccount
  )

  app.get('/protected',
    (req, res) => {
      res.send(`${req.username} authorized on ${req.url}`)
    }
  )
}