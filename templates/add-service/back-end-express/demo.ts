const express = require('express');
const demo = express.Router();

// default route
demo.get('/', function (req, res) {
  res.json({attr: 'value1'});
});

// sub route
demo.get('/sub', function (req, res) {
  res.json({attr: 'value2'});
});

export default demo;
