const {Command} = require('tbrex');
const inquirer = require('inquirer');
const {pbkdf2, encodeByPassword} = require('../storage/crypto');
const {getPrivateKey, getPublicKey} = require('../keys');

const express = require('express');
const cors = require('cors');

class ExportKeyCommand extends Command {
  constructor() {
    super('export-keys');
  }

  async exec(args, out) {
    const sensitiveData = await this.getSensitiveData();
    const passwd = await this.getPassphrase();
    const {salt, derivedKey} = await pbkdf2(passwd);
    const {iv, encrypted} = await encodeByPassword(sensitiveData, derivedKey);

    out.send('We are serving your keys under http://0.0.0.0:8000/keys');
    out.send('The server will be up for a few seconds and you are only allowed to make ONE request to it');

    await this.expose({
      salt: salt.toString('base64'),
      iv: iv.toString('base64'),
      keys: encrypted.toString('base64')
    });
  }

  async getSensitiveData() {
    const privateKey = await getPrivateKey();
    const publicKey = await getPublicKey();
    return JSON.stringify({privateKey, publicKey});
  }

  async getPassphrase() {
    const {password} = await inquirer.prompt([{
      type: 'password',
      name: 'password',
      message: "Enter the exported keys' password:"
    }]);
    return password;
  }

  expose(data) {
    const app = express();
    app.use(cors());
    let sent = false;
    app.get('/keys', function(req, res) {
      if (sent) {
        res.send('Please re-run the command');
        return;
      }
      res.send(data);
      sent = true;
    })
    app.listen(8000);
    return new Promise((resolve, reject) => {
      setTimeout(resolve, 10000);
    });
  }
}

module.exports = ExportKeyCommand;