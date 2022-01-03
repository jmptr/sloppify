import { DocumentNode } from 'graphql';

export const extractGraphQLBody = (node: DocumentNode) => {
  if (node.loc && node.loc.source && node.loc.source.body) {
    return node.loc.source.body;
  }
  throw Error('GraphQL body not found');
};
