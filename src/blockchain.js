const crypto = require('crypto')
let dgram = require('dgram')
let fs = require('fs')

const key = require('./keys')

const initBlock = {
  index: 0,
  previousHash: '0',
  timestamp: 1538669227813,
  data: 'Welcome to iblockchain!',
  hash: '00000aa1fbf27775ab79612bcb8171b3a9e02efe32fa628450ba6e729cf03996',
  nonce: 979911
}
class Blockchain {
  constructor () {
    this.blockchain = [
      initBlock
    ]
    // 还没打包的交易数据
    this.data = []
    // 挖矿难度值
    this.difficulty = 5
    // p2p网络节点
    this.peers = []
    // 本地节点对外的公网ip和端口
    this.remote = {}
    // 种子服务器
    // this.seed = { port: 8001, address: 'localhost' }
    this.seed = { port: 8001, address: '47.94.5.240' }

    // 远程地址存文件
    this.remoteFile = `${__dirname}/address.json`
    this.udp = dgram.createSocket('udp4')
    this.init()
  }
  init () {
    this.bindP2p()
    this.bindEvent()
  }
  bindEvent () {
    process.on('exit', () => {
      console.log('[信息]: 网络一线牵，珍惜这段缘 再见')
    })
  }
  bindP2p () {
    this.udp.on('message', (data, remote) => {
      const address = remote.address
      const port = remote.port
      const action = JSON.parse(data)
      if (action.type) {
        this.dispatch(action, { address, port })
      }
    })
    this.udp.on('error', (err) => {
      console.log('[错误]', err)
    })

    this.udp.on('listening', () => {
      let address = this.udp.address()
      console.log(`[信息]: UDP服务监听完毕: ${address.address}:${address.port}`)
    })
    const port = Number(process.argv[2]) || 0
    this.startNode(port)
  }

  startNode (port) {
    this.udp.bind(port)

    if (port !== 8001) {
      if (fs.existsSync(this.remoteFile)) {
        let address = JSON.parse(fs.readFileSync(this.remoteFile))
        if (address.address && address.port) {
          this.send({
            type: 'byebye',
            data: address
          }, this.seed.port, this.seed.address)
        }
      }

      // 8001认为是server
      this.send({
        type: 'newpeer'
      }, this.seed.port, this.seed.address)

      this.peers.push(this.seed)
    }else{
      this.mine()
      setInterval(()=>{
        this.mine()
      },1000*60*60)
    }
  }
  send (message, port, host) {
    // 发送udp消息
    this.udp.send(JSON.stringify(message), port, host)
  }
  boardcast (action) {
    // 广播
    this.peers.forEach(v => {
      this.send(action, v.port, v.address)
    })
  }
  formatPeer (peer) {
    return `${peer.address}:${peer.port}`
  }
  isEqualObj (obj1, obj2) {
    const keys1 = Object.keys(obj1)
    const keys2 = Object.keys(obj2)
    if (keys1.length !== keys2.length) {
      return false
    }
    return keys1.every(key => obj1[key] === obj2[key])
  }
  addPeers (newPeers) {
    newPeers.forEach(peer => {
      if (!this.peers.find(v => this.isEqualObj(v, peer))) {
        this.peers.push(peer)
      }
    })
  }
  dispatch (action, remote) {
    switch (action.type) {
      case 'newpeer':
        console.log('[信息]: 大家快去和新朋友打个招呼')
        this.boardcast({ type: 'sayhi', data: remote })
        // 回复节点列表
        this.send({
          type: 'peerlist',
          data: {
            peers: this.peers
          }
        }, remote.port, remote.address)
        this.send({
          // 你自己的公网地址
          type: 'remoteAddress',
          data: remote
        }, remote.port, remote.address)
        this.send({ type: 'blockchain', data: JSON.stringify({ blockchain: this.blockchain, trans: this.data }) }, remote.port, remote.address)
        // 添加节点
        this.peers.push(remote)
        break
      case 'peerlist':
        // 本地获取到 所有节点，hi一下新朋友
        const newPeers = action.data.peers
        this.addPeers(newPeers)
        this.boardcast({ type: 'hi' })
        break

      case 'sayhi':
        // 给别人一个hi
        let data = action.data
        this.peers.push(data)
        // 和新加入节点打个招呼
        console.log('[信息]: 听说新朋友来了，打个招呼，相识就是缘', data.port, data.address)
        this.send({ type: 'hi' }, data.port, data.address)
        break

      case 'hi':
        // hi没有意义，udp打洞给网件加白名单用的
        break
      case 'remoteAddress':
        this.remote = action.data
        fs.writeFileSync(this.remoteFile, JSON.stringify(action.data))
        break
      case 'blockchain':
        let allData = JSON.parse(action.data)
        let newChain = allData.blockchain
        let newTrans = allData.trans

        console.log('[信息]: 更新本地区块链')
        this.replaceTrans(newTrans)
        if (newChain.length > 1) {
          // 只有创始区块 不需要更新
          this.replaceChain(JSON.parse(action.data).blockchain)
        }

        break
      case 'byebye':
        const target = action.data
        let i = this.peers.findIndex(v => v.address === target.address && v.port === target.port)
        if (i > -1) {
          this.peers.splice(i, 1)
          // 有的话 在广播一次 怕udp打洞失败
          this.boardcast(action)
        }
        break
      case 'trans':
        // 网络上的交易请求 传给本地区块链
        if (!this.data.find(v => this.isEqualObj(v, action.data))) {
          console.log('[信息]: 交易合法 新增一下',action.data)

          this.addTrans(action.data)
          this.boardcast({ type: 'trans', data: action.data })
        }
        break
      case 'mine':
        const lastBlock = this.getLastBlock()
        // let {blockchain,trans} = action.data

        if (lastBlock.hash === action.data.hash) {
          return
        }
        if (this.isValidNewBlock(action.data, lastBlock)) {
          console.log('[信息]: 有人挖矿成功，我们恭喜这位幸运儿')

          this.blockchain.push(action.data)
          this.data = []
          this.boardcast({ type: 'mine', data: action.data })
        } else {
          console.log('[错误]: 不合法的区块', action.data)
        }
        break
      default:
        console.log(
          `[错误]: 不合法的消息 '${JSON.stringify(action)}' from ${remote.address}:${
            remote.port
          }`
        )
    }
  }

