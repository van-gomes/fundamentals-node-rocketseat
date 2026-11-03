
/*
 * FUNDAMENTOS DE TRANSFORM STREAMS NO NODE.JS
 *
 * Transform é uma stream que recebe dados, transforma
 * esses dados e disponibiliza o resultado para outra stream.
 *
 * Diferente da Writable, que apenas consome os dados,
 * a Transform pode receber e produzir novos chunks.
 *
 * PRINCIPAIS CONCEITOS:
 *
 * - Transform: stream de transformação.
 * - _transform(): método responsável por transformar os dados.
 * - chunk: pedaço de dados recebido da stream anterior.
 * - encoding: codificação dos dados recebidos.
 * - callback(): sinaliza o fim do processamento do chunk.
 * - callback(null, buffer): informa que não houve erro
 *   e disponibiliza o dado transformado.
 * - Buffer.from(): converte os dados para Buffer.
 * - pipe(): conecta as streams em sequência.
 *
 * EXEMPLO DESTA AULA:
 *
 * 1. Readable gera números de 1 até 100, um por segundo.
 * 2. Transform multiplica cada número por -1.
 * 3. Writable multiplica o resultado por 10.
 * 4. O resultado é exibido no terminal imediatamente.
 *
 * FLUXO:
 *
 * Readable -> Transform -> Writable
 *    1    ->    -1     ->   -10
 *    2    ->    -2     ->   -20
 *    3    ->    -3     ->   -30
 *
 * Os dados são processados conforme chegam, sem esperar
 * a geração de todos os números.
 *
 * EXECUTAR NA RAIZ DO PROJETO:
 *
 * node src/streams/transformStream.js
 *
 * Para interromper: Ctrl + C.
 */

import { Readable, Writable, Transform } from 'node:stream'

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

class InverseNumberStream extends Transform {
  _transform(chunk, encoding, callback) {
    const transformed = Number(chunk.toString()) * -1

    callback(null, Buffer.from(String(transformed)))
  }
}

class MultiplyByTenStream extends Writable {
  _write(chunk, encoding, callback) {
    console.log(Number(chunk.toString()) * 10)
    callback()
  }
}

new OneToHundredStream()
  .pipe(new InverseNumberStream())
  .pipe(new MultiplyByTenStream())
