/*
Streams no Node.js

Stream = trabalhar com dados em partes, sem precisar carregar tudo de uma vez na memória.

Exemplo: Netflix / Spotify
O vídeo ou a música começa a tocar antes de baixar tudo.
A aplicação recebe pequenos pedaços do arquivo e já consegue usar esses dados.

Exemplo real em backend:
Importação de clientes via CSV.

POST /upload import.csv

Sem streams:
1gb -> Node espera receber o arquivo inteiro, depois lê tudo e só então começa a salvar no banco de dados.

Problema:
se o upload for de 10mb/s, um arquivo de 1gb pode levar cerca de 100s para terminar o envio.

Sem streams:
100s esperando upload completo e só depois começam as inserções no banco.

Com streams:
o Node lê o arquivo aos poucos, enquanto o upload ainda está acontecendo.

Exemplo:
a cada 10mb recebidos, o sistema já pode processar algumas linhas do CSV e salvar no banco de dados.

Ou seja:
não precisa esperar o arquivo inteiro chegar para começar a trabalhar com os dados.

Tipos principais de streams:

Readable Streams:
streams de leitura, usadas quando o Node recebe ou lê dados aos poucos.
Exemplo: ler um arquivo CSV enviado no upload.

Writable Streams:
streams de escrita, usadas quando o Node envia ou grava dados aos poucos.
Exemplo: enviar partes de um vídeo, escrever em um arquivo ou mandar dados na resposta HTTP.

Resumo:
Streams permitem processar dados em pequenos pedaços.
Isso melhora performance, reduz uso de memória e permite trabalhar com arquivos grandes de forma eficiente.
*/