var socketio = require('socket.io');

function newClient(ws, socket) {
	console.log('a user connected');

	ws.to(socket.id).emit('hey');
};


var io = function(server) {
	var ws = socketio(server);

	ws.on('connection', function(socket) {
		newClient(ws, socket);
	});
};

module.exports = io;