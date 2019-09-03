const AuthenticatedCommand = require('./authenticatedCommand');
const clipboardy = require('clipboardy');
const persistence = require('../storage/persistence');

class GetCommand extends AuthenticatedCommand {

  constructor() {
    super('get');
  }

  async doExec(args, out) {

    const name = args._[0];

    if (!name) {
      out.send('Usage: get <name>');
      return this.FAIL;
    }

    const {passwords} = await persistence.readContent();
    const pass = passwords.find(p => p.name === name);

    if (!pass) {
      out.send('Cannot find password');
      return this.FAIL;
    }
    
    if (args.display) {
      out.send(pass.password);
    }
    else {
      await clipboardy.write(pass.password);
      out.send('Password copied to the clipboard');
    }
    
    return this.SUCCESS;
  }

  describe() {
    return 'Retrieves a saved password'
  }
}

module.exports = GetCommand;