import fs from 'fs';

export interface SystemClientOptions {
  cacheDir: string;
}

export class SystemClient {
  private cacheDir: string;

  constructor(options: SystemClientOptions) {
    this.cacheDir = options.cacheDir;
  }

  public getCacheContents<T>(filePath: string): T | null {
    try {
      const current = fs.readFileSync(filePath);
      if (current) {
        return JSON.parse(current.toString());
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  public addFileContents(filePath: string, contents: PageEdge[]) {
    const content = this.getCacheContents<PageEdge[]>(filePath) || [];
    fs.writeFileSync(
      filePath,
      JSON.stringify([...content, ...contents], null, 2)
    );
  }
}
