

<p align="center">
  <img  src="./logo.svg" alt="iblockchain logo">
</p> 

<p align="center">
  <a href="https://npmcharts.com/compare/iblockchain"><img src="https://img.shields.io/npm/dm/iblockchain.svg" alt="Downloads"></a>
  <a href="https://www.npmjs.com/package/iblockchain"><img src="https://img.shields.io/npm/v/iblockchain.svg" alt="Version"></a>
  <a href="https://www.npmjs.com/package/iblockchain"><img src="https://img.shields.io/npm/l/iblockchain.svg" alt="License"></a>
</p>

## 功能

- 学习区块链的演示demo
- 简单的挖矿、交易、P2P网络的实现
- 一系列demo演示命令，辅助理解blockchain

## 安装

```bash
npm install -g iblockchain
```

## 上手

执行`iblockchain` 后 进入demo页面

```
Welcome to iblockchain !

  Commands:

    help [command...]             Provides help for a given command.
    exit                          Exits application.
    mine                          开始挖矿
    blockchain                    查看整个区块链 [bc]
    pending                       查看还没有打包进区块的交易
    trans <to> <amount>           给人转账
    blance [address]              查看地址的余额
    pub                           本地公钥(公钥就是地址)
    prv                           本地私钥
    detail <index>                查看第n个区块的详情
    peer                          查看P2P网络节点
    --------我是分割线--------
    hash <value>                  [演示] 计算sha256哈希
    minedemo <data> <difficulty>  [演示] 挖矿计算逻辑
    getpub <value>                [演示] 根据私钥计算出公钥(私钥加密 公钥解密，公钥可以从私钥计算出来)
    sign <value> <prv>            [演示] 用私钥加密信息 得到签名
    verify <value> <pub> <sig>    [演示] 使用签名 校验信息 <消息> <公钥> <签名>
    valid                         [演示] 区块链是否合法
    update <index>                [演示] 篡改<index>个block的数据,第一个转账信息amount+1
    mineblock <index>             [演示] 对<index>个上的区块数据重新挖矿,使其变成合法的小块块

iblockchain => [信息]: UDP服务监听完毕: 0.0.0.0:51881
[信息]: 更新本地区块链
iblockchain => 
// 继续输入命令 体验功能

```



## 体验一下下

**查看整个区块链数据**

```bash
iblockchain => blockchain

// output

┌────────────────────┬────────────────────┬────────────────────┬────────────────────┬────────────────────┬────────────────────┐
│ index              │ previousHash       │ timestamp          │ data               │ hash               │ nonce              │
├────────────────────┼────────────────────┼────────────────────┼────────────────────┼────────────────────┼────────────────────┤
│ 0                  │ "0"                │ 1538669227813      │ "Welcome to ibloc… │ "00000aa1fbf27775… │ 979911             │
├────────────────────┼────────────────────┼────────────────────┼────────────────────┼────────────────────┼────────────────────┤
│ 1                  │ "00000aa1fbf27775… │ 1538988895613      │ [                  │ "0000050c2b1b65a0… │ 69438              │
│                    │                    │                    │  {                 │                    │                    │
│                    │                    │                    │   "from": "0",     │                    │                    │
│                    │                    │                    │   "to": "0414b351… │                    │                    │
│                    │                    │                    │   "amount": 100,   │                    │                    │
│                    │                    │                    │   "sig": "3046022… │                    │                    │
│                    │                    │                    │   "timestamp": 15… │                    │                    │
│                    │                    │                    │  }                 │                    │                    │
│                    │                    │                    │ ]                  │                    │                    │
├────────────────────┼────────────────────┼────────────────────┼────────────────────┼────────────────────┼────────────────────┤
│ 2                  │ "0000050c2b1b65a0… │ 1538988929584      │ [                  │ "000001ee70cd40e8… │ 766700             │
│                    │                    │                    │  {                 │                    │                    │
│                    │                    │                    │   "from": "0",     │                    │                    │
│                    │                    │                    │   "to": "0429b0e2… │                    │                    │
│                    │                    │                    │   "amount": 100,   │                    │                    │
│                    │                    │                    │   "sig": "3044022… │                    │                    │
│                    │                    │                    │   "timestamp": 15… │                    │                    │
│                    │                    │                    │  }                 │                    │                    │
│                    │                    │                    │ ]                  │                    │                    │
└────────────────────┴────────────────────┴────────────────────┴────────────────────┴────────────────────┴────────────────────┘
```

