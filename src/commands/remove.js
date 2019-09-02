const {Command} = require('tbrex');
const generator = require('generate-password');
const persistence = require('../storage/persistence');

class RemoveCommand extends Command {

  async exec(args, out) {

    const name = args.name || args._[0];

    if (!name) {
      out.send('The name parameter is mandatory');
      return this.FAIL;
    }
    
    await persistence.removePassword(name);

    out.send(`Password ${name} removed`);
    return this.SUCCESS;
  }

}

module.exports = RemoveCommand;