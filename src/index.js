const {Switcher} = require('tbrex');

const CreateKeyCommand = require('./commands/createKey');
const GetKeyCommand = require('./commands/getKey');

const CreateCommand = require('./commands/create');
const RecreateCommand = require('./commands/recreate');
const ListCommand = require('./commands/list');
const GetCommand = require('./commands/get');
const RemoveCommand = require('./commands/remove');
const ConfigureCommand = require('./commands/configure');
const HelpCommand = require('./commands/help');
const MigrateKeysCommand = require('./commands/migrateKey');
const ExportKeyCommand = require('./commands/exportKey');

const PROMPT = `HiPS v0.1.1

Usage: hips <command> [...arguments]

You might want to run "hips help" for a better introduction.
Available Commands:`;

const options = {
  'help': new HelpCommand(),
  'create-key': new CreateKeyCommand(),
  'get-key': new GetKeyCommand(),
  'create': new CreateCommand(),
  'recreate': new RecreateCommand(),
  'list': new ListCommand(),
  'get': new GetCommand(),
  'remove': new RemoveCommand(),
  'config': new ConfigureCommand(),
  'migrate-key': new MigrateKeysCommand(),
  'export-key': new ExportKeyCommand()
  }

const app = new Switcher({
  prompt: PROMPT,
  options: options
});

module.exports = app;
