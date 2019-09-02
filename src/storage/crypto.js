const keys = require('../keys');
const NodeRSA = require('node-rsa');

async function getKey() {
  const key = new NodeRSA();
  const privateKeyString = await keys.getPrivateKey();
  const publicKeyString = await keys.getPublicKey();
  key.importKey(privateKeyString);
  key.importKey(publicKeyString);
  return key;
}

async function decryptObject(text) {
  const key = await getKey();
  const decryptedText = key.decrypt(text);
  return JSON.parse(decryptedText);
}

async function encryptObject(object) {
  const key = await getKey();
  return key.encrypt(JSON.stringify(object)).toString('base64');
}

module.exports = {
  decryptObject, encryptObject
}