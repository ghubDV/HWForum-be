const { getCategories, getTopics, getTopicsCategories } = require("../controllers/topics.controller")

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
}