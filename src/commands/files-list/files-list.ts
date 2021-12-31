import { ArgumentsCamelCase, CommandBuilder } from 'yargs';

import Graphql from '../../lib/shopify-graphql';
import filesList from '../queries/files-list.graphql';

interface Arguments {
  shop: string;
  accessToken: string;
}

export const command = 'files-list';

export const describe = 'List the files';

export const builder: CommandBuilder<unknown, Arguments> = {
  shop: {
    alias: 's',
    demandOption: true,
    describe: 'Store name',
    type: 'string',
  },
  accessToken: {
    alias: 't',
    demandOption: true,
    describe: 'Access Token',
    type: 'string',
  },
};

export const handler = async (args: ArgumentsCamelCase<Arguments>) => {
  const { shop, accessToken } = args;
  const query = (filesList.loc && filesList.loc.source.body) || '';
  const client = new Graphql({
    url: `https://${shop}/admin/api/2021-10/graphql.json`,
    headers: {
      'X-Shopify-Access-Token': `${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  try {
    const result = await client.request(query, { first: 10 });
    console.info(`${command} end`, { ...result });
  } catch (error) {
    console.info(`${command} error`, { error });
  }
};
