var Web3 = require('web3');
var express = require('express');
var http = require('http');
var EthJsUtil = require('ethereumjs-util');
var RPC = require('./libs/rpc')
var Socket = require('./libs/socket');

var rpcUrl = 'http://localhost:8545'
var wsUrl = 'ws://localhost:8546'
var rpc = new RPC(rpcUrl);


// rpc.getBlockByNumber(1, (err, rs)=>{
//     console.log(err);
//     console.log(rs);
// })

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
                        console.log(rs);
                    }
                    res.json({ 'data': tx });
                })
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
app.get('/addr/erc20', (req, res) => {
    var addr = req.query.a;
    var contractAddr = req.query.c;
    console.log('request erc20 ', addr, contractAddr);
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


var server = http.createServer(app);
var socket = new Socket(wsUrl, server);
socket.start();
server.listen(3000);