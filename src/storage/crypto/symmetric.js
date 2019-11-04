const crypto = require('crypto');
const keys = require('../../keys');

function pbkdf2(password) {
  const salt = crypto.randomBytes(16);
  return new Promise(function(resolve, reject) {
    crypto.pbkdf2(password, salt, 10000, 32, 'sha256', function(err, derivedKey) {
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

async function encode(text, key) {
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

function decode(encrypted, key, iv) {
  return new Promise(function(resolve, reject) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let plainText = '';
    decipher.on('readable', () => {
      let chunk;
      while(null !== (chunk = decipher.read())) {
        plainText += chunk.toString('hex');
      }
    });
    decipher.on('end', () => {
      resolve(Buffer.from(plainText, 'hex'));
    });
    decipher.write(encrypted);
    decipher.end();
  });
}

async function encodeByPassword({text, password}) {
  const key = await pbkdf2(password);
  return encode(text, key);
}

function generateAesKey() {
  return crypto.randomBytes(32).toString('base64');
}

async function getKey() {
  const keyString = await keys.getSymmetricKey();
  return Buffer.from(keyString, 'base64');
}

async function encryptObject(object) {
  const text = JSON.stringify(object);
  const key = await getKey();
  const {iv, encrypted} = await encode(text, key);
  const buffer = Buffer.concat([iv, encrypted]);
  return buffer.toString('base64');
}

async function decryptObject(text) {
  const key = await getKey();
  const buffer = Buffer.from(text, 'base64');
  const iv = buffer.slice(0, 16);
  const encrypted = buffer.slice(16);
  const plainText = await decode(encrypted, key, iv);
  return JSON.parse(plainText.toString());
}

module.exports = {
  pbkdf2,
  encode,
  encodeByPassword,
  generateAesKey,
  encryptObject,
  decryptObject
}
