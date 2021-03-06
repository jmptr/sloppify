/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, ".env")})

module.exports = {
  schema: "schema.json",
  documents: ['src/**/*.{graphql,js,ts,jsx,tsx}'],
  extensions: {
    endpoints: {
      default: {
        url: `https://${process.env.SHOPIFY_SHOP}/admin/api/2021-10/graphql.json`,
        headers: {
          'X-Shopify-Access-Token': `${process.env.SHOPIFY_ACCESS_TOKEN}`,
          'Content-Type': 'application/graphql',
        },
      },
    },
  },
};
