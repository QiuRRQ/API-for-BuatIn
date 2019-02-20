const express = require('express')
function routes(app){
  app.use(express.static(__dirname + '/public'));
  app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
  });
}

module.exports = routes
