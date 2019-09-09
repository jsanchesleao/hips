const {Command} = require('tbrex');
const inquirer = require('inquirer');
const {exposeKeys, getAvailableExporters} = require('../storage/keyTransfer');

const express = require('express');

class ExportKeyCommand extends Command {
  constructor() {
    super('export-keys');
  }

  async exec(args, out) {
    const exporterName = await this.chooseExporter();
    const passwd = await this.getPassphrase();
    await exposeKeys(passwd, exporterName);
  }

  async chooseExporter() {
    const {exporter} = await inquirer.prompt([{
      type: 'list',
      name: 'exporter',
      choices: getAvailableExporters().map(e => ({name: `${e.name} - ${e.description}`, value: e.name}))
    }]);
    return exporter;
  }

  async getPassphrase() {
    const {password} = await inquirer.prompt([{
      type: 'password',
      name: 'password',
      message: "Enter the exported keys' password:"
    }]);
    return password;
  }

  describe() {
    return 'Exports the keys locked with a master password'
  }
}

module.exports = ExportKeyCommand;