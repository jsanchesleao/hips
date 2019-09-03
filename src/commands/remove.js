const AuthenticatedCommand = require('./authenticatedCommand');
const persistence = require('../storage/persistence');

class RemoveCommand extends AuthenticatedCommand {

  async doExec(args, out) {

    const name = args.name || args._[0];

    if (!name) {
      out.send('The name parameter is mandatory');
      return this.FAIL;
    }
    
    await persistence.removePassword(name);

    out.send(`Password ${name} removed`);
    return this.SUCCESS;
  }

  describe() {
    return 'Deletes a saved password';
  }

}

module.exports = RemoveCommand;