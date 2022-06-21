const express= require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const {sequelize} = require('./models');
const config = require('./configs');
const routes = require('./routes');
const error = require('./middlewares/error.midddleware')

const app = express();

app.use(morgan('tiny'));
app.use(cors());
app.use(bodyParser.json());

routes(app)

app.use(error.logErrorMiddleware);
app.use(error.returnErrorMiddleWare);

process.on('uncaughtException', err => {
 
  if (!error.isOperationalError(err)) {
    process.exit(1)
  }
 })

sequelize.sync()
  .then(() => {
    app.listen(config.port, () => {
      console.log(`listening on ${config.port}`);
    })
  })