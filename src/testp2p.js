let dgram = require('dgram')
let udp = dgram.createSocket('udp4')

udp.on('message', function (data, ipdr) {
  console.log('message')
  console.log(data.toString())
  console.log(ipdr)
})

udp.on('error', function (err) {
  console.log('error', err)
})

udp.on('listening', function () {
  let address = udp.address()
  console.log('UDP Server listening on ' + address.address + ':' + address.port)
})
// console.log('bind')
udp.bind(0)

let send = function (message, port, host) {
  console.log('send')
  console.log(arguments)
  udp.send(Buffer.from(message), port || 8002, host || 'anynb.com')
}

// called directly in command line
if (require.main === module) {
  let port = parseInt(process.argv[2])
  let host = process.argv[3]
  if (port) {
    send('echo', port, host)
  }
}
