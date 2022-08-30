const { createThread, editPost, getThreadById } = require('../controllers/thread.controller');
const { validateThread, validatePost } = require('../middlewares/thread.middleware');

module.exports = (app) => {
  app.post('/createThread',
    validateThread,
    createThread
  )

  app.get('/getThreadById',
    getThreadById
  )

  app.patch('/updatePost',
    validatePost,
    editPost
  )
}