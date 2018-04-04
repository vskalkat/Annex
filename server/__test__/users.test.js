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
  let query = `insert into users(name, email, password)
  values('abc', 'abc', '$2a$10$zxgp2ohSKh0gV9Wjr0UfvOi3mRnC0/IVB08pn4zBQiUMNtgxPXB.C');`;

  connection.query(query, (err, result) => {
    console.log('err', err);
    done(err);
  });
});

afterAll((done) => {
  connection.query(`DELETE FROM users WHERE email = 'shenchenlei@gmail.com';`);
});

test('test post /signup', (done) => {
  request.post({
    url: "http://localhost:8042/signup",
    body:  {
      userCredentials: {
          email : 'test',
          password : 'test',
          fav_teacher : 'igor'
        }
      },
    json:  true
  }, (err, res, body) => {
    if (err) { return console.log(err); }
    console.log(body);
    expect(body.affectedRows).toEqual(1);
    connection.query("DELETE FROM users WHERE email = 'test'",
      function (err, result) {
        if(err) {
          console.log("errored out " + err);
          done(err);
        } else {
          console.log("test user deleted");
          done(err);
        }
      });
  });
});

test('test post /login', (done) => {
  request.post({
    url: "http://localhost:8042/login",
    body:  {
      userCredentials: {
          username : 'abc',
          password : 'abc'
        }
      },
    json:  true
  }, (err, res, body) => {
    if (err) { return console.log(err); }
    console.log(body);
    expect.anything(body.token);
    done(err);
  });
});
