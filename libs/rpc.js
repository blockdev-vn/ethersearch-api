var Web3 = require("web3");
var EthJsTx = require('ethereumjs-tx');

class RPC {
    constructor(url) {
        this.web3 = new Web3(new Web3.providers.HttpProvider(url));
        this.web3.extend({
            property: 'eth',
            methods: [{
                name: 'getHistory',
                call: 'eth_getHistory',
                params: 3,
            }]
        });
        this.web3.extend({
            property: 'eth',
            methods: [{
                name: 'getAccountSummary',
                call: 'eth_getAccountSummary',
                params: 2,
            }]
        });
        this.web3.extend({
            property: 'eth',
            methods: [{
                name: 'getERC20TokenHistory',
                call: 'eth_getERC20TokenHistory',
                params: 4,
            }]
        });
        this.web3.extend({
            property: 'eth',
            methods: [{
                name: 'getPendingTxsByAddress',
                call: 'eth_getPendingTxsByAddress',
                params: 1,
            }]
        });
        this.web3.extend({
            property: 'eth',
            methods: [{
                name: 'getPoolTransactionsLimit',
                call: 'eth_getPoolTransactionsLimit',
                params: 1,
            }]
        });
        this.web3.extend({
            property: 'eth',
            methods: [{
                name: 'getContractList',
                call: 'eth_getContractList',
                params: 2,
            }]
        });
    }

    getBlockByNumber(blockNumber, cb) {
        this.web3.eth.getBlock(blockNumber, cb)
    }
    getTransaction(txid, cb) {
        this.web3.eth.getTransaction(txid, cb)
    }
    getTransactionReceipt(txid, cb) {
        this.web3.eth.getTransactionReceipt(txid, cb)
    }
    getAddress(addr, offset, limit, cb) {
        this.web3.eth.getAccountSummary(addr, 'latest', (err, balance) => {
            if (err) {
                return cb(err)
            }
            this.web3.eth.getHistory(addr, offset, limit, (err, history) => {
                if (err) {
                    return cb(err)
                }
                // var rs = {
                //     "balance": balance,
                //     "txs": history
                // }
                this.getAddressPendingTxs(addr, (err, pendings) => {
                    var rs = [];
                    if (pendings) {
                        rs = rs.concat(pendings)
                    }
                    rs = rs.concat(history.data)
                    balance['txs'] = rs;
                    cb(null, balance)
                })
            })
        })
    }
    getAddressHistory(addr, offset, limit, cb) {
        this.web3.eth.getHistory(addr, offset, limit, (err, history) => {
            if (err) {
                return cb(err)
            }
            this.getAddressPendingTxs(addr, (err, pendings) => {
                var rs = [];
                if (pendings) {
                    rs = rs.concat(pendings)
                }
                rs = rs.concat(history.data)
                
                cb(null, rs)
            })
        })
    }
    getAddressPendingTxs(addr, cb) {
        this.web3.eth.getPendingTxsByAddress(addr, (err, txs) => {
            if (err) {
                return cb(err)
            }
            if (txs) {
                for (var i = 0; i < txs.length; i++) {
                    var tx = new EthJsTx(txs[i]);
                    var from = '0x' + tx.getSenderAddress().toString('hex');
                    txs[i].from = from;
                }
            }
            return cb(null, txs)
        })
    }
    getAddressNonce(addr, block, cb) {
        this.web3.eth.getTransactionCount(addr, block, (err, rs)=>{
            cb(err, rs)
        })
    }
    getAddressBalance(addr, block, cb) {
        this.web3.eth.getBalance(addr, block, (err, rs)=>{
            cb(err, rs)
        })
    }
    getERC20History(addr, contractAddr, offset, limit, cb) {
        this.web3.eth.getERC20TokenHistory(addr, contractAddr, offset, limit, (err, history) => {
            if (err) {
                return cb(err)
            }
            cb(null, history)
        })
    }
    getERC20Balance(addr, contractAddr, cb) {
        if(addr.length ==42) {
            addr = addr.substring(2)
        }
        this.web3.eth.call({
            to: contractAddr,
            data: '0x70a08231000000000000000000000000' + addr
        }, (err, rs)=>{
            cb(err, rs)
        })
    }
    getLatestNumber(cb) {
        this.web3.eth.getBlockNumber((err, rs) => {
            cb(err, rs);
        })
    }
    getPoolTransactionsLimit(limit, cb) {
        this.web3.eth.getPoolTransactionsLimit(limit, (err, txs) => {
            if (err) {
                return cb(err)
            }
            if (txs) {
                for (var i = 0; i < txs.length; i++) {
                    var tx = new EthJsTx(txs[i]);
                    var from = '0x' + tx.getSenderAddress().toString('hex');
                    txs[i].from = from;
                }
            }
            return cb(null, txs)
        })
    }
    getContractList(offset, limit, cb) {
        this.web3.eth.getContractList(offset, limit, (err, rs) =>{
            cb(err, rs)
        })
    }
}

module.exports = RPC;