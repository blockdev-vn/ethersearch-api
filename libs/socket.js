
var Web3 = require('web3');
var IO = require('socket.io');
var CONST = require('./const');
var Tx = require('ethereumjs-tx');

class Socket {
    constructor(url, server) {
        this.web3 = new Web3(new Web3.providers.WebsocketProvider(url));
        this.io = IO(server);
    }
    start() {
        this.handleConnection();
        this.watchWeb3Event()
    }
    handleConnection() {
        var self = this;
        this.io.sockets.on('connection', function (socket) {
            console.log('connect from ', socket.id);
            self.handleJoin(socket);
            self.handleLeave(socket);
        })
    }
    handleJoin(socket) {
        var self = this;
        socket.on(CONST.Join, (room) => {
            console.log('join ', room);
            socket.join(room);
            socket.emit(CONST.Join, room)
        })
    }

    handleLeave(socket) {
        socket.on(CONST.Leave, (room) => {
            socket.leave(room);
        })
    }
    watchWeb3Event() {
        this.watchNewBlockFromWeb3();
        this.watchNewTxFromWeb3();
    }
    watchNewBlockFromWeb3() {
        var self = this;
        this.web3.eth.subscribe('newBlockHeaders', function (err, rs) {
            if (rs) {
                console.log(rs.number, rs.hash);
                self.io.to(CONST.BlockNew).emit(CONST.BlockNew, rs)
            }
        })
    }
    watchNewTxFromWeb3() {
        var self = this;
        this.web3.eth.subscribe('pendingTransactions', function (err, rs) {
            if (rs) {
                self.io.to(CONST.TxNew).emit(CONST.TxNew, rs)
            }
        })
    }
}

module.exports = Socket