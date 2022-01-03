import path from 'path';
import { ArgumentsCamelCase, CommandBuilder } from 'yargs';

import { SystemClient } from '../../lib/system';
import { ShopifyClient, FilesListGetOptions } from '../../lib/shopify';
import { logger } from '../../lib/system';

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

export const handler = async (args: ArgumentsCamelCase<Arguments>) => {
  const { shop, accessToken, cacheDir } = args;
  const cacheFile = path.join(cacheDir, 'files', 'files.json');
  const systemClient = new SystemClient({
    cacheDir,
  });
  const shopifyClient = new ShopifyClient({
    url: `https://${shop}/admin/api/2021-10/graphql.json`,
    headers: {
      'X-Shopify-Access-Token': `${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  logger.info(`Using cache at: ${cacheFile}`);
  const pageSize = 50;
  let waitForNext = false;
  const cacheContent = systemClient.getCacheContents<PageEdge[]>(cacheFile);
  let cursor: string | null | undefined = cacheContent
    ? cacheContent[cacheContent.length - 1].cursor
    : null;

  while (cursor !== undefined) {
    const variables: FilesListGetOptions =
      cursor === null
        ? { first: pageSize }
        : { first: pageSize, after: cursor };

    try {
      const result = await shopifyClient.filesListGet(variables);
      const files = result.files.edges;
      systemClient.addFileContents(cacheFile, files);

      if (result.files.pageInfo.hasNextPage) {
        cursor = files[files.length - 1].cursor;
      } else {
        break;
      }
    } catch (error) {
      const { response } = error as any;
      if (
        response &&
        response.errors &&
        response.errors.find((e: any) => e.code === 'THROTTLED')
      ) {
        logger.error(`${command} LeakyBucket error`);
        waitForNext = true;
      } else {
        logger.error(`${command} error`, { error });
        break;
      }
    }

    if (waitForNext) {
      logger.info(`${command} waiting.`);
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, 1000);
      });
    }
  }
  logger.info(`${command} done`);
};
