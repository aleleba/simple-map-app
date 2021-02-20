require('dotenv').config();

const config = {
  authJwtSecret: process.env.AUTH_JWT_SECRET,
  enviromentType: process.env.WHITELIST_URLS ? process.env.WHITELIST_URLS.split(",") : [
    'https://cdmsalud.com', 
    'https://www.cdmsalud.com',
    'capacitor://cdmsalud.com'
  ],
  reduxServer: process.env.REDUX_SERVER === 'true' ? true : false,
  port: process.env.PORT || 4000,
  mongoDBConfig: {
    host : process.env.HOST_MONGO,
    port : process.env.PORT_MONGO,
    db : process.env.DB_MONGO,
    user: encodeURIComponent(process.env.USER_MONGO),
    password: encodeURIComponent(process.env.PASSWORD_MONGO)
  },
  mariaDBConfig: {
    host: process.env.HOST_MARIADB,
    port: process.env.PORT_MARIADB,
    user: process.env.USER_MARIADB,
    password: process.env.PASSWORD_MARIADB,
    db_user: process.env.DBUSER_MARIADB
  },
  mailConfig: {
    host: process.env.HOST_MAIL,
    user: process.env.USER_MAIL,
    password: process.env.PASSWORD_MAIL
  }
};

module.exports = { config: config };