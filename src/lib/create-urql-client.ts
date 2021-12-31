import { createClient, defaultExchanges } from '@urql/core';
import fetch from 'cross-fetch';

export interface CreateClientOptions {
  accessToken: string;
  shop: string;
}

export const createGraphqlClient = (options: CreateClientOptions) => {
  const { accessToken, shop } = options;
  const url = `https://${shop}/admin/api/2021-10/graphql.json`;
  const headers = {
    'X-Shopify-Storefront-Access-Token': accessToken,
    'Content-Type': 'application/graphql',
  };

  const client = createClient({
    url,
    fetch,
    fetchOptions: {
      headers,
    },
    requestPolicy: 'network-only',
    exchanges: defaultExchanges,
  });

  return client;
};