  calculateHashForBlock (block) {
    const { index, previousHash, timestamp, data, nonce } = block
    return this.calculateHash(
      index,
      previousHash,
      timestamp,
      data,
      nonce
    )
  }
  sha256Hash (value, showLog = false) {
    const hash = crypto
      .createHash('sha256')
      .update(String(value))
      .digest('hex')
    if (showLog) {
      console.log(`[信息] 数据是 ${value} 哈希值是${hash}`)
    }
    return hash
  }
  calculateHash (index, previousHash, timestamp, data, nonce) {
    return this.sha256Hash(index + previousHash + timestamp + JSON.stringify(data) + nonce)
  }
  getLastBlock () {
    return this.blockchain[this.blockchain.length - 1]
  }
  addTrans (trans) {
    if (this.verifyTransfer(trans)) {
      this.data.push(trans)
    }
  }

  transfer (from, to, money) {
    let amount = parseInt(money)

    if (isNaN(amount)) {
      console.log('[信息]: amount必须是数字')
      return
    }
    const timestamp = new Date().getTime()
    const sig = key.sign({ from, to, amount, timestamp })
    let transObj = { from, to, amount, sig, timestamp }
    if (from !== '0') {
      const blance = this.blance(from)
      if (blance < amount) {
        console.log(`[信息]: 余额不足，还剩${blance},想支出${amount}`)
        return
      }
      this.boardcast({ type: 'trans', data: transObj })
    }
    this.data.push(transObj)
    return transObj
  }
  // mine (address) {

  mine () {
    const start = new Date().getTime()
    // let bcLen = this.blockchain.length
    // if (bcLen > 5 && this.blockchain[bcLen - 1].timestamp - this.blockchain[1].timestamp < 1000 * 60) {
    //   this.difficulty += 1
    // }
    if (!this.data.every(v => this.verifyTransfer(v))) {
      return
    }
    this.transfer('0', key.keys.pub, 100)

    const newBlock = this.generateNewBlock()

    if (this.isValidNewBlock(newBlock, this.getLastBlock())) {
      this.blockchain.push(newBlock)
      this.data = []
    } else {
      console.log('[错误]: 不合法的区块或者是链', newBlock)
    }
    // 告诉p2p网络交易信息
    this.boardcast({ type: 'mine', data: newBlock })

    const end = new Date().getTime()
    const offset = ((end - start) / 1000).toFixed(2)
    console.log(`[信息]: 挖矿结束 用时${offset}s , 算了${newBlock.nonce}次, 哈希值是${newBlock.hash}，入账100 请笑纳`)
    return newBlock
  }

