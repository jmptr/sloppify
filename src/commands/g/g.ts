import { ArgumentsCamelCase } from 'yargs';

import Graphql from '../../lib/shopify-graphql-node';
import filesList from '../queries/files-list.graphql';

export const command = 'g';

export const describe = 'List the files';

export const builder = {
  shop: {
    alias: 's',
    demandOption: true,
    describe: 'Store name',
  },
  accessToken: {
    alias: 't',
    demandOption: true,
    describe: 'Access Token',
  },
};

export interface BuildCommandArgs {
  shop: string;
  accessToken: string;
}

export const handler = async (args: ArgumentsCamelCase<BuildCommandArgs>) => {
  const { shop, accessToken } = args;
  const query = (filesList.loc && filesList.loc.source.body) || '';
  const client = new Graphql(shop, accessToken, 'admin', '2021-10', 0);

  try {
    const result = await client.request(query, { first: 10 });
    console.info(`${command} end`, { ...result });
  } catch (error) {
    console.info(`${command} error`, { error });
  }
};
