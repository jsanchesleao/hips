const AuthenticatedCommand = require('./authenticatedCommand');
const {readContent, saveContent} = require('../storage/persistence');
const keys = require('../keys');
const {generateKeyPair} = require('../storage/crypto/asymmetric');
const {generateAesKey} = require('../storage/crypto/symmetric');
const {getConfig} = require('../config');
const inquirer = require('inquirer');


class MigrateKeyCommand extends AuthenticatedCommand {

  constructor() {
    super('migrate-key');
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
    await this.changeKeys();
    await saveContent(content);

    out.send('Keys migrated successfully');
    return this.SUCCESS;
  }

  async changeKeys() {
    const config = await getConfig();
    if(config.cryptography === 'symmetric') {
      const key = generateAesKey()
      await keys.saveSymmetricKey(key);
    }
    else {
      const keyPair = generateKeyPair();
      await keys.saveAsymmetricKeys(keyPair);
    }
  }

  describe() {
    return 'Changes the RSA keys keeping the passwords';
  }
}

module.exports = MigrateKeyCommand;
