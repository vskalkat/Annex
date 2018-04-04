var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// var index = require('./routes/index');
// var users = require('./routes/users');

var app = express();

var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

var app = express();

var bcrypt = require('bcrypt');
var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'pass',
  database : 'my_db',
  port     : '3306'
});

createSchema(connection);

app.use(bodyParser.json());

app.use(express.static("public"));

app.get('/', (req, res) => { //anonymous function
  console.log("GET request received for root");
  // file:///Users/saifkhan/Documents/3B%20Notes/SYDE322/Annex/public/findProjectsView.html
  res.sendfile(__dirname + '/public/loginView.html');
})

app.get('/findProjects', (req, res) => { //anonymous function
  console.log("Loading Projects");
  res.sendFile(__dirname + '/public/findProjectsView.html');
})

const saltRounds = 10;

function addUser(user, connection, cb) {
    var sql = "INSERT INTO users (email, password, fav_teacher) VALUES ('"+
    user.email + "', '" + user.password + "', '" + user.fav_teacher + "');";
    connection.query(sql, function (err, result) {
      console.log(
        "Banchot added " + result + " result : " + sql + " with err " + err);
      cb(result);
    });
}

function retrieveUser(email, connection, listener) {
    var sql = "SELECT * FROM users WHERE email = '" + email + "'";
    connection.query(sql, function (err, result) {

      if(err) {
        listener(false);
        console.log("errored out " + err);
        return;
      } else {
         listener(result);
         console.log("User successfully retreived " + result + " with err " +
          err + " where query was " + sql);
      }
    });
}

function createDefaultUsers(connection) {
    var sql =
    "INSERT INTO users (email, password) VALUES ('banchot@hotmail.com', 'password', 'igor');";
    connection.query(sql, function (err, result) {
      console.log("Banchot added " + result);
    });
}

function createSchema(con) {

      con.query("CREATE DATABASE IF NOT EXISTS my_db", function (err, result) {
        if (err) throw err;
        console.log("Database created");
      });

      var sql = fs.readFileSync('create_users.sql').toString();
      con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Users created");
      });

      sql = fs.readFileSync('create_projects.sql').toString();
      con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Projects created");
      });

      sql = fs.readFileSync('create_interests.sql').toString();
      con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Interests created");
      });
}

app.post('/login', function (req, res) {
  var email = req.body.userCredentials.username;
  var password = req.body.userCredentials.password;

  retrieveUser(email, connection, function(result) {
      if(result && result.length > 0) {
          user = result[0];
          console.log(user);

          bcrypt.compare(password, user.password, function(err, response) {
              if(response) {
                console.log('user', user);
                const token = jwt.sign({ user : user.user_id }, 'my_secret_key',
                  {expiresIn: '60000'});
                var contentToSend = {
                  "token" : token
                };

                res.send(JSON.stringify(contentToSend));
                console.log("login succeeded");
              } else {
                var contentToSend = {
                  "message" : "login failed, wrong password" };
                res.send(JSON.stringify(contentToSend));
              }

          });
      }
      else {
          var contentToSend = {"message" : "login failed, no user."};
          res.send(JSON.stringify(contentToSend));
      }
  });

});

//do stuff that requires authentication privlidges here
app.get('/protected', ensureToken, function(req, res){
  var tokenVerified = false;
  jwt.verify(req.headers["authorization"], 'my_secret_key',
    function(err, data){
      if(err){
        console.log("Error in token verification:" + err);
        tokenVerified = false;
        res.sendStatus(403);
      } else {
        console.log('token verification: SUCCESS.');
        console.log(data);
        tokenVerified = true;
        res.json({
          tokenVerified : tokenVerified,
          user : data.user
        });
      }
  })
})

