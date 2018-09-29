import validator from 'api-blueprint-validator-module';
import yargs from 'yargs';

const argv = yargs.usage('Usage: $0 --files [str]').demand(['files']).argv;

(({files, failOnWarnings = true}: any = {}) => validator.parseAndValidateFiles(files, failOnWarnings))(argv);
