let app = require('./app.js');

const server = app.listen((process.env.PORT || 3000), () => {
  const port = server.address().port;
  console.log('Node.js server running at localhost:', port);
});
