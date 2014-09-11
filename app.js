/**
 * Created by bimathew on 9/3/14.
 */
var express = require('express'),
    http = require('http'),
    request = require('request'),
    app = express(),
    server = http.createServer(app),
    io = require('socket.io').listen(server),
    LISTEN_PORT = 4500,
    BASE_STOCK_URL = 'https://finance.google.com/finance/info?client=ig&q=',
    STOCK_LIST = 'EBAY,GOOG,APPL,TSLA';

app.use(express.static(__dirname + '/.'));
server.listen(LISTEN_PORT)

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/views/index.html');
});
function pushStockData(socket) {
    var requestUrl = BASE_STOCK_URL + STOCK_LIST;
    request.get(requestUrl, function (error, response, body) {
        if (error) {
            return false;
        }
        socket.emit("loadStock", body);
    });
}
io.sockets.on('connection', function (socket) {
    pushStockData(socket);
    var timer = setInterval(function () {
        pushStockData(socket)
    }, 3000);
    socket.on('disconnect', function () {
        clearInterval(timer);
    });

});

module.exports = app;
