module.exports = (sequelize, DataTypes) => 
  sequelize.define('Users', {
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
    },
    createdAt: DataTypes.DATE, 
    updatedAt: DataTypes.DATE
  })