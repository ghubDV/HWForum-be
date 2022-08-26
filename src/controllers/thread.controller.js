const { Profiles, Threads } = require('../models');
const BadRequestError = require('../helpers/error/badRequestError');

const createThread = async (req, res, next) => {
  try {
    const {
      topic,
      name,
      content
    } = req.body;
  
    const userID = req.auth.user.id;
    const profile = await Profiles.findOne({
      attributes: [['id', 'profileID']],
      where: {
        userID: userID
      }
    })
  
    if(profile) {
      const profileID = profile.get('profileID');
      const newThread = {
        topicID: topic,
        profileID,
        name,
        content
      };
  
      await Threads.create(newThread);

      res.send({
        message: 'Thread created successfully!'
      })
    } else {
      throw new BadRequestError('You need to create a profile to be able to post a thread!')
    }
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createThread
}