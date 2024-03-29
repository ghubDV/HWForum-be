const { createProfile, getProfile, updateProfile } = require('../controllers/profile.controller');
const { validateProfile } = require('../middlewares/profile.middleware');

module.exports = (app) => {
  app.get('/getProfile',
    getProfile
  )

  app.patch('/updateProfile',
    validateProfile,
    updateProfile
  )

  app.post('/createProfile', 
    validateProfile,
    createProfile
  )
}