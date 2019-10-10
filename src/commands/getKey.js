const AuthenticatedCommand = require('./authenticatedCommand');
const keys = require('../keys');
const {getConfig} = require('../config');

class GetKeyCommand extends AuthenticatedCommand {
  constructor() {
    super('get-key');
  }

  async doExec(args, out) {
    const config = await getConfig();
    if (config.cryptography === 'symmetric') {
      return this.getSymmetricKey(args, out);
    }
    else {
      return this.getAsymmetricKey(args, out);
    }
  }

  async getSymmetricKey(args, out) {
    const aesKey = await keys.getSymmetricKey();
    out.send(aesKey);
    return this.SUCCESS;
  }

  async getAsymmetricKey(args, out) {
    if (args['private']) {
      const privateKey = await keys.getPrivateKey();
      out.send(privateKey);
    }
    else {
      const publicKey = await keys.getPublicKey();
      out.send(publicKey);
    }

    return this.SUCCESS;
  }

  describe() {
    return 'Prints cryptography keys'
  }
}

module.exports = GetKeyCommand;
