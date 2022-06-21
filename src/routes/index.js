const fs = require('fs');
const path = require('path');


module.exports = (app) => {
  fs
  .readdirSync(__dirname)
  .filter((file) => file !== 'index.js')
  .forEach((file) => {
    require(path.join(__dirname, file))(app);
  })
};