const {Command} = require('tbrex');
const {symmetricKeyExists, asymmetricKeysExist} = require('../keys');

const {getConfig} = require('../config');

class AuthenticatedCommand extends Command {

  constructor(name) {
    super(name);
  }

  async exec(args, out) {
    const haveKeys = await this.keyExists();
    if (!haveKeys) {
      out.send(this.help());
      return this.FAIL;
    }
    return this.doExec(args, out);
  }

  async keyExists() {
    const config = await getConfig();
    if (config.cryptography === 'symmetric') {
      return symmetricKeyExists();
    }
    else {
      return asymmetricKeysExist();
    }
  }

  help() {
    return `
    There is no cryptography keys configured. Run "hips help --keys" to find out how to set this up.
    `
  }

}

module.exports = AuthenticatedCommand;
