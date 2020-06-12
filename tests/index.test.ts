import { WebApplication, baseWebRouter } from 'fomex';
import supertest from 'supertest';
import { PluginCompress } from '../src';
import { expect } from 'chai';

const nodeVersion = process.versions.node.split('.').map(Number);
const hasBrotli = nodeVersion[0] > 10 || nodeVersion[0] === 10 && nodeVersion[1] >= 16;

it ('brotli firstly', async () => {
  const app = new WebApplication();
  app.appendRoutes(baseWebRouter({
    routes() {
      this.get('/').use(new PluginCompress()).action((ctx) => {
        ctx.send(200, 'tt'.repeat(2000));
      });
    }
  }));

  await supertest(app.listen())
    .get('/')
    .set('accept-encoding', 'gzip, deflate, br')
    .expect('content-encoding', hasBrotli ? 'br': 'gzip');
});

it ('gzip for wildcard', async () => {
  const app = new WebApplication();
  app.appendRoutes(baseWebRouter({
    routes() {
      this.get('/').use(new PluginCompress()).action((ctx) => {
        ctx.send(200, 'tt'.repeat(2000));
      });
    }
  }));

  await supertest(app.listen())
    .get('/')
    .set('accept-encoding', '*')
    .expect('content-encoding', 'gzip');
});

it ('no compression for small bytes', async () => {
  const app = new WebApplication();
  app.appendRoutes(baseWebRouter({
    routes() {
      this.get('/').use(new PluginCompress()).action((ctx) => {
        ctx.send(200, 'tt');
      });
    }
  }));

  await supertest(app.listen())
    .get('/')
    .set('accept-encoding', '*')
    .then((res) => {
      expect(res.header['content-encoding']).to.equal(undefined);
    });
});

it ('force compress for small bytes', async () => {
  const app = new WebApplication();
  app.appendRoutes(baseWebRouter({
    routes() {
      this.get('/').use(new PluginCompress({ threshold: 0 })).action((ctx) => {
        ctx.send(200, 'ttt');
      });
    }
  }));

  await supertest(app.listen())
    .get('/')
    .set('accept-encoding', 'gzip, deflate')
    .expect('content-encoding', 'gzip');
});

it ('can set bytes', async () => {
  const app = new WebApplication();
  app.appendRoutes(baseWebRouter({
    routes() {
      this.get('/').use(new PluginCompress({ threshold: 3 })).action((ctx) => {
        ctx.send(200, 'tttt');
      });
    }
  }));

  await supertest(app.listen())
    .get('/')
    .set('accept-encoding', 'gzip, deflate')
    .expect('content-encoding', 'gzip');
});

it ('can disable kind of them', async () => {
  const app = new WebApplication();
  app.appendRoutes(baseWebRouter({
    routes() {
      this.get('/').use(new PluginCompress({ br: false })).action((ctx) => {
        ctx.send(200, 'tt'.repeat(2000));
      });
    }
  }));

  await supertest(app.listen())
    .get('/')
    .set('accept-encoding', 'gzip, deflate, br')
    .expect('content-encoding', 'gzip');
});
