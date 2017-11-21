var url = require('url');
var fs = require('fs');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = 80;
var bodyParser = require('body-parser');
// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

var current = 0;
var total = 10;
var vote0 = 0;
var vote1 = 0;


app.get('/admin', function(req, res){
  res.sendfile('admin.html');
});

app.get('/dashboard', function(req, res){
  res.sendfile('dashboard.html');
});

app.get('/', function(req, res){
  res.sendfile('client.html');
});
app.get('/add', function(req, res){
  current++;
  io.emit("stream", {current, total, vote0, vote1});
  res.send('ok');
});

app.get('/total', function(req, res){
  res.send(total);
});

app.post('/total', urlencodedParser, function (req, res) {
  total = req.body.total;
  io.emit("stream", {current, total, vote0, vote1});
  res.end("ok");
})

app.post('/reset', urlencodedParser, function (req, res) {
  current = vote0 = vote1 = 0;
  io.emit("stream", {current, total, vote0, vote1});
  res.end("ok");
})

app.post('/vote', urlencodedParser, function (req, res) {
  var val = req.body.val;
  if(val == 0){
    vote0++;
  } else{
    vote1++;
  }
  current++;
  io.emit("stream", {current, total, vote0, vote1});
  res.end("ok");
})


// define interactions with client
io.sockets.on('connection', function(socket){
  //send data to client
//  setInterval(function(){
    socket.emit('stream', {current, total, vote0, vote1});
//  }, 1000);

});

http.listen(port, function(){
  console.log("Running on port " + port)
});