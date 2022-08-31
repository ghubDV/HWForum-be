const { createComment, createThread, updatePost, getThreadOrCommentsByThread , getThreadAndComments} = require('../controllers/thread.controller');
const { validateThread, validatePost } = require('../middlewares/thread.middleware');

module.exports = (app) => {

  app.post('/createComment', 
    validatePost,
    createComment
  )

  app.post('/createThread',
    validateThread,
    createThread
  )

  app.get('/getThreadOrCommentsByThread',
    getThreadOrCommentsByThread
  )

  app.get('/getThreadAndComments',
    getThreadAndComments
  )

  app.patch('/updatePost',
    validatePost,
    updatePost
  )
}