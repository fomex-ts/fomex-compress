import { Server } from 'http';
import { WebApplication, WebSlotManager, WebRouter } from 'qoq';
import supertest from 'supertest';
import { Compress } from '../src';

let app: WebApplication;
let router: WebRouter;
let listen: Server;
let server: ReturnType<typeof supertest>;

beforeEach(() => {
  app = new WebApplication();
  router = new WebRouter({
    slots: new WebSlotManager(),
  });
  app.appendRoutes(router);
  listen = app.listen();
  server = supertest(listen);
});

afterEach(() => {
  listen.close();
});

it ('brotli firstly', async () => {
  router.get('/').use(new Compress()).action((ctx) => {
    ctx.response.statusCode = 200;
    ctx.send('tt'.repeat(2000));
  });

  await server
    .get('/')
    .set('accept-encoding', 'gzip, deflate, br')
    .expect('content-encoding', 'br');
});

it ('gzip for wildcard', async () => {
  router.get('/').use(new Compress()).action((ctx) => {
    ctx.response.statusCode = 200;
    ctx.send('tt'.repeat(2000));
  });
  app.appendRoutes(router);

  await server
    .get('/')
    .set('accept-encoding', '*')
    .expect('content-encoding', 'gzip');
});

it ('no compression for small bytes', async () => {
  router.get('/').use(new Compress()).action((ctx) => {
    ctx.response.statusCode = 200;
    ctx.send('tt');
  });

  await server
    .get('/')
    .set('accept-encoding', '*')
    .then((res) => {
      expect(res.header['content-encoding']).toEqual(undefined);
    });
});

it ('force compress for small bytes', async () => {
  router.get('/').use(new Compress({ threshold: 0 })).action((ctx) => {
    ctx.response.statusCode = 200;
    ctx.send('ttt');
  });

  await server
    .get('/')
    .set('accept-encoding', 'gzip, deflate')
    .expect('content-encoding', 'gzip');
});

it ('can set bytes', async () => {
  router.get('/').use(new Compress({ threshold: 3 })).action((ctx) => {
    ctx.response.statusCode = 200;
    ctx.send('tttt');
  });

  await server
    .get('/')
    .set('accept-encoding', 'gzip, deflate')
    .expect('content-encoding', 'gzip');
});

it ('can disable kind of them', async () => {
  router.get('/').use(new Compress({ br: false })).action((ctx) => {
    ctx.response.statusCode = 200;
    ctx.send('tt'.repeat(2000));
  });

  await server
    .get('/')
    .set('accept-encoding', 'gzip, deflate, br')
    .expect('content-encoding', 'gzip');
});
