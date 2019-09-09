const Storage = require('./storage');
const Gists = require('gists');
const {getConfig, updateConfig} = require('../../config');

class GithubStorage extends Storage {

  configure() {
    return {
      username: 'Github username',
      password: 'Github account password'
    };
  }

  prepareClient(config) {
    return new Gists({
      username: config.username,
      password: config.password
    });
  }

  async getGistId() {
    const {storageConfig} = await getConfig();
    const config = storageConfig.GithubStorage;
    if (config.gistId) {
      return config.gistId;
    }
    else {
      const base = await this.findBaseGist(config);
      if (base) {
        return base.id;
      }
      return null;
    }
  }

  async saveGistId() {
    const gistId = await this.getGistId();
    if (!gistId) {
      return;
    }

    const globalConfig = await getConfig();
    globalConfig.storageConfig.GithubStorage.gistId = gistId;
    await updateConfig(globalConfig);
  }

  async findBaseGist(config) {
    const client = await this.prepareClient(config);
    const result = await client.list(config.username);
    return result.body.find(gist => gist.description.match(/^hips.storage$/));
  }

  async createGist(config, content) {
    const client = await this.prepareClient(config);
    await client.create({
      description: 'hips.storage',
      public: false,
      files: {
        'hips_passwords': {content: content}
      }
    });
    await this.saveGistId();
  }

  async updateGist(gistId, config, content) {
    const client = await this.prepareClient(config);
    await client.edit(gistId, {
      description: 'hips.storage',
      files: {
        'hips_passwords': {content: content}
      }
    });
    if (!config.gistId) {
      await this.saveGistId();
    }
  }

  async saveContent(config, content){
    const gistId = await this.getGistId();
    if (gistId) {
      await this.updateGist(gistId, config, content);
    }
    else {
      await this.createGist(config, content);
    }
  }

  async readContent(config){
    const client = await this.prepareClient(config);
    const id = await this.getGistId();
    const gist = await client.get(id);
    return gist.body.files.hips_passwords.content; 
  }

}

module.exports = GithubStorage;