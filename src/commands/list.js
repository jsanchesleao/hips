const {Command} = require('tbrex');
const persistence = require('../storage/persistence');

class ListCommand extends Command {

  async exec(args, out) {

    const {passwords} = await persistence.readContent();

    out.send('Saved passwords: \n');
    out.send( passwords.map(p => p.name).sort().join('\n') );
    
    return this.SUCCESS;
  }

}

module.exports = ListCommand;