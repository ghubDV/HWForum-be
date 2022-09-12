const BadRequestError = require('../helpers/error/badRequestError');
const { getPagesAndOffset } = require('../helpers/pagination/pagination.helper');
const { Categories, Profiles, Topics, Threads, sequelize } = require('../models');

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
      topicID,
      pageSize,
      page
    } = req.body;

    const count = await Threads.findOne({
      attributes:[[sequelize.fn('COUNT', sequelize.col('id')), 'threads']],
      where: {
        topicID: topicID
      }
    })

    const pagination = getPagesAndOffset(count.dataValues.threads, pageSize, page);

    const topicAndThreads = await Topics.findOne({
      attributes: ['id', ['name', 'topic']],
      include: {
        model: Threads,
        as: 'threads',
        attributes: ['id', ['name', 'title'], 'content', 'replies', 'updatedAt'],
        subQuery: true,
        limit: pageSize,
        offset: pagination.offset,
        include: {
          model: Profiles,
          as: 'profile',
          attributes: ['id', ['profileName', 'name'], 'avatar']
        },
        order: [
          ['updatedAt', 'desc']
        ]
      },
      where: {
        id: topicID
      }
    })

    res.send({ ...topicAndThreads.dataValues, pageCount: pagination.pages });

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