
const { guardRoute } = require('../middlewares/guard.middleware');
const { checkAuthenthication } = require('../controllers/auth.controller');

module.exports = (app) => {
  app.all('*', 
    guardRoute,
    checkAuthenthication
  )
}