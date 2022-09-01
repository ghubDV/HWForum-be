const { Profiles, Threads, Comments, sequelize } = require('../models');
const BadRequestError = require('../helpers/error/badRequestError');
const InternalError = require('../helpers/error/internalError');

const createComment = async (req, res, next) => {
  try {
    const {
      thread,
      content
    } = req.body;

    const userID = req.auth.user.id;
    const HTMLContent = content.html;

    const profile = await Profiles.findOne({
      attributes: ['profileName'],
      where: {
        userID: userID
      }
    })

    if(profile) {
      const profileName = profile.get('profileName');
      const newComment= {
        threadID: thread,
        profileName,
        content: HTMLContent
      };
  
      await Comments.create(newComment);

      const result = await Threads.increment(
        'replies',
        {
          by: 1,
          where: {
            id: thread
          }
        }
      )

      if(result[0] === 0) {
        throw new InternalError('Something went horribly wrong when trying create your comment');
      }

      res.send({
        message: 'Comment created successfully!',
      })
    } else {
      throw new BadRequestError('You need to create a profile to be able to post a comment!')
    }

  } catch (error) {
    next(error)
  }
}

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
      attributes: ['profileName'],
      where: {
        userID: userID
      }
    })
  
    if(profile) {
      const profileName = profile.get('profileName');
      const newThread = {
        topicID: topic,
        profileName,
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

const updatePost = async (req, res, next) => {
  try {
    const {
      postID,
      content,
      isThread
    } = req.body;

    const Post = isThread ? Threads : Comments;
  
    const result = await Post.update(
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

    res.send({
      message: 'Post updated successfully!'
    });
  } catch (error) {
    next(error);
  }
}


const getThreadOrCommentsByThread = async (req, res, next) => {
  try {
    const {
      threadID,
      isThread
    } = req.query

    const threadNotFound = new BadRequestError('Ouch :( ! We couldn\'t find this thread');
  
    if(!threadID) {
      throw threadNotFound;
    }

    let post;

    if(isThread) {
      post = await Threads.findOne({
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
    } else {
      post = await Comments.findAll({
        attributes: ['id', 'content', 'updatedAt'],
        include: {
          model: Profiles,
          as: 'profile',
          attributes: ['id', ['profileName', 'name'], 'avatar']
        },
        where: {
          threadID: threadID
        }
      })
    }

    if(!post) {
      throw threadNotFound;
    }

    res.send(post);
  } catch (error) {
    next(error)
  }
}

const getThreadAndComments = async (req, res, next) => {
  try {
    const {
      threadID,
      pageSize,
      page
    } = req.body;

    const threadNotFound = new BadRequestError('Ouch :( ! We couldn\'t find this thread');

    if(!threadID) {
      throw threadNotFound;
    }

    const count = await Comments.findOne({
      attributes:[[sequelize.fn('COUNT', sequelize.col('id')), 'comments']],
      where: {
        threadID: threadID
      }
    })

    let posts = await Threads.findOne({
      attributes: ['id', ['name', 'title'], 'content', 'updatedAt'],
      include: [
        {
          model: Profiles,
          as: 'profile',
          attributes: [['profileName', 'name'], 'avatar']
        },
        {
          model: Comments,
          as: 'comments',
          attributes: ['id', 'content', 'createdAt', 'updatedAt'],
          subQuery: true,
          limit: pageSize,
          offset: count.dataValues.comments > pageSize ? (page - 1) * pageSize : 0,
          include: {
            model: Profiles,
            as: 'profile',
            attributes: [['profileName', 'name'], 'avatar']
          },
          order: [
            ['createdAt', 'asc']
          ]
        }
      ],
      where: {
        id: threadID
      },
    })

    if(!posts || !count) {
      throw threadNotFound;
    }

    posts = {...posts.dataValues};

    const thread = {
      id: posts.id,
      title: posts.title,
      content: posts.content,
      updatedAt: posts.updatedAt,
      profile: posts.profile,
      commentsCount: count.dataValues.comments,
      isThread: true
    }
    
    const parsedPosts = [thread, ...posts.comments];

    res.send(parsedPosts);

  } catch (error) {
    next(error)
  }
}

module.exports = {
  createComment,
  createThread,
  updatePost,
  getThreadOrCommentsByThread,
  getThreadAndComments
}