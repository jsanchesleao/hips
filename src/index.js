const {Switcher} = require('tbrex');

const CreateKeyCommand = require('./commands/createKey');
const GetKeyCommand = require('./commands/getKey');

const CreateCommand = require('./commands/create');
const ListCommand = require('./commands/list');
const GetCommand = require('./commands/get');
const RemoveCommand = require('./commands/remove');

const app = new Switcher({
  options: {
  'create-key': new CreateKeyCommand(),
  'get-key': new GetKeyCommand(),
  'create': new CreateCommand(),
  'list': new ListCommand(),
  'get': new GetCommand(),
  'remove': new RemoveCommand()
  }
});

module.exports = app;
