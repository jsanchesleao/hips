const {Command} = require('tbrex');
const NodeRSA = require('node-rsa');
const keys = require('../keys');


class CreateKeyCommand extends Command {

  constructor() {
    super('create-key');
  }

  generateKeyPair() {
    const key = new NodeRSA({b: 3072});
    return {
      publicKey: key.exportKey('public'),
      privateKey: key.exportKey('private')
    };
  }

  async exec(args, out){
    const needsForceWrite = await keys.keyExists();
    if (needsForceWrite && !args.force) {
      out.send('An existing key pair is in place. Rerun the command with --force flag to overwrite it.');
      return this.FAIL;
    }
    
    const keyPair = this.generateKeyPair();
    await keys.saveKeys(keyPair);
    return this.SUCCESS;
  }

  describe() {
    return 'Generates a new key pair';
  }
}

module.exports = CreateKeyCommand;
