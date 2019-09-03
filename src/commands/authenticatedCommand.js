const {Command} = require('tbrex');
const {keyExists} = require('../keys');

class AuthenticatedCommand extends Command {

  async exec(args, out) {
    const haveKeys = await keyExists();
    if (!haveKeys) {
      out.send(this.help());
      return this.FAIL;
    }
    return this.doExec(args, out);
  }

  help() {
    return `
    There is no RSA keys configured. Run "hips help --keys" to find out how to set this up.
    `
  }

}

module.exports = AuthenticatedCommand;