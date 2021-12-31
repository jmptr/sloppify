import yargs from 'yargs';
import { build, filesList } from './commands';

yargs
  .scriptName('sloppify')
  .usage('$0 <cmd> [args]')
  .showHelpOnFail(true, 'Specify --help for available options')
  .command(build)
  .command(filesList)
  .env('SHOPIFY')
  .help().argv;
