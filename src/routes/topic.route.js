const { getCategories, getTopics, getTopicsCategories, getThreadsTopic } = require("../controllers/topic.controller")

module.exports = (app) => {
  app.get('/getCategories',
    getCategories
  )

  app.get('/getTopics',
    getTopics
  )

  app.get('/getTopicsCategories',
    getTopicsCategories
  )

  app.post('/getThreadsTopic',
    getThreadsTopic
  )
}