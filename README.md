# ethersearch-api
This is an api server for [ethersearch-ui](https://github.com/blockdev-vn/ethersearch-ui) - an ethereum explorer.

# Install
Ethersearch-api is a NodeJS project, it's easy to install.

```
npm install
npm start
```

# Api
## Transaction
### Get transaction by hash
```
localhost:3000/tx?hash=0x6b0a86adae9b57bb507c95e0491388ad75066a624fc33fb71e521602790f0b34
```
```
{
    "data": {
        "blockHash": "0x1d8deac61334f54cb7cafb7e5fa8f7dec020989858566f0c5dc8a4a648286c12",
        "blockNumber": 32,
        "from": "0x2F0036792DF25362a2DE0Bab82B4798657B4BC36",
        "gas": 200000,
        "gasPrice": "100000000000",
        "hash": "0xcaebd83e99420ae820ca40a64aa5c5d9106e3fda6db2e75ad8049b93896b10f6",
        "input": "0xa9059cbb000000000000000000000000c4c7fc58b37be1b4f2a6230cace76afd47cff7480000000000000000000000000000000000000000000000000000000000000009",
        "nonce": 6,
        "to": "0x2d051595AA51A29C6EDa4eaCAFBe79234508Ca7C",
        "transactionIndex": 0,
        "value": "0",
        "v": "0xfe7",
        "r": "0xbbdf67a417419da64ff28a85f8b2f81fc84aa9887ce44d4c4f9981a82c93cf73",
        "s": "0x39ead23568017abfd4328ac923798726130d6278593791d5c5a71d81d5b2781a",
        "blockTime": 1533445312,
        "gasUsed": 36231,
        "logs": [
            {
                "address": "0x2d051595AA51A29C6EDa4eaCAFBe79234508Ca7C",
                "topics": [
                    "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
                    "0x0000000000000000000000002f0036792df25362a2de0bab82b4798657b4bc36",
                    "0x000000000000000000000000c4c7fc58b37be1b4f2a6230cace76afd47cff748"
                ],
                "data": "0x0000000000000000000000000000000000000000000000000000000000000009",
                "blockNumber": 32,
                "transactionHash": "0xcaebd83e99420ae820ca40a64aa5c5d9106e3fda6db2e75ad8049b93896b10f6",
                "transactionIndex": 0,
                "blockHash": "0x1d8deac61334f54cb7cafb7e5fa8f7dec020989858566f0c5dc8a4a648286c12",
                "logIndex": 0,
                "removed": false,
                "id": "log_6065faca"
            }
        ],
        "status": true
    }
}
```
## Block
### Current block number 

```
http://localhost:3000/latestnumber
```

```
{"data":10203}
```
### Get block by block number
```
http://localhost:3000/block?number=10566
```

```
{
   "data":{
      "difficulty":"2",
      "extraData":"0xd7830108",
      "gasLimit":10122307,
      "gasUsed":21000,
      "hash":"0xa36c782512de1a7a0d09fb5e4ed898a2848f8eec97ba8a6916f5df5ec78c3034",
      "logsBloom":"0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
      "miner":"0x0000000000000000000000000000000000000000",
      "mixHash":"0x0000000000000000000000000000000000000000000000000000000000000000",
      "nonce":"0x0000000000000000",
      "number":10566,
      "parentHash":"0xe655b937da6b31fb0192ba3352b7c3810bd5c7e0296ebd5dd52968bc6b96b23f",
      "receiptsRoot":"0x056b23fbba480696b65fe5a59b8f2148a1299103c4f57df839233af2cf4ca2d2",
      "sha3Uncles":"0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
      "size":711,
      "stateRoot":"0xfb8b9ae3b74dca2143751af66fb4f705d981ac1d0596ae9b601c43a10a7f6615",
      "timestamp":1534431406,
      "totalDifficulty":"21133",
      "transactions":[
         "0xd8d7740442770335a677c5f50a80ae43526bb93679edc6ea41ecc4ef5e9bdcbb"
      ],
      "transactionsRoot":"0x43070a28adec023f9141425f575533af656104762e5bc5ce4d0306d188fb035f",
      "uncles":[

      ]
   }
}
```

## Address
### Get address summary information
This api return all information of an address and 20 latest transactions(includes pending transactions)
```
localhost:3000/addr?a=0xc4c7fc58b37be1b4f2a6230cace76afd47cff748
```

```
{
    "data": {
        "balance": "0x3635c9adc5dea00122",
        "code": "",
        "nonce": "0x0",
        "txs": [
            {
                "nonce": "0x24",
                "gasPrice": "0x1",
                "gas": "0x15f90",
                "to": "0xc4c7fc58b37be1b4f2a6230cace76afd47cff748",
                "value": "0xa",
                "input": "0x",
                "v": "0xfe7",
                "r": "0xff88d6e94d78b041ad69ce54ea5c98ed264f4524e93ceb4110771c2bcfaa4471",
                "s": "0x52eb0399009d89927e5b3865d4e7742182f1573699f432fcaca061934576e945",
                "hash": "0x37fc0f31fe0bf2a06a4961647026c4d63a13563451745c4ff2fa5d3168c58699",
                "from": "0x2f0036792df25362a2de0bab82b4798657b4bc36"
            },
            {
                "blockNumber": 10566,
                "blockTime": 1534431406,
                "from": "0x2f0036792df25362a2de0bab82b4798657b4bc36",
                "gasPrice": "1",
                "gasUsed": "21000",
                "hash": "0xd8d7740442770335a677c5f50a80ae43526bb93679edc6ea41ecc4ef5e9bdcbb",
                "to": "0xc4c7fc58b37be1b4f2a6230cace76afd47cff748",
                "txIndex": 0,
                "type": 1,
                "value": "10"
            },
            {
                "blockNumber": 10562,
                "blockTime": 1534431394,
                "from": "0x2f0036792df25362a2de0bab82b4798657b4bc36",
                "gasPrice": "1",
                "gasUsed": "21000",
                "hash": "0x432e5dd342e52659c811dc1b88a7781011bf80ede75ac386e5dce03b634510f0",
                "to": "0xc4c7fc58b37be1b4f2a6230cace76afd47cff748",
                "txIndex": 0,
                "type": 1,
                "value": "10"
            }
        ]
    }
}
```

### Get history of an address
Return the last 20 transactions of an address(includes pending transactions)

```
localhost:3000/addr/txs?a=0x2F0036792DF25362a2DE0Bab82B4798657B4BC36
```

```
{
    "data": [
        {
            "nonce": "0x24",
            "gasPrice": "0x1",
            "gas": "0x15f90",
            "to": "0xc4c7fc58b37be1b4f2a6230cace76afd47cff748",
            "value": "0xa",
            "input": "0x",
            "v": "0xfe7",
            "r": "0xff88d6e94d78b041ad69ce54ea5c98ed264f4524e93ceb4110771c2bcfaa4471",
            "s": "0x52eb0399009d89927e5b3865d4e7742182f1573699f432fcaca061934576e945",
            "hash": "0x37fc0f31fe0bf2a06a4961647026c4d63a13563451745c4ff2fa5d3168c58699",
            "from": "0x2f0036792df25362a2de0bab82b4798657b4bc36"
        },
        {
            "blockNumber": 10566,
            "blockTime": 1534431406,
            "from": "0x2f0036792df25362a2de0bab82b4798657b4bc36",
            "gasPrice": "1",
            "gasUsed": "21000",
            "hash": "0xd8d7740442770335a677c5f50a80ae43526bb93679edc6ea41ecc4ef5e9bdcbb",
            "to": "0xc4c7fc58b37be1b4f2a6230cace76afd47cff748",
            "txIndex": 0,
            "type": 1,
            "value": "10"
        },
        {
            "blockNumber": 10562,
            "blockTime": 1534431394,
            "from": "0x2f0036792df25362a2de0bab82b4798657b4bc36",
            "gasPrice": "1",
            "gasUsed": "21000",
            "hash": "0x432e5dd342e52659c811dc1b88a7781011bf80ede75ac386e5dce03b634510f0",
            "to": "0xc4c7fc58b37be1b4f2a6230cace76afd47cff748",
            "txIndex": 0,
            "type": 1,
            "value": "10"
        }
    ]
}
```

### Get ERC20 history of an address
Return the last 20 ERC20 transactions of an address 

```
localhost:3000/addr/erc20/txs?a=<address>&c=<token address>

localhost:3000/addr/erc20/txs?a=0x2F0036792DF25362a2DE0Bab82B4798657B4BC36&c=0x2d051595aa51a29c6eda4eacafbe79234508ca7c
```

```
{
    "data": [
        {
            "blockTime": 1533445312,
            "contract": "0x2d051595aa51a29c6eda4eacafbe79234508ca7c",
            "from": "0x2f0036792df25362a2de0bab82b4798657b4bc36",
            "hash": "0xcaebd83e99420ae820ca40a64aa5c5d9106e3fda6db2e75ad8049b93896b10f6",
            "logIndex": 0,
            "to": "0xc4c7fc58b37be1b4f2a6230cace76afd47cff748",
            "txIndex": 0,
            "type": 0,
            "value": "9"
        },
        {
            "blockTime": 1533445291,
            "contract": "0x2d051595aa51a29c6eda4eacafbe79234508ca7c",
            "from": "0x2f0036792df25362a2de0bab82b4798657b4bc36",
            "hash": "0x4cd60afdbc966175f2ad3cd51405c6223f3cf179131a3e9cc98525c99ab87a4c",
            "logIndex": 0,
            "to": "0xc4c7fc58b37be1b4f2a6230cace76afd47cff748",
            "txIndex": 1,
            "type": 0,
            "value": "99"
        }
    ]
}
```