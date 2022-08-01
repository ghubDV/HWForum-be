const { Profiles } = require('../models');

const createProfile = async (req, res, next) => {
  try {
    console.log('createProfile')
    const {
      profileName,
      firstName,
      lastName,
      isPublic
    } = req.body
  
    const profile = {
      userID: req.auth.user.id,
      profileName,
      ...firstName && {firstName},
      ...lastName && {lastName},
      ...isPublic && {isPublic}
    };
  
    if(profile.isPublic) {
      profile.isPublic = true;
    }

    console.log(profile);
  
    await Profiles.create(profile);
  
    res.send({
      message: 'Profile created successfully!'
    })
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createProfile
}