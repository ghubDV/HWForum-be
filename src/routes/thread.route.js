const { createComment, createThread, updatePost, getThreadAndComments, deletePost} = require('../controllers/thread.controller');
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

  app.delete('/deletePost',
    deletePost
  )

  app.patch('/updatePost',
    validatePost,
    updatePost
  )

  app.post('/getThreadAndComments',
    getThreadAndComments
  )
}