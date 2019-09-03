const AuthenticatedCommand = require('./authenticatedCommand');
const persistence = require('../storage/persistence');

class ListCommand extends AuthenticatedCommand {

  constructor() {
    super('list');
  }

  async doExec(args, out) {

    const {passwords} = await persistence.readContent();

    out.send('Saved passwords: \n');

    passwords.forEach(password => {
      out.send(`${password.name} - ${password.description}`);
    });
    
    return this.SUCCESS;
  }

  describe() {
    return 'Displays the names of all saved passwords'
  }

}

module.exports = ListCommand;