import { ArgumentsCamelCase } from 'yargs';

export const command = 'build';

export const describe = 'Build something';

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
  console.info(`${command}`, { args });
};
