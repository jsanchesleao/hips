const AuthenticatedCommand = require('./authenticatedCommand');
const keys = require('../keys');

class GetKeyCommand extends AuthenticatedCommand {
  constructor() {
    super('get-key');
  }

  async doExec(args, out) {
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
    return 'Prints the public key'
  }
}

module.exports = GetKeyCommand;