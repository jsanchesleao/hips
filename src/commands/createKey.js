const {Command} = require('tbrex');
const keys = require('../keys');
const {generateKeyPair} = require('../storage/crypto/asymmetric');
const {generateAesKey} = require('../storage/crypto/symmetric');
const {getConfig} = require('../config');

class CreateKeyCommand extends Command {

  constructor() {
    super('create-key');
  }

  async exec(args, out){
    const config = await getConfig();
    if (config.cryptography === 'symmetric') {
      return this.createSymmetricKey(args, out);
    }
    else {
      return this.createAsymmetricKeys(args, out);
    }
  }

  async createSymmetricKey(args, out) {
    const needsForceWrite = await keys.symmetricKeyExists();
    if (needsForceWrite && !args.force) {
      out.send('An existing key is in place. Rerun this command with --force flag to overwrite it.');
      return this.FAIL;
    }
    const key = generateAesKey();
    await keys.saveSymmetricKey(key);
    return this.SUCCESS;
  }

  async createAsymmetricKeys(args, out) {
    const needsForceWrite = await keys.asymmetricKeysExist();
    if (needsForceWrite && !args.force) {
      out.send('An existing key pair is in place. Rerun the command with --force flag to overwrite it.');
      return this.FAIL;
    }

    const keyPair = generateKeyPair();
    await keys.saveAsymmetricKeys(keyPair);
    return this.SUCCESS;
  }

  describe() {
    return 'Generates a new key pair';
  }
}

module.exports = CreateKeyCommand;
