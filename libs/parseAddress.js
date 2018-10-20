
var BN = require("ethereumjs-util").BN;
const BLOCKNUMBER_MAX = 4294967296
const TXINDEX_MAX = 65535
function getAddressFromBlock(addresses) {
    // addresses = [
    //     [
    //         [
    //             'YS0FFZWqUaKcbtpOrK++eSNFCMp8AAAAAP//zbT//8SA08/zl+kOtGwXOgPYLvmaTceFB2gv0EkV0xY7bNeh',
    //             'AQAAAAAAAAAAAAAAAFvJ7RQAAAAAAACNhwAAABdIdugALwA2eS3yU2Ki3gurgrR5hle0vDY='
    //         ],
    //         [
    //             'YS8ANnkt8lNiot4Lq4K0eYZXtLw2AAAAAP//zbT//8SA08/zl+kOtGwXOgPYLvmaTceFB2gv0EkV0xY7bNeh',
    //             'AAAAAAAAAAAAAAAAAFvJ7RQAAAAAAACNhwAAABdIdugALQUVlapRopxu2k6sr755I0UIynw='
    //         ]
    //     ],
    //     [
    //         [
    //             'dC8ANnkt8lNiot4Lq4K0eYZXtLw2LQUVlapRopxu2k6sr755I0UIynwAAAAApDYS7P////8=',
    //             'AMTH/Fize+G08qYjDKznav1Hz/dIxIDTz/OX6Q60bBc6A9gu+ZpNx4UHaC/QSRXTFjts16EJ'
    //         ],
    //         [
    //             'dMTH/Fize+G08qYjDKznav1Hz/dILQUVlapRopxu2k6sr755I0UIynwAAAAApDYS7P////8=',
    //             'AS8ANnkt8lNiot4Lq4K0eYZXtLw2xIDTz/OX6Q60bBc6A9gu+ZpNx4UHaC/QSRXTFjts16EJ'
    //         ]
    //     ]
    // ]
    normalInfo = parseMultiAddressInfo(addresses[0], parseNormalAddress);
    erc20Info = parseMultiAddressInfo(addresses[1], parseERC20);
    return [normalInfo, erc20Info];
}

// Array of array
function parseMultiAddressInfo(info, func) {
    var rs = [];
    for (var i = 0; i < info.length; i += 2) {
        var tx = func(info[i]);
        rs.push(tx)
    }
    return rs
}
// Array of 2 elements: key, val
function parseNormalAddress(info) {
    var k = Buffer.from(info[0], 'base64')
    var v = Buffer.from(info[1], 'base64')

    idx = 0
    prefix = k.slice(idx, idx += 1).toString('ascii')

    if (prefix != 'a') {
        console.log(prefix);
        throw "Can not parse tx information. Data must begin by 'a'"
    }

    from = k.slice(idx, idx += 20)
    blkNum = k.slice(idx, idx += 8)
    txIndex = k.slice(idx, idx += 2)
    txHash = k.slice(idx)

    // type-value-blocktime-gasUsed-gasPrice-addr
    idx = 0
    type = v.slice(0, idx += 1)
    amount = v.slice(idx, idx += 8)
    blkTime = v.slice(idx, idx += 8)
    gasUsed = v.slice(idx, idx += 8)
    gasPrice = v.slice(idx, idx += 8)
    to = v.slice(idx)

    var rs = {
        from: from.toString('hex'),
        to: to.toString('hex'),
        value: new BN(amount.toString('hex'), 16).toString(10),
        blockNumber: BLOCKNUMBER_MAX - parseInt(blkNum.toString('hex'), 16),
        timestamp: parseInt(blkTime.toString('hex'), 16),
        txIndex: TXINDEX_MAX - parseInt(txIndex.toString('hex'), 16),
        hash: txHash.toString('hex'),
        gasUsed: parseInt(gasUsed.toString('hex'), 16),
        gasPrice: new BN(gasPrice.toString('hex'), 16).toString(10),
        type: prefix
    }
    return rs;
}

// Array of 2 elements: key, val
function parseERC20(info) {
    var k = Buffer.from(info[0], 'base64')
    var v = Buffer.from(info[1], 'base64')

    idx = 0
    prefix = k.slice(idx, idx += 1).toString('ascii')
    if (prefix != 't') {
        console.log(prefix);
        throw "Can not parse token er20 info. Data must be start by 't'"
    }
    from = k.slice(idx, idx += 20)
    contractAddr = k.slice(idx, idx += 20)
    blkTime = k.slice(idx, idx += 8)
    txIndex = k.slice(idx, idx += 2)
    logIndex = k.slice(idx, idx += 2)


    idx = 0
    type = v.slice(0, idx += 1)
    to = v.slice(idx, idx += 20)
    txHash = v.slice(idx, idx += 32)
    amount = v.slice(idx)

    var rs = {
        contract: contractAddr.toString('hex'),
        from: from.toString('hex'),
        to: to.toString('hex'),
        value: new BN(amount.toString('hex'), 16).toString(10),
        timestamp: BLOCKNUMBER_MAX - parseInt(blkTime.toString('hex'), 16),
        txIndex: TXINDEX_MAX - parseInt(txIndex.toString('hex'), 16),
        logIndex: TXINDEX_MAX - parseInt(logIndex.toString('hex'), 16),
        hash: txHash.toString('hex'),
        type: prefix
    }
    return rs
}

module.exports = {
    Parse: getAddressFromBlock
}