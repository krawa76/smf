const express = require('express');
const kittens = express.Router();

kittens.get('/', function (req, res) {
  res.json([
    {id: 1, name: 'Fluffy 1'},
    {id: 2, name: 'Fluffy 2'},
    {id: 3, name: 'Fluffy 3'},
  ]);
});

export default kittens;