**挖矿,新增区块 mine**

```bash
iblockchain => mine

// output
[信息]: 挖矿结束 用时4.30s , 算了806180次, 哈希值是00000c3633bd15a4b2c45bbc9373658694b55c078de4777bec28e10cea9e53fd，入账100 请笑纳

┌────────────────────┬────────────────────┬────────────────────┬────────────────────┬────────────────────┬────────────────────┐
│ index              │ previousHash       │ timestamp          │ nonce              │ hash               │ data               │
├────────────────────┼────────────────────┼────────────────────┼────────────────────┼────────────────────┼────────────────────┤
│ 14                 │ "00000b93ccf0c0b6… │ 1539017632369      │ 806180             │ "00000c3633bd15a4… │ [                  │
│                    │                    │                    │                    │                    │  {                 │
│                    │                    │                    │                    │                    │   "from": "0",     │
│                    │                    │                    │                    │                    │   "to": "041ad79c… │
│                    │                    │                    │                    │                    │   "amount": 100,   │
│                    │                    │                    │                    │                    │   "sig": "3045022… │
│                    │                    │                    │                    │                    │   "timestamp": 15… │
│                    │                    │                    │                    │                    │  }                 │
│                    │                    │                    │                    │                    │ ]                  │
└────────────────────┴────────────────────┴────────────────────┴────────────────────┴────────────────────┴────────────────────┘
```

**查看本地地址（公钥） pub**

```bash
iblockchain => pub
//output
041ad79cddfcc575efdae26e46e14a13c600967aff1db6d7eba66f770d585c542dfaed897f72b5bc40595f5601a868837f63bface539350ac6d013b99d17a0fbeb
```

**转账 trans**
```bash
iblockchain => trans 0446b3de736bca3db5e19a7db06e56851a0a45fd07bbf74a355ef91f480151ff9ee7720367b4010c525bada702df62c98768d6a34bdd066e69653ad92e8f99f065 20

//output
┌────────────────────┬────────────────────┬────────────────────┬────────────────────┬────────────────────┐
│ from               │ to                 │ amount             │ sig                │ timestamp          │
├────────────────────┼────────────────────┼────────────────────┼────────────────────┼────────────────────┤
│ "041ad79cddfcc575… │ "0446b3de736bca3d… │ 20                 │ "3045022100804809… │ 1539017836747      │
└────────────────────┴────────────────────┴────────────────────┴────────────────────┴────────────────────┘

```

**查看还没打包的交易 pending**

```bash
iblockchain => pending

//output
┌────────────────────┬────────────────────┬────────────────────┬────────────────────┬────────────────────┐
│ from               │ to                 │ amount             │ sig                │ timestamp          │
├────────────────────┼────────────────────┼────────────────────┼────────────────────┼────────────────────┤
│ "041ad79cddfcc575… │ "0446b3de736bca3d… │ 20                 │ "3045022100804809… │ 1539017836747      │
├────────────────────┼────────────────────┼────────────────────┼────────────────────┼────────────────────┤
│ "041ad79cddfcc575… │ "0446b3de736bca3d… │ 12                 │ "30460221008b13a5… │ 1539017874219      │
└────────────────────┴────────────────────┴────────────────────┴────────────────────┴────────────────────┘
```



**查看地址余额(默认本地)) blance**

```bash
iblockchain => blance 041ad79cddfcc575efdae26e46e14a13c600967aff1db6d7eba66f770d585c542dfaed897f72b5bc40595f5601a868837f63bface539350ac6d013b99d17a0fbeb
{
  "address": "041ad79cddfcc575efdae26e46e14a13c600967aff1db6d7eba66f770d585c542dfaed897f72b5bc40595f5601a868837f63bface539350ac6d013b99d17a0fbeb",
  "blance": 168
}
┌────────────────────┬────────────────────┐
│ address            │ blance             │
├────────────────────┼────────────────────┤
│ "041ad79cddfcc575… │ 168                │
└────────────────────┴────────────────────┘
```

**查看网络节点列表 peer**
```bash
iblockchain => peer
//output
┌────────────────────┬────────────────────┐
│ port               │ address            │
├────────────────────┼────────────────────┤
│ 8001               │ "47.94.5.240"      │
├────────────────────┼────────────────────┤
│ 8002               │ "42.56.89.132"     │
├────────────────────┼────────────────────┤
│ 59838              │ "124.127.208.135"  │
├────────────────────┼────────────────────┤
│ 27122              │ "123.114.48.94"    │
└────────────────────┴────────────────────┘
```