  blance (address = key.keys.pub) {
    let balance = 0

    for (const block of this.blockchain) {
      for (const trans of block.data) {
        if (trans.from === address) {
          balance -= trans.amount
        }

        if (trans.to === address) {
          balance += trans.amount
        }
      }
    }
    return balance
  }
  generateNewBlock () {
    const nextIndex = this.blockchain.length
    const previousHash = this.getLastBlock().hash

    let data = this.data
    let timestamp = new Date().getTime()
    let nonce = 0
    let hash = this.calculateHash(nextIndex, previousHash, timestamp, data, nonce)
    while (hash.slice(0, this.difficulty) !== '0'.repeat(this.difficulty)) {
      nonce = nonce + 1
      timestamp = new Date().getTime()
      hash = this.calculateHash(nextIndex, previousHash, timestamp, data, nonce)
    }
    return {
      index: nextIndex,
      previousHash,
      timestamp,
      nonce,
      hash,
      data: this.data

    }
  }
  isValidNewBlock (newBlock, previousBlock) {
    const newBlockHash = this.calculateHashForBlock(newBlock)
    if (previousBlock.index + 1 !== newBlock.index) {
      console.log('[错误]: 新区快index不对')

      return false
    } else if (previousBlock.hash !== newBlock.previousHash) {
      console.log(`[错误]: 第${newBlock.index}个区块的previousHash不对`)

      return false
    } else if (newBlockHash !== newBlock.hash) {
      console.log(`[错误]: 第 ${newBlock.index}个区块hash不对,算出的是${newBlockHash} 区块里本来的hash是${newBlock.hash} 看来数据被篡改了`)

      return false
    } else if (newBlockHash.slice(0, this.difficulty) !== '0'.repeat(this.difficulty)) {
      return false
    } else if (!this.isValidTrans(newBlock.data)) {
      console.log('[错误]: 交易不合法')
      return false
    } else {
      return true
    }
  }
  verifyTransfer (trans) {
    return trans.from === '0' ? true : key.verify(trans, trans.from)
  }
  isValidTrans (trans) {
    return trans.every(v => this.verifyTransfer(v))
  }
  isValidChain (chain = this.blockchain) {
    // chain[0].hash = '122xx'

    if (JSON.stringify(chain[0]) !== JSON.stringify(initBlock)) {
      return false
    }
    for (let i = chain.length - 1; i >= 1; i = i - 1) {
      if (!this.isValidNewBlock(chain[i], chain[i - 1])) {
        console.log(`[错误]: 第${i}个区块不合法`)
        return false
      }
    }
    return true
  }

  replaceTrans (trans) {
    if (this.isValidTrans(trans)) {
      this.data = trans
    }
  }

  replaceChain (newChain) {
    if (newChain.length === 1) {
      return
    }
    if (this.isValidChain(newChain) && newChain.length > this.blockchain.length) {
      this.blockchain = JSON.parse(JSON.stringify(newChain))
    } else {
      console.log(`[错误]: 区块链数据不合法`)
    }
  }

  mineDemo (data, difficulty) {
    let nonce = 0
    let hash = this.sha256Hash(String(data) + nonce, true)
    while (hash.slice(0, difficulty) !== '0'.repeat(difficulty)) {
      nonce = nonce + 1
      hash = this.sha256Hash(String(data) + nonce, true)
    }
  }
  mineForBlock (index) {
    const block = this.blockchain[index]
    if (this.isValidNewBlock(block, this.blockchain[index - 1])) {
      console.log('[信息]: 区块本来就好好地，瞎合计啥呢')
      return
    }
    // const previousHash = '0'
    const previousHash = this.blockchain[index - 1].hash
    let data = block.data
    let timestamp = block.timestamp
    let nonce = 0
    let hash = this.calculateHash(index, previousHash, timestamp, data, nonce)
    while (hash.slice(0, this.difficulty) !== '0'.repeat(this.difficulty)) {
      nonce = nonce + 1
      hash = this.calculateHash(index, previousHash, timestamp, data, nonce)
    }
    this.blockchain[index] = {
      index,
      previousHash,
      timestamp,
      nonce,
      hash,
      data
    }
    console.log(`[信息]: 区块${index}修复完毕`)
  }
}

module.exports = Blockchain