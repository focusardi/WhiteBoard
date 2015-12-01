var app = require('express')();

var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
var totalUser = 0;
var isRootOnline = false;
var isImRoot = false;
var mainCanvas = null;

io.on('connection', function(socket){

	console.log('a user connected');
	//讀取現有畫布
  
	socket.on('disconnect', function(){
	console.log('user disconnected');
	totalUser--;
	});
	

	socket.on('chat message', function(msg){
	io.emit('chat message', msg);
	console.log(msg);
	
	
	});
  
	//接受畫布作業訊息 
	socket.on('draw', function(data){ 
	
			//統一畫布資訊
			
			
	        //將畫布作業訊息傳給其他線上的人 
	        socket.broadcast.emit('show', data); 
	});
	
	socket.on('saveImg', function(data){ 	
		//儲存畫布資訊		
		var imgData = data.replace(/^data:image\/\w+;base64,/, "");
		var buf = new Buffer(imgData, 'base64');
		fs.writeFile('image.png', buf);
	});
	
});

http.listen(3000, function(){
	console.log('listening on *:3000');
  
});

