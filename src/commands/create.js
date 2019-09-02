const {Command} = require('tbrex');
const generator = require('generate-password');
const persistence = require('../storage/persistence');

class CreateCommand extends Command {

  async performCreation(args) {
    const passwd = generator.generate({
      length: args.length || 16,
      numbers: true,
      symbols: true,
      exclude: args.exclude || []
    });
    
    return persistence.addPassword({name: args.name, description: args.description || '', password: passwd});
  }

  passwordExists(savedContent, name) {
    return !!savedContent.passwords.find(p => p.name === name);
  }

  async exec(args, out) {

    if (!args.name) {
      out.send('The --name flag is mandatory');
      return this.FAIL;
    }

    const savedContent = await persistence.readContent();
    if (this.passwordExists(savedContent, args.name) && !args.update) {
      out.send('To override an existing password rerun with --update flag');
      return this.FAIL
    }

    if (args.update) {
      await persistence.removePassword(args.name);
    }
    await this.performCreation(args);
    
    out.send('Password created');
    return this.SUCCESS;
  }

  describe() {
    return 'Creates a password and stores it'
  }

}

module.exports = CreateCommand;