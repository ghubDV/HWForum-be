const AuthController = require('../controllers/controller.auth');

module.exports = (app) => {
  app.post('/register', AuthController.register)
}