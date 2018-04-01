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
  insert into users(user_id, name, email, password)
  values(1, 'admin', 'shenchenlei@gmail.com', 'abc');

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
    `DELETE FROM users
     WHERE email = 'shenchenlei@gmail.com';
     DELETE FROM projects
     WHERE title = 'project1' or title = 'project2' or title = 'project3';`);
});

test('test get /projects', (done) => {
  request.get("http://localhost:8042/projects",
  { json: true }, (err, res, body) => {
    console.log('body', body);
    if (err) { return console.log(err); }
    expect(body.length).toEqual(3);
    done(err);
  });
});

test('test get /project/:projectId', () => {
  expect.assertions(1);
  return new Promise((resolve, reject) => {
    request.get("http://localhost:8042/project/2",
      { json: true }, (err, res, body) => {
        if (err) { console.log(err); }
        console.log('body', res.body);
        resolve(body);
      });
  }).then((body) => {
      expect(body.project_id).toEqual(2);
  });
});

test('test post /project', (done) => {
  request.post({
    url: "http://localhost:8042/project",
    body:  {
      project: {
          projectName : 'project4',
          projectDescription : 'test project 4'
        },
        userId : 1,
      },
    json:  true
  }, (err, res, body) => {
    if (err) { return console.log(err); }
    console.log(body);
    expect(body.affectedRows).toEqual(1);
    connection.query("DELETE FROM projects WHERE title = 'project4'",
      function (err, result) {
        if(err) {
          console.log("errored out " + err);
          done(err);
        } else {
          done(err);
        }
      });
  });
});