function ensureToken(req, res, next){
  console.log("ensuring token...");
  const bearerHeader = req.headers["authorization"];
  if(typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
}

app.post('/signUp', function (req, res) {
  var email = req.body.userCredentials.email;
  var password = req.body.userCredentials.password;
  var fav_teacher = req.body.userCredentials.fav_teacher;

  var user = {
    email: email,
    password: password,
    fav_teacher: fav_teacher
  };

  if (isValidEmail(email)){
    const token = jwt.sign({}, 'my_secret_key', {expiresIn: '60000'});
    var contentToSend = {
      "token" : token
    };
    // res.send(JSON.stringify(contentToSend)); // this is a 200
    console.log("SignUp POST request hit! 1 success ");

    //add new user to database
    bcrypt.genSalt(saltRounds, function(err, salt) {
      bcrypt.hash(password, salt, function(err, hash) {

          bcrypt.hash(fav_teacher, salt, function(err, fav_enc) {
            user.password = hash;
            user.fav_teacher = fav_enc;
            addUser(user, connection, (data) => {
              console.log('sending data!', data);
              res.send(data);
            });
          });
      });
    });

  } else {
    console.log('not valid email');
    res.sendStatus(403);
  }
})

app.get('/currentUser', (req, res) => {

});

app.get('/projects', function (req, res, listener) {

    var sql = "SELECT * FROM projects";
    connection.query(sql, function (err, result) {
      if(err) {
        listener(false);
        console.log("errored out " + err);
        return;
      } else {
         res.send(result);
         console.log("Expression retrieved " + result + " with err " +
          err + " where query was " + sql);
      }
    });
})

app.get('/project/:projectId', function (req, res, listener) {

    var sql = "SELECT * FROM projects WHERE project_id = " +
      req.params.projectId;
    connection.query(sql, function (err, result) {
      if(err) {
        listener(false);
        console.log("errored out " + err);
        return;
      } else {
         console.log('result', result[0])
         res.send(result[0]);
         console.log("Projects retrieved " + result + " with err " +
         err + " where query was " + sql);
      }
    });
});

app.get('/projects/user/:userId', function (req, res, listener) {

    var sql = "SELECT * FROM projects WHERE user_id = " +
      req.params.userId;
    connection.query(sql, function (err, results) {
      if(err) {
        listener(false);
        console.log("errored out " + err);
        return;
      } else {
         console.log('result', results)
         res.send(results);
         console.log("Projects retrieved " + results + " with err " +
         err + " where query was " + sql);
      }
    });
})

app.post('/project', function (req, res) {
    var user = req.body.userId;
    var projectName = req.body.project.projectName;
    var projectDescription = req.body.project.projectDescription;
    var programSelect = req.body.project.programSelect;
    var softwareSkill = req.body.project.softwareSkill;
    var firmwareSkills = req.body.firmwareSkills;
    var mechanicalSkills = req.body.mechanicalSkills;
    var electricalSkills = req.body.electricalSkills;
    var dataSkills = req.body.dataSkills;
    var designSkills = req.body.designSkills;

    var sql = "INSERT INTO projects (title, description, user_id) VALUES ('" +
    projectName + "', '" + projectDescription + "', " + user + ");";
    console.log("Request made:  " + sql);

    connection.query(sql, function (err, result) {
      console.log("Project added " + result + " with err " + err);
      console.log('result', result);
      res.send(result);
    });
})

app.get('/projects/delete/:projectId', function (req, res, listener) {

    var sql = "DELETE * FROM projects WHERE project_id = " +
      req.params.projectId;
    connection.query(sql, function (err, result) {
      if(err) {
        listener(false);
        console.log("errored out " + err);
        return;
      } else {
         res.send(result);
         console.log("Expression deleted " + result + " with err " +
          err + " where query was " + sql);
      }
    });
})

app.get('/search/project/:query', function (req, res, listener) {
    var sql = "SELECT * FROM projects WHERE description LIKE '%" +
      req.params.query + "%' or title LIKE '%" + req.params.query + "%';";
    connection.query(sql, function (err, results) {
      if(err) {
        listener(false);
        console.log("errored out " + err);
        return;
      } else {
         console.log(results);
         res.send(results);
         console.log("Search retreived " + results + " with err " +
         err + " where query was " + sql);
      }
    });
})

app.get('/search/user/:query', function (req, res, listener) {
    var sql = "SELECT * FROM users WHERE name LIKE '%" +
      req.params.query + "%' or email LIKE '%" +
      req.params.query + "%' or description LIKE '%" +
      req.params.query + "%';";
    connection.query(sql, function (err, results) {
      if(err) {
        listener(false);
        console.log("errored out " + err);
        return;
      } else {
         console.log(results);
         res.send(results);
         console.log("Search retreived " + results + " with err " +
         err + " where query was " + sql);
      }
    });
})

function isValidEmail(email){
  return (email && email.length > 0);
}

var server = app.listen(8042, function(){
  var port = server.address().port;
  console.log('Node.js server running at localhost:%s', port)
})

function validateCredentials(user, password){

  if(!user) return false;

  bcrypt.compare(password, user.password, function(err, res) {
      return res
  });
}

module.export = app;
