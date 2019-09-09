
const {getPrivateKey, getPublicKey} = require('../../keys');
const {pbkdf2, encodeByPassword} = require('../crypto');

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
    const privateKey = await getPrivateKey();
    const publicKey = await getPublicKey();
    const sensitiveData = JSON.stringify({privateKey, publicKey});
    const {salt, derivedKey} = await pbkdf2(masterkey);
    const {iv, encrypted} = await encodeByPassword(sensitiveData, derivedKey);
    
    return {
      salt: salt.toString('base64'),
      iv: iv.toString('base64'),
      keys: encrypted.toString('base64')
    };
  }

}

module.exports = Exporter;