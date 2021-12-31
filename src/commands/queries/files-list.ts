export const filesList = `
query filesList($first: Int) {
  files(first: $first) {
    edges {
      node {
        alt
        createdAt
        fileStatus
        preview {
          image {
            altText
            width
            height
          }
          status
        }
      }
    }
  }
}
`;
