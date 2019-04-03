
const Blockchain = require('./blockchain.js')
const key = require('./keys')
const { formatLog } = require('./util')

const blockchain = new Blockchain()
function cli (vorpal) {
  vorpal
    .use(mineCommand)
    .use(blockchainCommand)
    .use(pendingCommand)
    .use(transCommand)
    .use(blanceCommand)
    .use(pubCommand)
    .use(prvCommand)
    .use(detailCommand)
    .use(peerCommand)
    .use(divider)

  // 测试命令

    .use(hashCommand)
    .use(mineDemoCommand)
    .use(getpubCommand)
    .use(signCommand)
    .use(verifyCommand)
    .use(validCommand)
    .use(updateCommand)
    .use(mineForUpdateBlock)

    .use(welcome)
    .delimiter('iblockchain => ')
    .show()
}

module.exports = cli

function divider (vorpal) {
  vorpal.command('-'.repeat(8) + '我是分割线' + '-'.repeat(8), '')
    .action(function (args, callback) {
      callback()
    })
}
// COMMANDS
function welcome (vorpal) {
  vorpal.log('Welcome to iblockchain !')
  vorpal.exec('help')
}

function transCommand (vorpal) {
  vorpal
    // .command('trans <from> <to> <amount>', '转账')
    .command('trans <to> <amount>', '给人转账')
    .action(function (args, callback) {
      try {
        let trans = blockchain.transfer(key.keys.pub, args.to, args.amount)
        if (trans) {
          formatLog(trans)
        }
      } catch (err) {
        this.log(err)
      }
      callback()
    })
}
function blanceCommand (vorpal) {
  vorpal
    .command('blance [address] ', '查看地址的余额')
    .action(function (args, callback) {
      try {
        const blance = blockchain.blance(args.address)
        formatLog({ address: args.address || key.keys.pub, blance })
      } catch (err) {
        this.log(err)
      }
      callback()
    })
}

function mineCommand (vorpal) {
  vorpal
    .command('mine', '开始挖矿')
    // .command('mine <data>', '开始挖矿')
    .action(function (args, callback) {
      try {
        let block = blockchain.mine()
        if (block) {
          formatLog(block)
        }
      } catch (err) {
        this.log(err)
      }
      callback()
    })
}
function blockchainCommand (vorpal) {
  vorpal
    .command('blockchain', '查看整个区块链 [bc]')
    .alias('bc')
    .action(function (args, callback) {
      // console.log(JSON.stringify(blockchain.blockchain,null,2))
      formatLog(blockchain.blockchain)
      callback()
    })
}
function pendingCommand (vorpal) {
  vorpal
    .command('pending', '查看还没有打包进区块的交易')
    .action(function (args, callback) {
      formatLog(blockchain.data)
      callback()
    })
}

function pubCommand (vorpal) {
  vorpal
    .command('pub', '本地公钥(公钥就是地址)')
    .action(function (args, callback) {
      console.log(key.keys.pub)
      callback()
    })
}
function prvCommand (vorpal) {
  vorpal
    .command('prv', '本地私钥')
    .action(function (args, callback) {
      console.log(key.keys.prv)
      callback()
    })
}
function detailCommand (vorpal) {
  vorpal
    .command('detail <index>', '查看第n个区块的详情')
    .action(function (args, callback) {
      const bc = blockchain.blockchain[args.index]
      this.log(bc)
      formatLog(bc)
      formatLog(bc.data)

      callback()
    })
}
function peerCommand (vorpal) {
  vorpal
    .command('peer', '查看P2P网络节点')
    .action(function (args, callback) {
      formatLog(blockchain.peers)
      callback()
    })
}

// 测试命令

function validCommand (vorpal) {
  vorpal
    .command('valid', '[演示] 区块链是否合法')
    .action(function (args, callback) {
      console.log('校验结果:', blockchain.isValidChain())
      callback()
    })
}
function mineDemoCommand (vorpal) {
  vorpal
    .command('minedemo <data> <difficulty>', '[演示] 挖矿计算逻辑')
    // .command('mine <data>', '开始挖矿')
    .action(function (args, callback) {
      blockchain.mineDemo(args.data, args.difficulty)
      callback()
    })
}

function hashCommand (vorpal) {
  vorpal
    .command('hash <value>', '[演示] 计算sha256哈希')
    .action(function (args, callback) {
      let hash = blockchain.sha256Hash(args.value)
      console.log(hash)
      formatLog({
        hash,
        value: args.value
      })
      callback()
    })
}

function getpubCommand (vorpal) {
  vorpal
    .command('getpub <value>', '[演示] 根据私钥计算出公钥(私钥加密 公钥解密，公钥可以从私钥计算出来)')
    .action(function (args, callback) {
      let pub = key.getPub(args.value)
      console.log(`私钥${args.value}计算出的公钥 ${pub}`)
      callback()
    })
}
function signCommand (vorpal) {
  vorpal
    .command('sign <value> <prv>', '[演示] 用私钥加密信息 得到签名')
    .action(function (args, callback) {
      let sig = key.signMsg(args.value, args.prv)
      console.log('签名', sig)
      callback()
    })
}
function verifyCommand (vorpal) {
  vorpal
    .command('verify <value> <pub> <sig>', '[演示] 使用签名 校验信息 <消息> <公钥> <签名>')
    .action(function (args, callback) {
      const isVerify = key.verifyMsg(args.value, args.sig, args.pub)
      console.log(isVerify)
      callback()
    })
}

function updateCommand (vorpal) {
  vorpal
    .command('update <index>', '[演示] 篡改<index>个block的数据,第一个转账信息amount+1')
    .action(function (args, callback) {
      const index = args.index
      if (checkIndex(index)) {
        let data = blockchain.blockchain[index].data
        let amount = data[0].amount
        data[0].amount = amount + 1
        console.log(`修改了 转账金额从${amount}=>${data[0].amount}`)
      }
      callback()
    })
}
function checkIndex (index) {
  if (index === 0) {
    console.log('没事别动创世区块')
    return false
  } else if (isNaN(parseInt(index))) {
    console.log('输入数字')
    return false
  } else if (index > blockchain.blockchain.length - 1) {
    console.log('区块链没那么长')
    return false
  } else {
    return true
  }
}
function mineForUpdateBlock (vorpal) {
  vorpal
    .command('mineblock <index>', '[演示] 对<index>个上的区块数据重新挖矿,使其变成合法的小块块')
    .action(function (args, callback) {
      const index = args.index
      if (checkIndex(index)) {
        blockchain.mineForBlock(index)
      }
      callback()
    })
}
