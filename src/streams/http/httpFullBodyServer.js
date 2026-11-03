/*
 * SERVIDOR HTTP — LEITURA COMPLETA DO CORPO
 *
 * req é uma Readable Stream. O for await...of consome seus chunks
 * até o fim; depois Buffer.concat reúne todos em um Buffer.
 * res.end() envia o conteúdo completo como resposta.
 *
 * Atenção: esta abordagem mantém todo o corpo em memória.
 * Use limites de tamanho em aplicações reais.
 *
 * Execute primeiro:
 * node src/streams/http/full-body/httpStreamServer.js
 */
import http from 'node:http'

const server = http.createServer(async (req, res) => {
  const buffers = []

  try {
    for await (const chunk of req) {
      buffers.push(chunk)
    }

    const fullStreamContent = Buffer.concat(buffers).toString()

    console.log('Corpo completo:', fullStreamContent)
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' })
    res.end(fullStreamContent)
  } catch (error) {
    console.error('Erro ao ler requisição:', error)
    if (!res.headersSent) res.writeHead(500)
    res.end('Erro ao processar a requisição')
  }
})

server.listen(3334, () => {
  console.log('Servidor HTTP ouvindo em http://localhost:3334')
})