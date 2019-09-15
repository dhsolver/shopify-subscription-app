const fs = require('fs');
const path = require('path');

const withCss = require('@zeit/next-css');
const withLess = require('@zeit/next-less');
const lessToJS = require('less-vars-to-js');
require('dotenv').config();

// fix: prevents error when .less files are required by node
if (typeof require !== 'undefined') {
  require.extensions['.less'] = file => {}
}

module.exports = {
  ...withCss(
    withLess({
      lessLoaderOptions: {
        javascriptEnabled: true,
        /*
        Re-enable once theming is complete.

        modifyVars: lessToJS(
          fs.readFileSync(path.resolve(__dirname, './src/assets/antd-tiny.less'), 'utf8'),
        ),
        */
      },
      webpack: (config, options) => {
        config.module.rules.push({
          test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 100000
            }
          }
        });

        return config
      }
    }),
  ),
  env: {
    STRIPE_API_KEY: process.env.STRIPE_API_KEY,
    STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    S3_BUCKET: process.env.S3_BUCKET,
    staticFolder: '/static',
    STRIPE_API_KEY: process.env.STRIPE_API_KEY,
    STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
  },
};
