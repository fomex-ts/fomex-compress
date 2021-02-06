import { WebApplication, createWebRouter, WebSlotManager } from 'qoq';
import supertest from 'supertest';
import { Compress } from '../src';
import { expect } from 'chai';

const nodeVersion = process.versions.node.split('.').map(Number);
const hasBrotli = nodeVersion[0]! > 10 || nodeVersion[0] === 10 && nodeVersion[1]! >= 16;

it ('brotli firstly', async () => {
  const app = new WebApplication();
  const router = createWebRouter(WebSlotManager);

  router.get('/').use(new Compress()).action((ctx) => {
    ctx.response.statusCode = 200;
    ctx.send('tt'.repeat(2000));
  });

  app.appendRoutes(router);

  await supertest(app.listen())
    .get('/')
    .set('accept-encoding', 'gzip, deflate, br')
    .expect('content-encoding', hasBrotli ? 'br': 'gzip');
});

it ('gzip for wildcard', async () => {
  const app = new WebApplication();
  const router = createWebRouter(WebSlotManager);

  router.get('/').use(new Compress()).action((ctx) => {
    ctx.response.statusCode = 200;
    ctx.send('tt'.repeat(2000));
  });
  app.appendRoutes(router);

  await supertest(app.listen())
    .get('/')
    .set('accept-encoding', '*')
    .expect('content-encoding', 'gzip');
});

it ('no compression for small bytes', async () => {
  const app = new WebApplication();
  const router = createWebRouter(WebSlotManager);

  router.get('/').use(new Compress()).action((ctx) => {
    ctx.response.statusCode = 200;
    ctx.send('tt');
  });
  app.appendRoutes(router);

  await supertest(app.listen())
    .get('/')
    .set('accept-encoding', '*')
    .then((res) => {
      expect(res.header['content-encoding']).to.equal(undefined);
    });
});

it ('force compress for small bytes', async () => {
  const app = new WebApplication();
  const router = createWebRouter(WebSlotManager);

  router.get('/').use(new Compress({ threshold: 0 })).action((ctx) => {
    ctx.response.statusCode = 200;
    ctx.send('ttt');
  });
  app.appendRoutes(router);

  await supertest(app.listen())
    .get('/')
    .set('accept-encoding', 'gzip, deflate')
    .expect('content-encoding', 'gzip');
});

it ('can set bytes', async () => {
  const app = new WebApplication();
  const router = createWebRouter(WebSlotManager);

  router.get('/').use(new Compress({ threshold: 3 })).action((ctx) => {
    ctx.response.statusCode = 200;
    ctx.send('tttt');
  });
  app.appendRoutes(router);

  await supertest(app.listen())
    .get('/')
    .set('accept-encoding', 'gzip, deflate')
    .expect('content-encoding', 'gzip');
});

it ('can disable kind of them', async () => {
  const app = new WebApplication();
  const router = createWebRouter(WebSlotManager);

  router.get('/').use(new Compress({ br: false })).action((ctx) => {
    ctx.response.statusCode = 200;
    ctx.send('tt'.repeat(2000));
  });
  app.appendRoutes(router);

  await supertest(app.listen())
    .get('/')
    .set('accept-encoding', 'gzip, deflate, br')
    .expect('content-encoding', 'gzip');
});
