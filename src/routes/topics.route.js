const { getCategories, getTopics, getTopicsCategories } = require("../controllers/topics.controller")

module.exports = (app) => {
  app.get('/getCategories',
    getCategories
  )

  app.post('/getTopics',
    getTopics
  )

  app.get('/getAll',
    getTopicsCategories
  )
}