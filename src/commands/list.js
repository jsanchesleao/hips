const {Command} = require('tbrex');
const persistence = require('../storage/persistence');

class ListCommand extends Command {

  async exec(args, out) {

    const {passwords} = await persistence.readContent();

    out.send('Saved passwords: \n');

    passwords.forEach(password => {
      out.send(`${password.name} - ${password.description}`);
    });
    
    return this.SUCCESS;
  }

}

module.exports = ListCommand;