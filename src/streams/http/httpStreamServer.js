/*
 * SERVIDOR HTTP COM TRANSFORM STREAM
 *
 * req é uma Readable: fornece os bytes recebidos pela rede.
 * res é uma Writable: envia os bytes da resposta ao cliente.
 * A Transform converte cada número recebido em seu negativo.
 *
 * Execute primeiro:
 * node src/streams/http/httpStreamServer.js
 */
import http from 'node:http'
import { Transform } from 'node:stream'
import { pipeline } from 'node:stream/promises'

class InverseNumberStream extends Transform {
  pending = ''

  _transform(chunk, encoding, callback) {
    // Um chunk de rede pode conter números parciais ou vários números.
    this.pending += chunk.toString()
    const lines = this.pending.split('\n')
    this.pending = lines.pop()

    try {
      for (const line of lines) {
        if (!/^\d+$/.test(line)) throw new Error(`Número inválido: ${line}`)
        const transformed = Number(line) * -1
        console.log(transformed)
        this.push(Buffer.from(`${transformed}\n`))
      }
      callback()
    } catch (error) {
      callback(error)
    }
  }

  _flush(callback) {
    if (this.pending !== '') {
      callback(new Error('Número incompleto no fim da requisição'))
    } else {
      callback()
    }
  }
}

const server = http.createServer(async (req, res) => {
  if (req.method !== 'POST' || req.url !== '/') {
    res.writeHead(404).end('Rota não encontrada\n')
    return
  }

  res.setHeader('Content-Type', 'text/plain; charset=utf-8')

  try {
    await pipeline(req, new InverseNumberStream(), res)
  } catch (error) {
    console.error('Erro ao processar stream:', error.message)
    if (!res.headersSent) res.writeHead(400).end('Dados inválidos\n')
    else res.destroy()
  }
})

server.listen(3334, () => console.log('Servidor ouvindo em http://localhost:3334'))