/*
 * CLIENTE HTTP COM READABLE STREAM
 *
 * Simula um upload: envia um número por segundo sem aguardar a
 * produção de todos os dados. Cada número termina com '\n',
 * permitindo que o servidor identifique os registros corretamente.
 *
 * Execute depois de iniciar o servidor:
 * node src/streams/http/fakeUploadHttpStream.js
 */
import { Readable } from 'node:stream'

class OneToHundredStream extends Readable {
  index = 1

  _read() {
    const i = this.index++

    setTimeout(() => {
      if (i > 100) {
        this.push(null)
      } else {
        this.push(Buffer.from(`${i}\n`))
      }
    }, 1000)
  }
}

try {
  const response = await fetch('http://localhost:3334', {
    method: 'POST',
    body: new OneToHundredStream(),
    duplex: 'half',
  })

  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  console.log('Resposta do servidor:')
  console.log(await response.text())
} catch (error) {
  console.error('Falha na requisição:', error)
  process.exitCode = 1
}