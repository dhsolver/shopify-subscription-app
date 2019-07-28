require('isomorphic-fetch');
const Koa = require('koa');
const { createServer } = require('http');
const next = require('next');
const dotenv = require('dotenv');
const mobxReact = require('mobx-react');
const Client = require('shopify-buy');
const { parse } = require('url');
const Axios = require('axios');

dotenv.config();

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({dev, dir: 'src'});
const handle = app.getRequestHandler();

const {
  RECHARGE_API_KEY,
  SHOPIFY_API_SECRET_KEY,
  SHOPIFY_API_KEY,
  SHOPIFY_STOREFRONT_KEY,
  SHOPIFY_DOMAIN,
  SHOPIFY_PASSWORD,
} = process.env;

const storefrontClient = Client.buildClient({
  storefrontAccessToken: SHOPIFY_STOREFRONT_KEY,
  domain: SHOPIFY_DOMAIN,
});

const adminClient = Axios.create({
  baseURL: `https://${SHOPIFY_API_KEY}:${SHOPIFY_PASSWORD}@${SHOPIFY_DOMAIN}/admin/api/2019-07`,
  headers: {
    'Accept': 'application/json; charset=utf-8;',
    'Content-Type': 'application/json',
  },
});

const rechargeClient = Axios.create({
  baseURL: 'https://api.rechargeapps.com/',
  headers: {
    'Accept': 'application/json; charset=utf-8;',
    'Content-Type': 'application/json',
    'X-Recharge-Access-Token': RECHARGE_API_KEY,
  }
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
      ;

    if (req.method === 'GET') {
      if (pathname === '/products/') {
        const response = await storefrontClient.product.fetchAll();
        res.end(JSON.stringify(response));
      }
      else if (pathname === '/collections/with-products/') {
        const response = await storefrontClient.collection.fetchAllWithProducts();
        res.end(JSON.stringify(response));
      }
      else if (pathname === '/orders/') {
        const response = await adminClient.get('orders.json');
        res.end(JSON.stringify(response.data));
      }
      else if (pathname === '/recharge-customers/') {
        const response = await rechargeClient.get('customers');
        res.end(JSON.stringify(response.data));
      }
      else {
        handle(req, res, parsedUrl)
      }
    }
  }).listen(port, async () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
