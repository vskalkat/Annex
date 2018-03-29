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
  password : 'pakistan',
  database : 'my_db'
});

createSchema(connection);

app.use(bodyParser.json());

app.use("", express.static(__dirname + ""));

app.get('/ ', (req, res) => { //anonymous function
  console.log("GET request received for root");
  res.sendFile(__dirname + '../public/loginView.html');
})

app.get('/calculator', (req, res) => { //anonymous function
  console.log("GET request received for calculator page");
  res.sendFile(__dirname + '../public/calculator.html');
})

const saltRounds = 10;

function addUser(user, connection) {
    var sql = "INSERT INTO users (email, password, is_premium, fav_teacher) VALUES ('"+ user.email + "', '" + user.password + "', " + user.is_premium + ", '" + user.fav_teacher + "');";
    connection.query(sql, function (err, result) {
      console.log("Banchot added " + result + " result : " + sql + " with err " + err);
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
         console.log("User successfully retreived " + result + " with err " + err + " where query was " + sql);
      }


    });
}

function createDefaultUsers(connection) {
    var sql = "INSERT INTO users (email, password, is_premium) VALUES ('banchot@hotmail.com', 'password', true, 'igor');";
    connection.query(sql, function (err, result) {
      console.log("Banchot added " + result);
    });
}

function createSchema(con) {
      con.query("CREATE DATABASE IF NOT EXISTS my_db", function (err, result) {
        if (err) throw err;
        console.log("Database created");
      });

      var sql = "CREATE TABLE IF NOT EXISTS users (email VARCHAR(255) PRIMARY KEY, password VARCHAR(255), is_premium BOOLEAN, fav_teacher VARCHAR(255))";
      con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("User Table created");
      });

      sql = "CREATE TABLE IF NOT EXISTS expressions (id INT PRIMARY KEY AUTO_INCREMENT, user_email VARCHAR(255), input_exp VARCHAR(255) UNIQUE, simplified_exp VARCHAR(255), steps VARCHAR(255))";
      con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Expression Table created");
      });

      sql = "CREATE TABLE IF NOT EXISTS projects (id INT PRIMARY KEY AUTO_INCREMENT, creator_email VARCHAR(255), title VARCHAR(255), description VARCHAR(255))";
      con.query(sql, function (err, result) { 
        if (err) throw err;
        console.log("Projects Table created");
      });

      createDefaultUsers(con);
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
                const token = jwt.sign({}, 'my_secret_key', {expiresIn: '60000'});
                var contentToSend = {
                  "token" : token
                };

                res.send(JSON.stringify(contentToSend));
                console.log("login succeeded");
              } else {
                var contentToSend = {"message" : "login failed, wrong password"};
                res.send(JSON.stringify(contentToSend));
              }

          });
      }
      else {
          var contentToSend = {"message" : "login failed, no user."};
          res.send(JSON.stringify(contentToSend));
      }
  });

})

//do stuff that requires authentication privlidges here
app.get('/protected', ensureToken, function(req, res){
  var tokenVerified = false;
  jwt.verify(req.headers["authorization"], 'my_secret_key', function(err, data){
    if(err){
      console.log("Error in token verification:" + err);
      tokenVerified = false;
      res.sendStatus(403);
    } else {
      console.log('token verification: SUCCESS.');
      tokenVerified = true;
      res.json({
        tokenVerified : tokenVerified
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
  var isPremiumRegistration = req.body.userCredentials.isPremiumRegistration;
  var fav_teacher = req.body.userCredentials.fav_teacher;

  var user = {
    email: email,
    password: password,
    is_premium: isPremiumRegistration,
    fav_teacher: fav_teacher
  };

  if (isValidEmail(email)){
    const token = jwt.sign({}, 'my_secret_key', {expiresIn: '60000'});
    var contentToSend = {
      "token" : token
    };
    res.send(JSON.stringify(contentToSend)); // this is a 200
    console.log("SignUp POST request hit! 1 success ");

    //add new user to database
    bcrypt.genSalt(saltRounds, function(err, salt) {
      bcrypt.hash(password, salt, function(err, hash) {

          bcrypt.hash(fav_teacher, salt, function(err, fav_enc) {
            user.password = hash;
            user.fav_teacher = fav_enc;
            addUser(user, connection);
          });
      });
    });

  } else {
    res.sendStatus(403);
  }

})

app.get('/projects', function (req, res) {

    var sql = "SELECT * FROM projects";
    connection.query(sql, function (err, result) {
      if(err) {
        listener(false);
        console.log("errored out " + err);
        return;
      } else {
         res.send(result);
         console.log("Expression retrieved " + result + " with err " + err + " where query was " + sql);
      }
    });
})

app.get('/project/:projectId', function (req, res) {
   
    var sql = "SELECT * FROM projects WHERE id = " + req.params.projectId;
    connection.query(sql, function (err, result) {
      if(err) {
        listener(false);
        console.log("errored out " + err);
        return;
      } else {
         res.send(result[0]);
         console.log("Projects retrieved " + result + " with err " + err + " where query was " + sql);
      }
    });
})

app.post('/project', function (req, res) {
    var title = req.body.title;
    var description = req.body.description;
    var email = req.body.email;

    var sql = "INSERT INTO projects (creator_email, title, description) VALUES ('" + email + "', '" + title + "','" + description + "'');";
    connection.query(sql, function (err, result) {
      console.log("Project added " + result + " with err " + err);
    });
})


app.get('search/project/:query', function (req, res) {
   
    var sql = "SELECT * FROM projects WHERE CONTAINS(description," + req.params.query + ")";
    connection.query(sql, function (err, result) {
      if(err) {
        listener(false);
        console.log("errored out " + err);
        return;
      } else {
         res.send(result[0]);
         console.log("Search retreived " + result + " with err " + err + " where query was " + sql);
      }
    });
})

function isValidEmail(email){
  return (email && email.length > 0);
}

var server = app.listen(8042, function(){
  var port = server.address().port
  console.log('Node.js server running at localhost:%s', port)
})

function validateCredentials(user, password){

  if(!user) return false;

  bcrypt.compare(password, user.password, function(err, res) {
      return res
  });
}