import path from 'path';
import { ArgumentsCamelCase, CommandBuilder } from 'yargs';
import fs from 'fs';

import Graphql, { Variables } from '../../lib/shopify-graphql';
import filesList from '../queries/files-list.graphql';

interface Arguments {
  shop: string;
  accessToken: string;
  cacheDir: string;
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
  cacheDir: {
    demandOption: false,
    default: path.join(__dirname, '..', '.cache'),
  },
};

const getCacheContents = (filePath: string) => {
  try {
    const current = fs.readFileSync(filePath);
    if (current) {
      return JSON.parse(current.toString());
    }
    return null;
  } catch (error) {
    return null;
  }
};

const addFileContents = (filePath: string, contents: any[]) => {
  const content = getCacheContents(filePath) || [];
  fs.writeFileSync(
    filePath,
    JSON.stringify([...content, ...contents], null, 2)
  );
};

export const handler = async (args: ArgumentsCamelCase<Arguments>) => {
  const { shop, accessToken, cacheDir } = args;
  const cacheFile = path.join(cacheDir, 'files', 'files.json');
  const query = (filesList.loc && filesList.loc.source.body) || '';
  const client = new Graphql({
    url: `https://${shop}/admin/api/2021-10/graphql.json`,
    headers: {
      'X-Shopify-Access-Token': `${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  console.info(`Using cache at: ${cacheFile}`);
  try {
    let result = null;
    const pageSize = 50;
    let lastKey = null;
    while (result === null || result.files.pageInfo.hasNextPage) {
      const variables: Variables =
        lastKey === null
          ? { first: pageSize }
          : { first: pageSize, after: lastKey };
      result = await client.request(query, variables);
      const files = result.files.edges;
      lastKey = files[files.length - 1].cursor;
      await new Promise((resolve) => {
        addFileContents(cacheFile, files);
        setTimeout(() => {
          resolve(true);
        }, 1000);
      });
    }
    console.info(`${command} end`, { filesList });
  } catch (error) {
    console.info(`${command} error`, { error });
  }
};