## 演示命令

**帮助 help**
```bash
iblockchain => help
```


**计算sha256哈希 hash**
```bash
iblockchain => hash imooc

//output
5401cc2e57b309427fd10963f8b8ee58545284e35bfba0e00780369307e54849
┌────────────────────┬────────────────────┐
│ hash               │ value              │
├────────────────────┼────────────────────┤
│ "5401cc2e57b30942… │ "imooc"            │
└────────────────────┴────────────────────┘
```


**演示挖矿逻辑 minedemo**
```bash
iblockchain => minedemo imooc 2

// output
[信息] 数据是 imooc0 哈希值是25c771cbd916307a0417ebf4f8a705e8319bb100c93db4cde74f4fbca7da54d6
[信息] 数据是 imooc1 哈希值是3b8368f43662598160ade6788b0504d789700c59574613c3dffb8b467aab8d5f
[信息] 数据是 imooc2 哈希值是f3cf53d3b2d6f83ac857e8e018ee4bbd78c1fdd5d96660b20116d2bc6a4e281e
...省略很多条
[信息] 数据是 imooc248 哈希值是e6e8c271edec6c1b6f2b4bfa9725fecc0fe50356dcec47766440da2e29837e88
[信息] 数据是 imooc249 哈希值是d1e79e718588ae125252d88c4a373934ebab3a9b1015f50d89329a151b78e406
[信息] 数据是 imooc250 哈希值是008781ebdfdff9e1660841b4ab159f2cb6c3fca3217865366c30a1912d620cc5
```


**根据私钥算出公钥 getpub**
```bash
iblockchain => getpub imooc
私钥imooc计算出的公钥 04c8d1d62200e93e7bbf4b0c65da66d343656a6aebd51c146ed60f9dbbe39a4beededb5bbeeb1660269695d5a6959470c411c07545952e93f80460e76e31fcdde0
```

**RSA私钥加密 sign**
```bash
// 字符imooc作为私钥 对信息imoocrocks进行签名
iblockchain => sign imoocrocks imooc
签名 304402206cc8d37c9e9ac3d679267aa0203550e04e7bb7ee6ba3f6c2193b597aa9bdaa58022029e54e94065c2a377a7632bdda0f51b6bd8e28c8667568459b2329683deb8db8
```
**RSA公钥验证签名 verify**
```bash
iblockchain => verify imoocrocks 04c8d....dde0 3044....8db8
true
```


**校验区块链是否合法 valid**
```bash
iblockchain => valid
校验结果: true
```


**篡改blockchain交易数据 update**
```bash
iblockchain => update 16
修改了 转账金额从20=>21

iblockchain => valid
[错误]: 第 16个区块hash不对,算出的是b2f20b3bde5fe69ab5d5092f50222ea57c980902d4709de19563e2e797759efd 区块里本来的hash是000001b0538910078e426c2989d561a4f715ab11838545ce4efe7838754f5fef 看来数据被篡改了
[错误]: 第16个区块不合法
校验结果: false

```


**重新对一个区块挖矿修复 mineblock**
```bash
iblockchain => mineblock 16
[错误]: 第 16个区块hash不对,算出的是b2f20b3bde5fe69ab5d5092f50222ea57c980902d4709de19563e2e797759efd 区块里本来的hash是000001b0538910078e426c2989d561a4f715ab11838545ce4efe7838754f5fef 看来数据被篡改了
[信息]: 区块16修复完毕
```

**退出 exit**
```bash
iblockchain => exit
[信息]: 网络一线牵，珍惜这段缘 再见
```

## 一些p2p网络传递的信息
```bash
[信息]: 交易合法 新增一下 { from: '0444d....bcf1'
[信息]: 挖矿结束 用时0.50s , 算了69438次, 哈希值是0000050c2b1b65a01659e85a17dfc3ad96fe8548dfaf694ff88ae478832ac37d，入账100 请笑纳
[信息]: 大家快去和新朋友打个招呼
[信息]: 有人挖矿成功，我们恭喜这位幸运儿
 ....

```




## 更多信息

- [知乎](https://www.zhihu.com/people/woniuppp/activities)
- 如何写出这个demo(教程)


## 联系

大家可以加我微信

<img src="./woniu.png" width='150px'>

或者直接捐赠

<img src="./8.jpeg" width='150px'>


## 协议

MIT

