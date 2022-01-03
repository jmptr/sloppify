import { ClientError, LeakyBucketError, Variables } from './errors';
import { Fetcher, RawFetcher } from './fetcher';

interface GraphQLOptions {
  fetcher?: Fetcher;
  url: string;
  headers: HeadersInit;
}

class GraphQL {
  private url: string;
  private headers: HeadersInit;
  private fetcher: Fetcher;

  public constructor(options: GraphQLOptions) {
    const { headers, fetcher, url } = options;

    this.url = url;

    this.headers = {
      ...headers,
    };

    if (typeof fetcher !== 'undefined') {
      this.fetcher = fetcher;
    } else {
      this.fetcher = new RawFetcher();
    }
  }

  public async request(query: string, variables?: Variables): Promise<any> {
    const body = JSON.stringify({
      query,
      variables: variables ? variables : undefined,
    });

    const response = await this.fetcher.post(this.url, {
      body,
      headers: this.headers,
    });

    const result = await this.getResult(response);

    if (response.ok && !result.errors && result.data) {
      return result.data;
    } else {
      const errorResult =
        typeof result === 'string' ? { error: result } : result;
      if (response.status === 429) {
        throw new LeakyBucketError(
          { ...errorResult, status: response.status },
          { query, variables },
          0,
          40
        );
      }
      throw new ClientError(
        { ...errorResult, status: response.status },
        { query, variables }
      );
    }
  }

  public withDetailedCost() {
    this.headers = {
      ...this.headers,
      'X-Graphql-Cost-Include-Fields': 'true',
    };
  }

  private async getResult(response: Response): Promise<any> {
    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.startsWith('application/json')) {
      return response.json();
    } else {
      return response.text();
    }
  }
}

export default GraphQL;
