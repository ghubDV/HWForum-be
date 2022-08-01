'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profiles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Profiles.belongsTo(models.Users);
      models.Users.hasOne(Profiles);
    }
  }
  Profiles.init({
    userID: {
      type: DataTypes.INTEGER,
      unique: {
        args: true,
        msg:'This account already has a profile'
      }
    },
    profileName: {
      type: DataTypes.STRING,
      unique: {
        args: true,
        msg:'This profile name is taken!'
      }
    },
    isPublic: DataTypes.BOOLEAN,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Profiles',
  });
  return Profiles;
};