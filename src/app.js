const express= require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const {sequelize} = require('./models');
const config = require('./configs');

const app = express();

app.use(morgan('tiny'));
app.use(cors());
app.use(bodyParser.json());

require('./routes')(app)

sequelize.sync()
  .then(() => {
    app.listen(config.port, () => {
      console.log(`listening on ${config.port}`);
    })
  })