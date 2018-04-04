const request = require('request');
const mysql = require('mysql');
const server = {
  address: 'localhost',
  port: '8042'
}
const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'my_db',
  port     : '5432',
  multipleStatements: true
});

beforeAll((done) => {
  let query = `
  insert into projects(project_id, title, description, user_id)
  values(1, 'project1', 'test project 1', 1);

  insert into projects(project_id, title, description, user_id)
  values(2, 'project2', 'test project 2', 1);

  insert into projects(project_id, title, description, user_id)
  values(3, 'project3', 'test project 3', 1);`;

  connection.query(query, (err, result) => {
    console.log('err', err);
    done(err);
  });
});

afterAll((done) => {
  connection.query(
    `DELETE FROM projects
     WHERE title = 'project1' or title = 'project2' or title = 'project3';`);
});

test('test GET /search/project/:query', (done) => {
  request.get({
    url: "http://localhost:8042/search/project/project",
    json:  true
  }, (err, res, body) => {
    if (err) { return console.log(err); }
    console.log(body);
    expect(body.length).toEqual(3);
    done(err);
  });
});
