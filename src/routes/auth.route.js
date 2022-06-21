const { validateRegister } = require('../middlewares/auth.middleware');
const { insertUser } = require('../controllers/auth.controller');

module.exports = (app) => {
  app.post('/register', 
    validateRegister,
    insertUser  
  )
}