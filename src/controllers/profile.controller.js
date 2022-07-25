const { Profiles } = require('../models');

const createProfile = async (req, res, next) => {
  try {
    const {
      profileName,
      firstName,
      lastName
    } = req.body

    const profile = {
      userID: req.auth.user.id,
      profileName,
      ...firstName && {firstName},
      ...lastName && {lastName}
    };

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