var http = require('http');

var server = http.createServer( function( req, res){

});

server.listen(8080, '127.0.0.1')
console.log('listening to port 8080');