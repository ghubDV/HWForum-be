const { Profiles, Threads, Comments, sequelize } = require('../models');
const BadRequestError = require('../helpers/error/badRequestError');
const InternalError = require('../helpers/error/internalError');
const { getPagesAndOffset } = require('../helpers/pagination/pagination.helper');

const createComment = async (req, res, next) => {
  try {
    const {
      id,
      content
    } = req.body;

    const userID = req.auth.user.id;
    const HTMLContent = content.html;

    const profile = await Profiles.findOne({
      attributes: ['id'],
      where: {
        userID: userID
      }
    })

    if(profile) {
      const profileID = profile.get('id');
      const newComment= {
        threadID: id,
        profileID,
        content: HTMLContent
      };
  
      await Comments.create(newComment);

      const result = await Threads.increment(
        'replies',
        {
          by: 1,
          where: {
            id: id
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
      attributes: ['id'],
      where: {
        userID: userID
      }
    })
  
    if(profile) {
      const profileID = profile.get('id');
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

const updatePost = async (req, res, next) => {
  try {
    const {
      id,
      content,
      isThread
    } = req.body;

    const Post = isThread ? Threads : Comments;

    const userID = req.auth.user.id;
  
    const result = await Post.update(
      {
        content: content.html
      },
      {
        where: {
          id: id,
          profileID: [
            sequelize.literal(`
              SELECT Profiles.id
              FROM Users
              LEFT OUTER JOIN
              Profiles ON Users.id = Profiles.userID
              WHERE Users.id = ${userID}
            `)
          ]
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

const deletePost = async (req, res, next) => {
  try {
    const {
      id,
      threadID
    } = req.body;

    const userID = req.auth.user.id;

    const result = await Comments.destroy({
      where: {
        id: id,
        profileID: [
          sequelize.literal(`
            SELECT Profiles.id
            FROM Users
            LEFT OUTER JOIN
            Profiles ON Users.id = Profiles.userID
            WHERE Users.id = ${userID}
          `)
        ]
      }
    })

    if(result === 0) {
      throw new InternalError('Something went horribly wrong when trying to delete your post');
    }

    await Threads.decrement(
      'replies',
      {
        by: 1,
        where: {
          id: threadID
        }
      }
    )

    res.send({
      message: 'Comment deleted successfully!'
    });

  } catch (error) {
    next(error);
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

    const pagination = getPagesAndOffset(count.dataValues.comments, pageSize, page);

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
          offset: pagination.offset,
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
      pageCount: pagination.pages,
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
  deletePost,
  getThreadAndComments
}