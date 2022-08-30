const { Profiles, Threads } = require('../models');
const BadRequestError = require('../helpers/error/badRequestError');
const InternalError = require('../helpers/error/internalError');

const createThread = async (req, res, next) => {
  try {
    const {
      topic,
      name,
      content
    } = req.body;
  
    const userID = req.auth.user.id;
    const HTMLContent = content.html;

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
        content: HTMLContent
      };
  
      const result = await Threads.create(newThread);

      res.send({
        message: 'Thread created successfully!',
        threadID: result.dataValues.id
      })
    } else {
      throw new BadRequestError('You need to create a profile to be able to post a thread!')
    }
  } catch (error) {
    next(error);
  }
}

const getThreadById = async (req, res, next) => {
  try {
    const {
      threadID
    } = req.query

    const threadNotFound = new BadRequestError('Ouch :( ! This thread does not exist');
  
    if(!threadID) {
      throw threadNotFound;
    }
  
    const thread = await Threads.findOne({
      attributes: ['id', ['name', 'title'], 'content', 'updatedAt'],
      include: {
        model: Profiles,
        as: 'profile',
        attributes: ['id', ['profileName', 'name'], 'avatar']
      },
      where: {
        id: threadID
      }
    })

    if(!thread) {
      throw threadNotFound;
    }

    res.send(thread);
  } catch (error) {
    next(error)
  }
}

const editPost = async (req, res, next) => {
  try {
    const {
      postID,
      content,
      isThread
    } = req.body;
  
    if(isThread) {
      const result = await Threads.update(
        {
          content: content.html
        },
        {
          where: {
            id: postID
          }
        }
      )

      if(result[0] === 0) {
        throw new InternalError('Something went horribly wrong when trying to update your profile');
      }
    }

    res.send({
      message: 'Post updated successfully!'
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createThread,
  editPost,
  getThreadById
}