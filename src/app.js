require('dotenv').config({path: __dirname + '/.env'});
const express= require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const session = require('express-session');
const sessionStore = require('connect-session-sequelize')(session.Store)
const config = require('./config');
const {sequelize} = require('./models');
const routes = require('./routes');
const error = require('./middlewares/error.midddleware')
const { parseCookies } = require('./middlewares/utility.middleware');

const app = express();

app.use(morgan('tiny'));
app.use(cors(
  {
    origin: 'http://localhost:8080',
    credentials: true
  }
));
app.use(bodyParser.json());
app.use(parseCookies);

app.use(
  session({
    name: config.sessName,
    secret: config.sessSecret,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      maxAge: config.sessExp,
      sameSite: 'strict',
      secure: config.env === 'production'
    },
    store: new sessionStore({
      db: sequelize,
      checkExpirationInterval: config.sessClean,
      expiration: config.sessExp,
    })
  })
);

routes(app)

app.use(error.logErrorMiddleware);
app.use(error.returnErrorMiddleWare);

process.on('uncaughtException', err => {

  error.logError(err);
 
  if (!error.isOperationalError(err)) {
    process.exit(1)
  }
 })

 sequelize.authenticate()
  .then(() => {
    console.log('database connected')
    app.listen(config.port, () => {
      console.log(`listening on ${config.port}`);
    })
  })
  .catch(() => {
    error.logError('error connecting to database');
  })
