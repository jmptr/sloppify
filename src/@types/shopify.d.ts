interface PageNode {
  alt: string;
  createdAt: string;
  fileStatus: string;
  id?: string;
  url?: string;
  image?: {
    originalSrc: string;
  };
}

interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface PageEdge {
  cursor: string;
  node: PageNode;
}

interface FileConnection {
  files: {
    pageInfo: PageInfo;
    edges: PageEdge[];
  };
}

interface FilesListResult {
  files: {
    pageInfo: {
      hasNextPage: boolean;
    };
    edges: {
      cursor: string;
      node: {
        alt: string;
        createdAt: string;
        fileStatus: string;
        id?: string;
        url?: string;
        image?: {
          originalSrc: string;
        };
      };
    }[];
  };
}
