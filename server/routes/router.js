let router = require('express').Router();
let index = require('./index.js');
let projects = require('./projects.js');

router.get('/', index);
router.get('/projects', projects.getProjects);

module.exports = router;
