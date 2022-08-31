'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Comments.belongsTo(models.Threads, {
        foreignKey: 'threadID',
        targetKey: 'id'
      });
      models.Threads.hasMany(Comments, { as: 'comments'});

      Comments.belongsTo(models.Profiles, {
        as: 'profile',
        foreignKey: 'profileName',
        targetKey: 'profileName'
      });
      models.Profiles.hasMany(Comments);
    }
  }
  Comments.init({
    threadID: DataTypes.INTEGER,
    profileName: DataTypes.STRING,
    content: DataTypes.TEXT,
    rating: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Comments',
  });
  return Comments;
};