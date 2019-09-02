const Storage = require('./storage');
const filesystem = require('../filesystem');
const path = require('path')

class DiskStorage extends Storage {

  configure() {
    return {
      path: 'The path where to write the file on disk'
    }
  }

  async saveContent(config, content){
    await filesystem.createDir(config.path);
    await filesystem.writeFile(path.join(config.path, 'hips_passwords'), content);
  }

  async readContent(config){
    return filesystem.readFile(path.join(config.path, 'hips_passwords'));
  }
}

module.exports = DiskStorage;