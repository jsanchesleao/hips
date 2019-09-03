const AuthenticatedCommand = require('./authenticatedCommand');
const NodeRSA = require('node-rsa');
const {readContent, saveContent} = require('../storage/persistence');
const keys = require('../keys');
const inquirer = require('inquirer');


class MigrateKeyCommand extends AuthenticatedCommand {

  constructor() {
    super('migrate-key');
  }

  generateKeyPair() {
    const key = new NodeRSA({b: 3072});
    return {
      publicKey: key.exportKey('public'),
      privateKey: key.exportKey('private')
    };
  }

  async getConfirmation() {
    return inquirer.prompt([{
      type: 'input',
      name: 'confirmation',
      message: 'To really migrate the keys type "migrate" and press enter:\n'
    }]);
  }

  async exec(args, out){

    if (!args.force) {
      const {confirmation} = await this.getConfirmation();
      if (confirmation !== 'migrate') {
        out.send('Key migration was cancelled.');
        return this.SUCCESS;
      }
    }
    
    const content = await readContent();
    const keyPair = this.generateKeyPair();
    await keys.saveKeys(keyPair);
    await saveContent(content);

    out.send('Keys migrated successfully');
    return this.SUCCESS;
  }

  describe() {
    return 'Changes the RSA keys keeping the passwords';
  }
}

module.exports = MigrateKeyCommand;
