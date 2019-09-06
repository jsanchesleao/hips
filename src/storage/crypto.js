const keys = require('../keys');
const NodeRSA = require('node-rsa');
const crypto = require('crypto');
const PBKDF2 = require('pbkdf2');

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

function pbkdf2(password) {
  const salt = crypto.randomBytes(16);
  return new Promise(function(resolve, reject) {
    PBKDF2.pbkdf2(password, salt, 10000, 32, 'sha256', function(err, derivedKey) {
      if (err) {
        reject(err);
      }
      else {
        resolve({
          salt, derivedKey
        });
      }
    });
  });
}

function convertToBytes(text) {
  if (aesjs.utils.utf8.toBytes(text).length % 16 === 0) {
    return aesjs.utils.utf8.toBytes(text);
  }
  else {
    const padding = 16 - (aesjs.utils.utf8.toBytes(text).length % 16);
    return convertToBytes(text + Buffer.alloc(padding, 0).toString('utf-8'))
  }
}

async function encodeByPassword(text, key) {
  const iv = crypto.randomBytes(16);
  return new Promise(function(resolve, reject) {
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = '';
    cipher.on('readable', () => {
      let chunk;
      while (null !== (chunk = cipher.read())) {
        encrypted += chunk.toString('hex');
      }
    });
    cipher.on('end', () => {
      resolve({
        iv,
        encrypted: Buffer.from(encrypted, 'hex')
      });
    });
    cipher.write(text);
    cipher.end();
  });
}

module.exports = {
  decryptObject,
  encryptObject,
  pbkdf2,
  encodeByPassword
}