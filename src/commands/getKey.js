const {Command} = require('tbrex');
const keys = require('../keys');

class GetKeyCommand extends Command {
  constructor() {
    super('get-key');
  }

  async exec(args, out) {
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