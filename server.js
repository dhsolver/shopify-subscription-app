require('isomorphic-fetch');
const Koa = require('koa');
const { createServer } = require('http');
const next = require('next');
const dotenv = require('dotenv');
const mobxReact = require('mobx-react');
const Client = require('shopify-buy');
const { parse } = require('url');

dotenv.config();

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({dev, dir: 'src'});
const handle = app.getRequestHandler();

const { SHOPIFY_API_SECRET_KEY, SHOPIFY_API_KEY, SHOPIFY_STOREFRONT_KEY } = process.env;

const client = Client.buildClient({
  storefrontAccessToken: SHOPIFY_STOREFRONT_KEY,
  domain: 'tiny-organics.myshopify.com'
});

mobxReact.useStaticRendering(true);

app.prepare().then(() => {
  const server = new Koa();
  server.keys = [SHOPIFY_API_SECRET_KEY];

  createServer(async (req, res) => {
    // Be sure to pass `true` as the second argument to `url.parse`.
    // This tells it to parse the query portion of the URL.
    const parsedUrl = parse(req.url, true)
      , { pathname, query } = parsedUrl

    if (pathname === '/products/') {
      const response = await client.product.fetchAll();
      res.end(JSON.stringify(response));
    }
    else if (pathname === '/collections/with-products/') {
      const response = await client.collection.fetchAllWithProducts();
      res.end(JSON.stringify(response));
    }
    else {
      handle(req, res, parsedUrl)
    }
  }).listen(port, async () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
