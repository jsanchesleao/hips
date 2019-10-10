const {getConfig} = require('../../config');
const {getPrivateKey, getPublicKey, getSymmetricKey} = require('../../keys');
const {pbkdf2, encodeByPassword} = require('../crypto/symmetric');

class Exporter {

  constructor() {
    this.expositionTime = 0;
  }

  async expose(masterkey) {
    throw new Error('Expose method not implemented in Exporter');
  }

  async erase() {
    throw new Error('Erase method not implemented in Exporter');
  }

  async waitExpositionTime() {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, this.expositionTime)
    });
  }

  async getEncodedSensitiveData(masterkey) {
    const sensitiveData = await this.getSensitiveData();
    const {salt, derivedKey} = await pbkdf2(masterkey);
    const {iv, encrypted} = await encodeByPassword(sensitiveData, derivedKey);
    return {
      salt: salt.toString('base64'),
      iv: iv.toString('base64'),
      keys: encrypted.toString('base64')
    };
  }

  async getSensitiveData() {
    const config = await getConfig();
    if (config.cryptography === 'symmetric') {
      const aesKey = await getSymmetricKey();
      return JSON.stringify({aesKey})
    }
    else {
      const privateKey = await getPrivateKey();
      const publicKey = await getPublicKey();
      return JSON.stringify({privateKey, publicKey});
    }
  }

}

module.exports = Exporter;
