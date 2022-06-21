module.exports = (sequelize, DataTypes) => 
  sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      unique: true,
    },   
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    hashedPassword: {
      type: DataTypes.STRING,
      allowNull: false
    }
  })