const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const port = 8888;

app.use(bodyParser.urlencoded({ extended: true }));

require('./app/routes')(app, {});
app.listen(port, () => {
  console.log('Port: ' + port);
});
