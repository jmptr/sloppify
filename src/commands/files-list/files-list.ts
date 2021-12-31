import { ArgumentsCamelCase } from 'yargs';

import { createGraphqlClient } from '../../lib/create-urql-client';
import filesList from './files-list.graphql';

export const command = 'files-list';

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
  const client = createGraphqlClient({
    shop,
    accessToken,
  });

  const result = await client.query(filesList, { first: 10 }).toPromise();
  console.info('buildCommand end', { ...result });
};
