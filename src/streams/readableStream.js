
/*
 * FUNDAMENTOS DE STREAMS NO NODE.JS
 *
 * Streams permitem ler, enviar e processar dados aos poucos,
 * sem precisar esperar que todos os dados estejam disponíveis.
 *
 * Exemplo: receber um CSV grande e começar a processar suas
 * linhas antes de terminar o upload.
 *
 * No Node.js, requisições (req) e respostas (res) HTTP são streams.
 *
 * TIPOS E CONCEITOS:
 *
 * - Readable: stream da qual podemos ler dados.
 * - Writable: stream na qual podemos escrever dados.
 * - process.stdin: entrada de dados pelo terminal.
 * - process.stdout: saída de dados no terminal.
 * - pipe(): conecta uma stream de leitura a uma de escrita.
 * - _read(): método implementado para fornecer dados na Readable.
 * - push(): disponibiliza um pedaço de dados (chunk).
 * - push(null): informa que a stream terminou.
 * - Buffer: representa dados binários em memória.
 *
 * EXEMPLO DESTA AULA:
 *
 * Criamos uma Readable Stream que gera números de 1 até 100.
 * A cada segundo, um número é convertido em Buffer e enviado
 * para o terminal por meio do pipe().
 *
 * Isso demonstra que podemos consumir dados enquanto eles
 * ainda estão sendo produzidos, sem esperar o fim da stream.
 *
 * EXECUTAR NO TERMINAL:
 *
 * node src/streams/readableStream.js
 *
 * Execute a partir da raiz do projeto.
 * Para interromper antes de terminar: Ctrl + C.
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
        const buffer = Buffer.from(`${i}${i < 100 ? ', ' : '\n'}`)

        this.push(buffer)
      }
    }, 1000)
  }
}

new OneToHundredStream()
  .pipe(process.stdout)