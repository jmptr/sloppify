import { ArgumentsCamelCase, CommandBuilder } from 'yargs';

interface Arguments {
  shop: string;
  accessToken: string;
}

export const command = 'build';

export const describe = 'Build something';

export const builder: CommandBuilder<unknown, Arguments> = {
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

export const handler = async (args: ArgumentsCamelCase<Arguments>) => {
  console.info(`${command}`, { args });
};
