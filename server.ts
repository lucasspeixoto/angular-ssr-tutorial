import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  // ? Engine responsável por renderizar nossos conteúdos no servidor.
  const commonEngine = new CommonEngine(); 

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  //* Serve static files from /browser
  /**
   * ! Aqui antes de qualquer renderização no servidor se iniciar,
   * ! arquivos estáticos gerado durante o build do projeto São buscados,
   * ! se existem, são utilizado sem necessidade de renderizar nada no servidor,
   * ! gerando maior velocidade de exibição do conteúdo original.
   */
  server.get('**', express.static(browserDistFolder, {
    /*
    ? maxAge: '1y':
    * Este é um formato abreviado para “1 ano”. Indica que o recurso deve ser 
    * armazenado em cache por um ano antes que o cliente ou proxy
    * considere o recurso obsoleto
    */
    maxAge: '1y',
    index: 'index.html',
  }));

  // All regular routes use the Angular engine
  server.get('**', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    console.log("Gerenationg angular content in server!!!");

    /*
    Executado inicalmente no lado do servidor
    */
    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
