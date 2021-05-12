var express = require('express');
const cors = require('cors');

var app = express();

app.use(cors());

app.post('/hello', function (req, res) {
  console.log(req.body);
  res.send({ name: 'Hello World!'});
});

app.listen(5000, function () {
  console.log('Example app listening on port 5000!');
});