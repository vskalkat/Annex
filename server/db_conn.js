const Sequelize = require('sequelize');
const db_config = require('./db_config.json');

/* create or change db_config.json */
/* To find server run --> select user(); */
/* To find mysql port run --> SHOW VARIABLES WHERE Variable_name = 'port'; */

const sql_conn = new Sequelize(
  db_config.databaseName,
  db_config.userName,
  db_config.password,
  {
    host: db_config.server,
    port: db_config.port,
    dialect: 'mysql',
    // dialectOptions: {
    //   ssl: true
    // },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
    operatorsAliases: false
});

sql_conn
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const Profile = sql_conn.define('profile', {
  user_id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  email: Sequelize.STRING,
  name: Sequelize.STRING,
  program: Sequelize.STRING,
  description: Sequelize.STRING,
  created_at: Sequelize.DATE,
  deleted_at: Sequelize.DATE,
  last_login: Sequelize.DATE,
  hash: Sequelize.STRING,
  salt: Sequelize.STRING,
  role: Sequelize.INTEGER,
  fb_token: Sequelize.STRING
}, {
  timestamps: false
});

const Project = sql_conn.define('project', {
  project_id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  title: Sequelize.STRING,
  description: Sequelize.STRING,
  created_by: Sequelize.INTEGER,
  created_at: Sequelize.DATE,
  deleted_at: Sequelize.DATE,
  last_edit: Sequelize.DATE
}, {
  timestamps: false
});

module.exports = {
  sql_conn, Profile, Project
};
