import yargs from 'yargs';
import dotenv from 'dotenv';
import * as buildCommands from './commands/build';
import * as filesListCommands from './commands/files-list';
import path from 'path';

dotenv.config({
  path: path.resolve(__dirname, '..', '.env'),
});

yargs
  .scriptName('sloppify')
  .usage('$0 <cmd> [args]')
  .showHelpOnFail(true, 'Specify --help for available options')
  .command({ ...buildCommands })
  .command({ ...filesListCommands })
  .env('SHOPIFY')
  .help().argv;
