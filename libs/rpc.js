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
                this.getAddressPendingTxs(addr, (err, pendings)=>{
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
    getAddressPendingTxs(addr, cb) {
        this.web3.eth.getPendingTxsByAddress(addr, (err, txs) => {
            if (err) {
                return cb(err)
            }
            if (txs) {
                for (var i = 0; i< txs.length; i++) {
                    var tx = new EthJsTx(txs[i]);
                    var from = '0x' + tx.getSenderAddress().toString('hex');
                    txs[i].from = from;
                }
            }
            return cb(null, txs)
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
    getLatestNumber(cb) {
        this.web3.eth.getBlockNumber((err, rs) => {
            cb(err, rs);
        })
    }
}

module.exports = RPC;