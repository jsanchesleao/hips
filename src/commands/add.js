const AuthenticatedCommand = require('./authenticatedCommand');
const persistence = require('../storage/persistence');
const inquirer = require('inquirer');

class AddCommand extends AuthenticatedCommand {

  constructor() {
    super('create');
  }

  async performCreation(args) {
    const {password} = await this.getPassword();

    const passwordParams = {
      manual: true
    };
  
    return persistence.addPassword({
      name: args.name, 
      description: args.description || '', 
      password: password,
      params: passwordParams
    });
  }

  async getPassword() {
    return inquirer.prompt([{
      type: 'input',
      name: 'password',
      message: 'Enter the password to be inserted:\n'
    }]);
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
    return 'Inserts a password manually typed'
  }

}

module.exports = AddCommand;
