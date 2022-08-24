const { createThread } = require('../controllers/thread.controller');
const { validateThread } = require('../middlewares/thread.middleware');

module.exports = (app) => {
  app.post('/createThread',
    validateThread,
    createThread
  )
}