const filesystem = require('./filesystem');
const path = require('path');
const os = require('os');

const EMPTY_CONFIG = {
  storage: 'DiskStorage',
  cryptography: 'unset',
  storageConfig: {
    DiskStorage: {
      path: os.homedir()
    }
  }
};

function getConfigPath() {
  return path.join(os.homedir(), '.hips', 'config.json');
}

async function getConfig() {
  const configsExist = await filesystem.fileExist(getConfigPath());
  if (!configsExist) {
    await createEmptyConfig();
  }
  const text = await filesystem.readFile(getConfigPath());
  return JSON.parse(text);
}

async function createEmptyConfig() {
  await filesystem.createDir(path.join(os.homedir(), '.hips'));
  await filesystem.writeFile(getConfigPath(), JSON.stringify(EMPTY_CONFIG, null, '  '));
}

async function updateConfig(newConfig) {
  await filesystem.writeFile(getConfigPath(), JSON.stringify(newConfig, null, '  '));
}

module.exports = {
  getConfig,
  updateConfig
}
