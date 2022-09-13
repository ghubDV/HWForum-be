const { Profiles, Users } = require('../models');
const InternalError = require('../helpers/error/internalError');

const createProfile = async (req, res, next) => {
  try {
    const {
      profileName,
      firstName,
      lastName,
      isPublic,
      avatar
    } = req.body
  
    const profile = {
      userID: req.auth.user.id,
      profileName,
      ...firstName && {firstName},
      ...lastName && {lastName},
      ...isPublic && {isPublic},
      ...avatar && {avatar}
    };
  
    if(profile.isPublic) {
      profile.isPublic = true;
    }
  
    await Profiles.create(profile);

    req.session.user.profileName = profileName;
  
    res.send({
      message: 'Profile created successfully!'
    })
  } catch (error) {
    next(error);
  }
}

const getProfile = async(req, res, next) => {
  try {
    const {
      username
    } = req.query;

  
    const result = await Users.findOne({
      attributes: ['id'],
      where: {
        username: username
      }
    });

    const profile = await Profiles.findOne({
      attributes: ['profileName', 'firstName', 'lastName', 'avatar', 'isPublic'],
      where: {
        userID: result.dataValues.id
      }
    })

    if(profile) {
      res.send({ 
        profile: profile 
      });
    } else {
      res.send({
        profile: null
      })
    }
  } catch (error) {
    next(error);
  }
}

const updateProfile = async (req, res, next) => {
  try {
    const {
      profileName,
      firstName,
      lastName,
      isPublic
    } = req.body
  
    const updatedProfile = {
      userID: req.auth.user.id,
      profileName,
      ...firstName && {firstName},
      ...lastName && {lastName},
      ...isPublic && {isPublic}
    };

    if(updatedProfile.isPublic) {
      updatedProfile.isPublic = true;
    } else {
      updatedProfile.isPublic = false;
    }

    const result = await Profiles.update(
      updatedProfile,
      {
        where: {
          userID: updatedProfile.userID
        }
      }
    );

    if(result[0] === 0) {
      throw new InternalError('Something went horribly wrong when trying to update your profile');
    }

    req.session.user.profileName = profileName;

    res.send({
      message: 'Profile was updated successfully!'
    });


  } catch (error) {
    next(error);
  }
}

module.exports = {
  createProfile,
  getProfile,
  updateProfile
}