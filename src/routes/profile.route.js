const { createProfile } = require('../controllers/profile.controller');
const { validateProfile } = require('../middlewares/profile.middleware');

module.exports = (app) => {
  app.post('/createProfile', 
    validateProfile,
    createProfile
  )
}