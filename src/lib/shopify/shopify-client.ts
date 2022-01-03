import GraphQL from '../graphql';
import { GraphQLOptions } from '../graphql/graphql';
import { extractGraphQLBody } from '../common';

import filesList from './queries/files-list.graphql';

export type FilesListGetOptions = { first: number; after?: string };

export class ShopifyClient {
  private graphQLClient: GraphQL;

  constructor(options: GraphQLOptions) {
    this.graphQLClient = new GraphQL(options);
  }

  public filesListGet(options: FilesListGetOptions): Promise<FilesListResult> {
    const query = extractGraphQLBody(filesList);
    return this.graphQLClient.request(query, options);
  }
}
