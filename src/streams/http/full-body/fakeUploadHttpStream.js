/*
 * CLIENTE HTTP — ENVIO GRADUAL DE DADOS
 *
 * Gera os números de 1 a 5, um por segundo, e envia cada um
 * como Buffer no corpo de uma requisição POST.
 *
 * duplex: 'half' é necessário no fetch do Node para enviar
 * um corpo baseado em stream.
 *
 * Execute após iniciar o servidor:
 * node src/streams/http/full-body/fakeUploadHttpStream.js
 */
import { Readable } from 'node:stream'

class OneToHundredStream extends Readable {
  index = 1

  _read() {
    const i = this.index++

    setTimeout(() => {
      if (i > 5) {
        this.push(null) // Encerra o envio
      } else {
        const buf = Buffer.from(String(i))
        this.push(buf) // Envia o próximo pedaço
      }
    }, 1000)
  }
}

fetch('http://localhost:3334', {
  method: 'POST',
  body: new OneToHundredStream(),
  duplex: 'half',
})
  .then((res) => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.text() // Lê a resposta completa como texto
  })
  .then((data) => console.log('Resposta do servidor:', data))
  .catch((error) => console.error('Erro na requisição:', error))