const os = require('os');
const path = require('path');
const {writeFile, readFile, fileExist, createDir} = require('./filesystem');

const PUBLIC_KEY = 'key_pub';
const PRIVATE_KEY = 'key';
const SYMMETRIC_KEY = 'aes_key';

function getDir() {
  return path.join(os.homedir(), '.hips');
}

function getPublicKeyPath() {
  return path.join(getDir(), PUBLIC_KEY);
}

function getPrivateKeyPath() {
  return path.join(getDir(), PRIVATE_KEY);
}

function getSymmetricKeyPath() {
  return path.join(getDir(), SYMMETRIC_KEY);
}

async function asymmetricKeysExist() {
  const pubExists = await fileExist(getPublicKeyPath());
  const pvtExists = await fileExist(getPrivateKeyPath());

  return pubExists || pvtExists
}

async function symmetricKeyExists() {
  return await fileExist(getSymmetricKeyPath());
}

async function saveAsymmetricKeys({publicKey, privateKey}) {
  await createDir(getDir());
  await writeFile(getPublicKeyPath(), publicKey);
  await writeFile(getPrivateKeyPath(), privateKey);
}

async function saveSymmetricKey(key) {
  await createDir(getDir());
  await writeFile(getSymmetricKeyPath(), key);
}

async function getPublicKey() {
  return readFile(getPublicKeyPath());
}

async function getPrivateKey() {
  return readFile(getPrivateKeyPath());
}

async function getSymmetricKey() {
  return readFile(getSymmetricKeyPath());
}

module.exports = {
  getDir,
  getPrivateKeyPath,
  getPublicKeyPath,
  getSymmetricKeyPath,
  asymmetricKeysExist,
  symmetricKeyExists,
  saveSymmetricKey,
  saveAsymmetricKeys,
  getPublicKey,
  getPrivateKey,
  getSymmetricKey
}
