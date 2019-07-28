require('isomorphic-fetch');
const next = require('next')
  , dotenv = require('dotenv')
  , express = require('express')
  , compression = require('compression')
  , mobxReact = require('mobx-react')
  , Client = require('shopify-buy')
  , Axios = require('axios')
  ;

dotenv.config();

const port = parseInt(process.env.PORT, 10) || 3000
  , dev = process.env.NODE_ENV !== 'production'
  , app = next({dev, dir: 'src'})
  , handle = app.getRequestHandler()
  ;

const {
  RECHARGE_API_KEY,
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
  const server = express();
  server.use(compression());

  server.get('/products/', async (req, res) => {
    const response = await storefrontClient.product.fetchAll();
    return res.send(JSON.stringify(response));
  });

  server.get('/collections/with-products/', async (req, res) => {
    const response = await storefrontClient.collection.fetchAllWithProducts();
    return res.send(JSON.stringify(response));
  });

  server.get('/orders/', async (req, res) => {
    const response = await adminClient.get('orders.json');
    return res.end(JSON.stringify(response.data));
  });

  server.get('/recharge-customers/', async (req, res) => {
    const response = await rechargeClient.get('customers');
    return res.end(JSON.stringify(response.data));
  });

  server.get('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, async () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
