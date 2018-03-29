let db = require('../db_conn.js');
const LIMIT = 10;

let getProjects = (req, res, next) => {
  db.Project.findAll({ limit: LIMIT }).then(users => {
    res.send(users);
  });
}

module.exports = {
  getProjects
};
