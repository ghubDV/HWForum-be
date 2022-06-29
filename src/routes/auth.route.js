const { validateRegister, validateLogin } = require('../middlewares/auth.middleware');
const { protectRoute } = require('../middlewares/protect.middleware');
const { insertUser, loginUser } = require('../controllers/auth.controller');

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

  app.get('/protected',
    (req, res) => {
      res.send(`${req.username} authorized on ${req.url}`)
    }
  )
}