const os = require('os');
const path = require('path');
const {writeFile, readFile, fileExist, createDir} = require('./filesystem');

const PUBLIC_KEY = 'key_pub';
const PRIVATE_KEY = 'key';

function getDir() {
  return path.join(os.homedir(), '.hips');
}

function getPublicKeyPath() {
  return path.join(getDir(), PUBLIC_KEY);
}

function getPrivateKeyPath() {
  return path.join(getDir(), PRIVATE_KEY);
}

async function keyExists() {
  const pubExists = await fileExist(getPublicKeyPath());
  const pvtExists = await fileExist(getPrivateKeyPath());

  return pubExists || pvtExists
}

async function saveKeys({publicKey, privateKey}) {
  await createDir(getDir());
  await writeFile(getPublicKeyPath(), publicKey);
  await writeFile(getPrivateKeyPath(), privateKey);
}

async function getPublicKey() {
  return readFile(getPublicKeyPath());
}

async function getPrivateKey() {
  return readFile(getPrivateKeyPath());
}

module.exports = {
  getDir,
  getPrivateKeyPath,
  getPublicKeyPath,
  keyExists,
  saveKeys,
  getPublicKey,
  getPrivateKey
}