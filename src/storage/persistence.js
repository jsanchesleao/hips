const {getConfig} = require('../config');
const {decryptObject, encryptObject} = require('./crypto');

const storages = [
  require('./diskStorage'),
  require('./githubStorage')
];

async function getStorage() {
  const config = await getConfig();
  const storage = storages.find(s => s.name === config.storage);
  return new storage();
}

async function addPassword({name, description, password}) {
  const content = await readContent();
  content.passwords.push({name, description, password});
  await saveContent(content);
}

async function removePassword(name) {
  const content = await readContent();
  content.passwords = content.passwords.filter(p => p.name !== name);
  await saveContent(content);
}

async function readContent() {
  try {
    const storage = await getStorage();
    const config = await getConfig();
  
    const rawContent = await storage.readContent(config.storageConfig[config.storage]);
    const content = await decryptObject(rawContent);
    return content;
  }
  catch(err) {
    return {
      passwords: []
    };
  }
}

async function saveContent(content) {
  const storage = await getStorage();
  const config = await getConfig();

  const encryptedContent = await encryptObject(content);
  await storage.saveContent(config.storageConfig[config.storage], encryptedContent);
}

module.exports = {
  readContent,
  addPassword,
  removePassword,
  storages
}