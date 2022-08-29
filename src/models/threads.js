'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Threads extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Threads.belongsTo(models.Topics);
      models.Topics.hasMany(Threads);

      Threads.belongsTo(models.Profiles, {as: 'profile'});
      models.Profiles.hasMany(Threads);
    }
  }
  Threads.init({
    topicID: DataTypes.INTEGER,
    profileID: DataTypes.INTEGER,
    name: DataTypes.TEXT,
    content: DataTypes.TEXT,
    replies: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Threads',
  });
  return Threads;
};