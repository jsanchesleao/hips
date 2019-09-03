const AuthenticatedCommand = require('./authenticatedCommand');
const generator = require('generate-password');
const persistence = require('../storage/persistence');

class CreateCommand extends AuthenticatedCommand {

  async performCreation(args) {
    const passwordParams = {
      length: args.length || 16,
      numbers: true,
      symbols: true,
      exclude: args.exclude || []
    };
    const passwd = generator.generate(passwordParams);
    
    return persistence.addPassword({
      name: args.name, 
      description: args.description || '', 
      password: passwd,
      params: passwordParams
    });
  }

  passwordExists(savedContent, name) {
    return !!savedContent.passwords.find(p => p.name === name);
  }

  async doExec(args, out) {

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