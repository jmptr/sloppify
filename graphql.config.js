/* eslint-disable @typescript-eslint/no-var-requires */
module.exports = {
  schema: "schema.json",
  documents: ['src/**/*.{graphql,js,ts,jsx,tsx}'],
  extensions: {
    endpoints: {
      default: {
        url: `https://${process.env.SHOPIFY_STORE}/admin/api/2021-10/graphql.json`,
        headers: {
          'X-Shopify-Access-Token': `${process.env.SHOPIFY_ACCESS_TOKEN}`,
          'Content-Type': 'application/graphql',
        },
      },
    },
  },
};
