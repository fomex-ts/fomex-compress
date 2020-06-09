import { WebApplication, baseWebRouter } from 'fomex';
import supertest from 'supertest';
import { PluginCompress } from '../src';
import { expect } from 'chai';

it ('brotli firstly', async () => {
  const app = new WebApplication();
  app.appendRoutes(baseWebRouter({
    routes() {
      this.get('/').use(new PluginCompress()).handle((ctx) => {
        ctx.compress = true;
        ctx.send(200, 'tt'.repeat(10000000));
      });
    }
  }));

  await supertest(app.listen())
    .get('/')
    .set('accept-encoding', 'gzip, deflate, br')
    .expect('content-encoding', 'br');
});

it ('gzip for wildcard', async () => {
  const app = new WebApplication();
  app.appendRoutes(baseWebRouter({
    routes() {
      this.get('/').use(new PluginCompress()).handle((ctx) => {
        ctx.compress = true;
        ctx.send(200, 'tt'.repeat(10000000));
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
      this.get('/').use(new PluginCompress()).handle((ctx) => {
        ctx.compress = true;
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
      this.get('/').use(new PluginCompress({ threshold: 0 })).handle((ctx) => {
        ctx.compress = true;
        ctx.send(200, 't');
      });
    }
  }));

  await supertest(app.listen())
    .get('/')
    .set('accept-encoding', 'gzip, deflate, br')
    .expect('content-encoding', 'br');
});
