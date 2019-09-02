require('isomorphic-fetch');
const next = require('next')
  , dotenv = require('dotenv')
  , Shopify = require('shopify-api-node')
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

const adminAPI = new Shopify({
  shopName: SHOPIFY_DOMAIN,
  apiKey: SHOPIFY_API_KEY,
  apiVersion: '2019-07',
  password: SHOPIFY_PASSWORD,
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
  server.use(express.json()); // for parsing application/json
  server.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

  server.get('/products/', async (req, res) => {
    const response = await storefrontClient.product.fetchAll();
    return res.send(JSON.stringify(response));
  });

  /* FETCH PRODUCTS */

  server.get('/collections/with-products/', async (req, res) => {
    const response = await storefrontClient.collection.fetchAllWithProducts();
    return res.send(JSON.stringify(response));
  });

  server.get('/orders/', async (req, res) => {
    const response = await adminClient.get('orders.json');
    return res.end(JSON.stringify(response.data));
  });

  /* GET CUSTOMER INFO */

  server.get('/recharge-customers/', async (req, res) => {
    const response = await rechargeClient.get('customers');
    return res.end(JSON.stringify(response.data));
  });

  server.get('/recharge-customers/:id', async (req, res) => {
    const response = await rechargeClient.get(`customers?shopify_customer_id=${params.id}`);
    return res.end(JSON.stringify(response.data[0]));
  });


  /* CREATE CUSTOMERS */

  server.post('/shopify-customers/', async (req, res) => {
    try {
      const response = await adminAPI.customer.create(req.body);
      console.log(response.data);
      res.send(JSON.stringify(response));
    }
    catch (e) {
      console.error(e)
      res.status(e.statusCode).json({message: e.message});
    }
  });

  server.post('/recharge-customers/', async (req, res) => {
    try {
      const response = await rechargeClient.post('customers', req.body);
      return res.end(JSON.stringify(response.data));
    }
    catch (e) {
      return res.status(500).send(e);
    }
  });

  server.post('/customers/:id/addresses/', async () => {
    const response = await rechargeClient.post(`customers/${req.body.customer_id}/addresses/`, req.body);
    return res.end(JSON.stringify(response.data));
  });

  /* CREATE ORDER */

  server.post('/recharge-checkouts/', async (req, res) => {
    try {
      const response = await rechargeClient.post('checkouts', req.body);
      return res.end(JSON.stringify(response.data));
    }
    catch (e) {
      console.error(e.response.data.errors)
      res.status(e.statusCode).json({message: e.message});
    }
  });

  server.post('/recharge-charges/:id/', async (req, res) => {
    try {
      console.log(`/checkouts/${req.params.id}/charge`, req.body)
      const response = await rechargeClient.post(`checkouts/${req.params.id}/charge/`, req.body);
      return res.end(JSON.stringify(response.data));
    }
    catch (e) {
      console.error(e.response.data.errors)
      res.status(e.statusCode).json({message: e.message});
    }
  });

  server.put('/recharge-checkouts/:id/', async (req, res) => {
    try {
      console.log(`/checkouts/${req.params.id}/charge`, req.body)
      const response = await rechargeClient.put(`checkouts/${req.params.id}/`, req.body);
      return res.end(JSON.stringify(response.data));
    }
    catch (e) {
      console.error(e.response.data.errors)
      res.status(e.statusCode).json({message: e.message});
    }
  });

  server.get('/recharge-checkouts/:token/shipping-rates', async (req, res) => {
    try {
      const response = await rechargeClient.get(`checkouts/${req.params.token}/shipping_rates/`, req.body);
      return res.end(JSON.stringify(response.data));
    }
    catch (e) {
      console.error(e.response.data.errors)
      res.status(e.statusCode).json({message: e.message});
    }
  });

  server.put('/recharge-charges/:id/', async (req, res) => {
    try {
      console.log(`/checkouts/${req.params.id}`, req.body)
      const response = await rechargeClient.post(`checkouts/${req.params.id}/charge/`, req.body);
      return res.end(JSON.stringify(response.data));
    }
    catch (e) {
      console.error(e.response.data.errors)
      res.status(e.statusCode).json({message: e.message});
    }
  });

  server.post('/subscriptions/', async (req, res) => {
    const response = await rechargeClient.post('subscriptions', req.body);
    return res.end(JSON.stringify(response.data));
  });

  server.get('/subscription-products/', async (req, res) => {
    const response = await rechargeClient.get('products');
    return res.send(JSON.stringify(response.data));
  });

  server.get('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, async () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
