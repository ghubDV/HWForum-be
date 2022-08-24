const BadRequestError = require('../helpers/error/badRequestError');
const { Categories, Profiles, Topics, Threads } = require('../models');

const getCategories = async (req, res, next) => {
  try {
    const categories = await Categories.findAll({
      attributes: ['id', 'name']
    })

    res.send(categories);
  } catch (error) {
    next(error);
  }
}

const getTopics = async (req, res, next) => {
  try {
    const {
      category
    } = req.query;

    if(!category) {
      throw new BadRequestError('No data received!');
    }

    const topics = await Topics.findAll({
      attributes: ['id', 'name'],
      where: {
        categoryID: category
      }
    })

    res.send(topics);

  } catch (error) {
    next(error);
  }
}

const getTopicsCategories = async (req, res, next) => {
  try {
    const results = await Categories.findAll({
      attributes: ['name'],
      include: {
        model: Topics,
        as: 'topics',
        attributes: ['id', 'name']
      }
    })

    res.send(results);
  } catch (error) {
    next(error);
  }
}

const getThreadsTopic = async (req, res, next) => {
  try {
    const  {
      topicID
    } = req.query;

    const topic = await Topics.findOne({
      attributes: ['name'],
      where: {
        id: topicID
      }
    })

    const threads = await Threads.findAll({
      attributes: [['name', 'title'], 'content'],
      include: {
        model: Profiles,
        as: 'profile',
        attributes: ['id', ['profileName', 'name'], 'avatar']
      },
      where: {
        topicID: topicID
      }
    })

    res.send({
      topic: topic,
      threads: threads
    });

  } catch (error) {
    next(error);
  }
}

module.exports = {
  getCategories,
  getTopics,
  getTopicsCategories,
  getThreadsTopic
}