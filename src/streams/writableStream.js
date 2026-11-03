
/*
 * FUNDAMENTOS DE WRITABLE STREAMS NO NODE.JS
 *
 * Writable é uma stream de escrita que recebe e processa
 * dados em partes (chunks).
 *
 * Diferente da Readable, que fornece dados, a Writable
 * consome esses dados, sem gerar novos chunks de saída.
 *
 * PRINCIPAIS CONCEITOS:
 *
 * - _write(): método que implementa o processamento da escrita.
 * - chunk: pedaço de dados recebido da Readable.
 * - encoding: codificação do chunk, quando aplicável.
 * - callback(): informa que o processamento terminou.
 * - pipe(): conecta a Readable à Writable.
 *
 * EXEMPLO DESTA AULA:
 *
 * A Readable gera números de 1 até 100, um por segundo.
 * A Writable recebe cada número, converte o Buffer em
 * string, transforma em Number e multiplica por 10.
 *
 * O resultado é exibido imediatamente no terminal,
 * sem precisar esperar os 100 números serem gerados.
 *
 * FLUXO:
 * Readable (1, 2, 3...) -> Writable (10, 20, 30...)
 *
 * EXECUTAR NA RAIZ DO PROJETO:
 *
 * node src/streams/writableStream.js
 *
 * Para interromper: Ctrl + C.
 */

import { Readable, Writable } from 'node:stream'

class OneToHundredStream extends Readable {
  index = 1

  _read() {
    const i = this.index++

    setTimeout(() => {
      if (i > 100) {
        this.push(null)
      } else {
        const buffer = Buffer.from(String(i))

        this.push(buffer)
      }
    }, 1000)
  }
}

class MultiplyByTenStream extends Writable {
  _write(chunk, encoding, callback) {
    console.log(Number(chunk.toString()) * 10)
    callback()
  }
}

new OneToHundredStream()
  .pipe(new MultiplyByTenStream())
