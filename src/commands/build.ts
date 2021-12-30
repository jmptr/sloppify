import Shopify from '@shopify/shopify-api';
import { ArgumentsCamelCase } from 'yargs';

export interface BuildCommandArgs {
  shop: string;
  accessToken: string;
}

export const buildCommand = async (
  args: ArgumentsCamelCase<BuildCommandArgs>
) => {
  console.info('buildCommand start', { args });
  const { shop, accessToken } = args;
  const client = new Shopify.Clients.Graphql(shop, accessToken);

  try {
    const result = await client.query({
      data: `
      {
        files (first: 100) {
          edges {
            node {
              alt
              createdAt
              fileStatus
              preview {
                image {
                  id
                }
                status
              }
            }
          }
        }
      }`,
    });
    const { body } = result as any;
    if (body && body.errors && body.errors.length > 0) {
      throw body.errors[0];
    }
    const data = body.data;
    console.info('buildCommand end', { result: data });
    for (const item in data.files.edges) {
      const file = data.files.edges[item];
      const {} = file;
      console.info('buildCommand found', { file: JSON.stringify(file) });
    }
  } catch (error) {
    console.error('buildCommand error', { error });
  }
};
