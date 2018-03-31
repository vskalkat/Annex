const request = require('request');
const server = {
  address: 'localhost',
  port: '8042'
}

var mysql = require('mysql');
let connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'annex',
  port     : '5432'
});

// it('test get /projects', () => {
//   request("http://localhost:8042/projects",
//   { json: true }, (err, res, body) => {
//     console.log(body);
//     if (err) { return console.log(err); }
//     expect(body.length).toEqual(3);
//   });
// });
//
// it('test get /project/:projectId', () => {
//   request.get("http://localhost:8042/project/1",
//   { json: true }, (err, res, body) => {
//     if (err) { return console.log(err); }
//     console.log(body);
//     expect(body.length).toEqual(1);
//   });
// });

it('test post /project', (done) => {
  // let data = '{ "data" {"key1":"what","key2":"what"} }';
  // let json_obj = JSON.parse(data);
  request.post({
    url: "http://localhost:8042/project",
    body:  { hello : 'hello' }
  }, { json: true }, (err, res, body) => {
    if (err) { return console.log(err); }
    connection.query("SELECT * FROM projects WHERE title = project4",
      function (err, result) {
        if(err) {
          console.log("errored out " + err);
          done(err);
        } else {
          console.log(result);
          expect(result.length).toEqual(1);
          done(err);
        }
      });
  });
});
