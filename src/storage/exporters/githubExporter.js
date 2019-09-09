const Exporter = require('./exporter');
const Gists = require('gists');
const {getConfig} = require('../../config');
const qrcode = require('qrcode-terminal');

class GithubExporter extends Exporter {

  constructor() {
    super();
    this.expositionTime = 60000;
  }

  async expose(masterkey) {
    const data = await this.getEncodedSensitiveData(masterkey);
    const config = await getConfig();
    if (!isUsingGihubStorage(config)) {
      throw new Error('Cannot use GithubExporter without GithubStorage being in use');
    }

    const ghConfig = config.storageConfig['GithubStorage'];

    this.client = new Gists({
      username: ghConfig.username,
      password: ghConfig.password
    });

    const result = await this.client.create({
      description: 'hips.export',
      public: true,
      files: {
        'hips_data': {content: JSON.stringify(data)}
      }
    });

    this.gistId = result.body.id;
    qrcode.generate(`https://jsanchesleao.github.io/hips-web/?gistId=${this.gistId}`);
    console.log('Scan this code to bootstrap the web version. This will be made invalid in one minute');
  }

  async erase() {
    await this.client.delete(this.getGistId());
  }

  getGistId() {
    return this.gistId;
  }

}

function isUsingGihubStorage(config) {
  return config.storage === 'GithubStorage'
}

GithubExporter.description = 'Writes the data to a public Gist';

module.exports = GithubExporter;
