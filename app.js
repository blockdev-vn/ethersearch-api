var Web3 = require('web3');
var express = require('express');
var http = require('http');
var EthJsUtil = require('ethereumjs-util');
var RPC = require('./libs/rpc')
var Socket = require('./libs/socket');




function createApp(rpcUrl) {
    // var rpcPort = process.env.RCP_PORT || 8545;
    // var wsPort = process.env.WS_PORT || (rpcPort*1 + 1)
    // var rpcUrl = 'http://localhost:' + rpcPort;
    // var wsUrl = 'ws://localhost:'  + wsPort;
    var rpc = new RPC(rpcUrl);
    console.log(rpcUrl);
    var app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    
    app.get('/tx', (req, res) => {
        if (req.query.hash) {
            var hash = req.query.hash;
            rpc.getTransaction(hash, (err, tx) => {
                if (err || !tx) {
                    return res.json({ 'e': 'Not found' });
                } else {
                    if(tx.blockTime) {
                        tx.blockTime = parseInt(tx.blockTime, 16)
                    }
                    rpc.getTransactionReceipt(hash, (err, rs) => {
                        if (rs) {
                            tx.gasUsed = rs.gasUsed;
                            tx.logs = rs.logs;
                            tx.status = rs.status;
                            // console.log(rs);
                        }
                        res.json({ 'data': tx });
                    })
                }
            })
        } else {
            res.json({ 'e': 'Invalid url' });
        }
    })
    
    app.get('/tx/pool', (req, res) => {
        if (req.query.limit) {
            var number = parseInt(req.query.limit);
            if (isNaN(number)) {
                return res.json({ 'e': 'Limit must be number' })
            }
            rpc.getPoolTransactionsLimit(number, (err, rs) => {
                // console.log(err, rs);
                if (err || !rs) {
                    return res.json({ 'e': 'Not found' });
                } else {
                    res.json({ 'data': rs });
                }
            })
        } else {
            res.json({ 'e': 'Invalid url' });
        }
    })
    app.get('/block', (req, res) => {
        if (req.query.number) {
            var number = req.query.number;
            if (isNaN(parseInt(number))) {
                return res.json({ 'e': 'Block number must be number' })
            }
            rpc.getBlockByNumber(number, (err, rs) => {
                if (err || !rs) {
                    console.log(err);
                    return res.json({ 'e': 'Not found' });
                } else {
                    res.json({ 'data': rs });
                }
            })
        } else {
            res.json({ 'e': 'Invalid url' });
        }
    })
    app.get('/latestnumber', (req, res) => {
        rpc.getLatestNumber((err, rs) => {
            if (err || !rs) {
                return res.json({ 'e': 'Not found' });
            } else {
                res.json({ 'data': rs });
            }
        })
    })
    // Address summary
    app.get('/addr', (req, res) => {
        if (req.query.a) {
            var addr = req.query.a;
            if (EthJsUtil.isValidAddress(addr)) {
                rpc.getAddress(addr, 0, 20, (err, rs) => {
                    if (err || !rs) {
                        return res.json({ 'e': 'Not found' });
                    } else {
                        res.json({ 'data': rs });
                    }
                })
            } else {
                res.json({ 'e': 'Invalid address' });
            }
        } else {
            res.json({ 'e': 'Invalid url' });
        }
    })
    app.get('/addr/txs', (req, res) => {
        var addr = req.query.a;
        // console.log('request history ', addr);
        if (!EthJsUtil.isValidAddress(addr)) {
            return res.json({ 'e': 'Invalid address' });
        }
    
        rpc.getAddressHistory(addr, 0, 20, (err, rs) => {
            if (err || !rs) {
                return res.json({ 'e': 'Not found' });
            } else {
                res.json({ 'data': rs });
            }
        })
    })
    app.get('/addr/erc20/txs', (req, res) => {
        var addr = req.query.a;
        var contractAddr = req.query.c;
        if (!EthJsUtil.isValidAddress(addr) || !EthJsUtil.isValidAddress(contractAddr)) {
            return res.json({ 'e': 'Invalid address' });
        }
    
        rpc.getERC20History(addr, contractAddr, 0, 20, (err, rs) => {
            if (err || !rs) {
                return res.json({ 'e': 'Not found' });
            } else {
                res.json(rs);
            }
        })
    })
    app.get('/addr/erc20/balance', (req, res) => {
        var addr = req.query.a;
        var contractAddr = req.query.c;
        if (!EthJsUtil.isValidAddress(addr) || !EthJsUtil.isValidAddress(contractAddr)) {
            return res.json({ 'e': 'Invalid address' });
        }
    
        rpc.getERC20Balance(addr, contractAddr, (err, rs) => {
            if (err || !rs) {
                return res.json({ 'e': 'Not found' });
            } else {
                res.json(rs);
            }
        })
    })
    app.get('/addr/nonce', (req, res) => {
        var addr = req.query.a;
        var block = req.query.block;
        if (!EthJsUtil.isValidAddress(addr)) {
            return res.json({ 'e': 'Invalid address' });
        }
    
        rpc.getAddressNonce(addr, block, (err, rs) => {
            if (err) {
                return res.json({ 'e': 'Not found' });
            } else {
                res.json(rs);
            }
        })
    })
    app.get('/addr/balance', (req, res) => {
        var addr = req.query.a;
        var block = req.query.block;
        if (!EthJsUtil.isValidAddress(addr)) {
            return res.json({ 'e': 'Invalid address' });
        }
    
        rpc.getAddressBalance(addr, block, (err, rs) => {
            if (err) {
                return res.json({ 'e': 'Not found' });
            } else {
                res.json(rs);
            }
        })
    })
    return app;
}
// var server = http.createServer(app);
// var socket = new Socket(wsUrl, server);
// socket.start();
// server.listen(3000);

class App {
    constructor(rpcUrl, wsUrl, port) {
        this.port = port;
        this.app = createApp(rpcUrl);
        this.server = http.createServer(this.app);
        this.socket = new Socket(wsUrl, this.server);
    }
    start() {
        this.socket.start()
        this.server.listen(this.port);
    }
}

module.exports = App