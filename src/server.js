import http from 'node:http'

const server = http.createServer((req, res) => {
  return res.end('Server runing')
})

server.listen(3333)