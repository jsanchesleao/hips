const {Command} = require('tbrex');
const clipboardy = require('clipboardy');
const persistence = require('../storage/persistence');

class GetCommand extends Command {

  async exec(args, out) {

    const name = args._[0];

    const {passwords} = await persistence.readContent();
    const pass = passwords.find(p => p.name === name);

    
    if (args.display) {
      out.send(pass.password);
    }
    else {
      await clipboardy.write(pass.password);
      out.send('Password copied to the clipboard');
    }
    
    return this.SUCCESS;
  }

}

module.exports = GetCommand;