const { createProfile, getProfile } = require('../controllers/profile.controller');
const { validateProfile } = require('../middlewares/profile.middleware');

module.exports = (app) => {
  app.get('/getProfile',
    getProfile
  )

  app.post('/createProfile', 
    validateProfile,
    createProfile
  )
}