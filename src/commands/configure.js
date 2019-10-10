const {Command} = require('tbrex');
const inquirer = require('inquirer');
const {getConfig, updateConfig} = require('../config');
const {storages} = require('../storage/persistence');


class ConfigureCommand extends Command {

  constructor() {
    super('config');
  }

  chooseStoragePrompt() {
    return inquirer.prompt([{
      type: 'list',
      name: 'storage',
      choices: storages.map(storage => ({name: storage.name, value: storage})).concat('QUIT')
    }]);
  }

  selectStorageConfigPrompt(storage) {
    const instance = new storage();
    const map = instance.configure();
    const questions = [];
    for(let i in map) {
      if (map.hasOwnProperty(i)) {
        questions.push({
          type: 'input',
          name: i
        });
      }
    }
    return inquirer.prompt(questions);
  }

  async interactiveUpdate(out) {
    await this.configureKeyType();
    const {storage} = await this.chooseStoragePrompt();
    if (storage === 'QUIT') {
      return this.SUCCESS;
    }
    const storageConfig = await this.selectStorageConfigPrompt(storage);

    const config = await getConfig();
    config.storage = storage.name;
    config.storageConfig[storage.name] = storageConfig;
    await updateConfig(config);

    out.send(`${config.storage} is configured`);
    return this.SUCCESS;
  }

  async configureKeyType() {
    const config = await getConfig();
    if (config.cryptography === 'unset' || !config.cryptography) {
      const {cryptography} = await this.promptKeyType();
      config.cryptography = cryptography;
      await updateConfig(config);
    }
  }

  async promptKeyType() {
    return inquirer.prompt([{
      type: 'list',
      name: 'cryptography',
      choices: [
        {name: 'Symmetric', value: 'symmetric' },
        {name: 'Asymmetric', value: 'asymmetric' }
      ]
    }]);
  }

  async showConfig(out) {
    const config = await getConfig();
    out.send(JSON.stringify(config, null, '  '));
  }

  async exec(args, out) {

    if(args.read) {
      return this.showConfig(out);
    }
    else {
      return this.interactiveUpdate(out);
    }

  }

  describe() {
    return 'Sets up the persistence strategy'
  }

}

module.exports = ConfigureCommand;
