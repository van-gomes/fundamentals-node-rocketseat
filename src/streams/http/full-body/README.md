# Streams HTTP — leitura do corpo completo

## Objetivo da aula

Na aula anterior, o servidor processava os dados **conforme chegavam** com `req.pipe(new InverseNumberStream()).pipe(res)`. Nesta aula, o servidor **espera terminar a leitura da requisição** para então usar seu conteúdo completo. A requisição continua chegando aos poucos, mas o processamento final ocorre somente depois do término do fluxo.

## Fluxo

```mermaid
flowchart LR
    A["Cliente: Readable"] -->|"POST: chunks 1, 2, 3, 4, 5"| B["Servidor: req"]
    B --> C["for await: guarda chunks"]
    C --> D["Buffer.concat: reúne dados"]
    D --> E["res.end: devolve 12345"]
    E --> F["Cliente: res.text"]
```

## O que cada etapa faz

- `Readable` produz os números de 1 a 5, com intervalo de um segundo.
- `fetch()` envia a stream como corpo da requisição `POST`; no Node, `duplex: 'half'` é exigido para esse tipo de corpo.
- `for await (const chunk of req)` lê cada chunk da requisição de forma assíncrona até o fim da stream.
- `buffers.push(chunk)` acumula os pedaços em memória.
- `Buffer.concat(buffers).toString()` une os bytes recebidos e os converte em texto.
- `res.end(fullStreamContent)` finaliza a resposta enviando o conteúdo completo.
- `res.text()` lê a resposta HTTP como texto no cliente.

**Atenção:** chunks são pedaços de bytes, não necessariamente um número por chunk. O transporte HTTP pode juntar ou dividir os dados. Como o exemplo apenas concatena tudo, o resultado será `12345`, sem vírgulas.

## Executar

Na raiz do projeto, abra dois terminais.

**Terminal 1 — servidor:**

```bash
node src/streams/http/full-body/httpStreamServer.js
```

**Terminal 2 — cliente:**

```bash
node src/streams/http/full-body/fakeUploadHttpStream.js
```

Após aproximadamente cinco segundos, o servidor exibirá `Corpo completo: 12345`, e o cliente exibirá `Resposta do servidor: 12345`. Para interromper o servidor, use `Ctrl + C`.

## Comparação com a aula anterior

| Processamento incremental                                 | Leitura completa                                            |
| --------------------------------------------------------- | ----------------------------------------------------------- |
| `req.pipe(transform).pipe(res)`                           | `for await (const chunk of req)`                            |
| Processa conforme recebe                                  | Acumula e processa ao final                                 |
| Pode reduzir o uso de memória                             | Armazena o corpo inteiro em memória                         |
| Útil para arquivos grandes e dados processáveis em partes | Útil para mensagens pequenas que exigem o conteúdo completo |

## Quando usar?

Um JSON convencional costuma ser lido por completo antes de executar `JSON.parse()`, embora existam parsers incrementais para formatos específicos. Para arquivos grandes, prefira processamento incremental sempre que a regra de negócio permitir. Em produção, defina limites de tamanho, timeout e tratamento de erros para evitar consumo excessivo de recursos.

**Nota:** o exemplo é didático e não implementa limite de tamanho do corpo HTTP. Também não usa a classe `InverseNumberStream`, pois o objetivo agora é demonstrar a leitura completa da requisição, não transformar cada chunk.
