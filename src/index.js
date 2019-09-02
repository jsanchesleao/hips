const {Switcher} = require('tbrex');

const CreateKeyCommand = require('./commands/createKey');
const GetKeyCommand = require('./commands/getKey');

const CreateCommand = require('./commands/create');
const ListCommand = require('./commands/list');
const GetCommand = require('./commands/get');
const RemoveCommand = require('./commands/remove');
const ConfigureCommand = require('./commands/configure');

const options = {
  'create-key': new CreateKeyCommand(),
  'get-key': new GetKeyCommand(),
  'create': new CreateCommand(),
  'list': new ListCommand(),
  'get': new GetCommand(),
  'remove': new RemoveCommand(),
  'config': new ConfigureCommand()
  }

const app = new Switcher({
  options: options
});

module.exports = app;
