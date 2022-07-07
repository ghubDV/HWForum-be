require('dotenv').config({path: __dirname + '/.env'});
const express= require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const config = require('./configs');
const {sequelize} = require('./models');
const routes = require('./routes');
const error = require('./middlewares/error.midddleware')

const app = express();

app.use(morgan('tiny'));
app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true
}));
app.use(bodyParser.json());

routes(app)

app.use(error.logErrorMiddleware);
app.use(error.returnErrorMiddleWare);

process.on('uncaughtException', err => {

  error.logError(err);
 
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