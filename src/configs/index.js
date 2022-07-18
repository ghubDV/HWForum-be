module.exports = {
  db: {
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    options: {
      dialect: process.env.DIALECT,
      host: process.env.HOST,
      storage: process.env.DB_STORAGE
    }
  },
  env: process.env.MODE,
  port: process.env.PORT,
  sessClean: 1000 * 60 * 15,
  sessExp: 1000 * 60 * 5,
  sessName: process.env.SESSION_NAME,
  sessSecret: process.env.SESSION_SECRET
}