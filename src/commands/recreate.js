const AuthenticatedCommand = require('./authenticatedCommand');
const {readContent, updatePassword} = require('../storage/persistence');
const generator = require('generate-password');

class RecreateCommand extends AuthenticatedCommand {

  describe() {
    return 'Discards previous password and generates another'
  }

  async doExec(args, out) {
    if (args._.length === 0 && !args.all) {
      out.send('Usage: recreate <name> [ --all ]');
      return this.FAIL;
    }
    const content = await readContent();
    const names = args.all ? (content.passwords.map(p => p.name)) : args._;
    
    const passwordsToUpdate = content.passwords.filter(password => names.indexOf(password.name) >= 0);
    await this.recreateAll(passwordsToUpdate);
    return this.SUCCESS;
  }
  
  async recreateAll(passwords) {
    for(let i = 0; i < passwords.length; i++) {
      await this.recreate(passwords[i]);
    }
  }
  
  async recreate(passwordObject) {
    const newPassword = generator.generate(passwordObject.params);
    await updatePassword({...passwordObject, password: newPassword});
  }

}

module.exports = RecreateCommand;