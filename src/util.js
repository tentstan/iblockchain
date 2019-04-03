
const Table = require('cli-table')

function formatLog (data) {
  console.log(JSON.stringify(data, null, 2))
  if (!Array.isArray(data)) {
    data = [data]
  } else if (data.length === 0) {
    return
  }
  const first = data[0]
  const head = Object.keys(first)
  let res = data.map(v => {
    return head.map(h => JSON.stringify(v[h], null, 1) || '')
  })
  // const colObj = {'hash':80}
  // const colWidths = head.map(v=>{
  //   return colObj[v]||20
  // })
  const table = new Table({
    head,
    // colWidths
    colWidths: new Array(head.length).fill(20)
  })
  table.push(...res)
  console.log(table.toString())
}

module.exports = { formatLog }
