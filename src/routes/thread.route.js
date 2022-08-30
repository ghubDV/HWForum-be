const { createComment, createThread, updatePost, getThreadOrCommentsByThread } = require('../controllers/thread.controller');
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

  app.patch('/updatePost',
    validatePost,
    updatePost
  )
}