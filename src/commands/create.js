const {Command} = require('tbrex');
const generator = require('generate-password');
const persistence = require('../storage/persistence');

class CreateCommand extends Command {

  async exec(args, out) {

    if (!args.name) {
      out.send('The --name flag is mandatory');
      return this.FAIL;
    }

    const passwd = generator.generate({
      length: args.length || 16,
      numbers: true,
      symbols: true,
      exclude: args.exclude || []
    });
    
    await persistence.addPassword({name: args.name, description: args.description || '', password: passwd});

    out.send(passwd);
    return this.SUCCESS;
  }

}

module.exports = CreateCommand;