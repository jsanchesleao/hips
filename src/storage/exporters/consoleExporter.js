const Exporter = require('./exporter');

class ConsoleExporter extends Exporter {

  constructor() {
    super();
    this.expositionTime = 2000;
  }

  async expose(masterkey) {
    const data = await this.getEncodedSensitiveData(masterkey);
    console.log(data);
  }

  async erase() {
    console.log('clear the console now');
  }

}

ConsoleExporter.description = 'Writes the data to the console';

module.exports = ConsoleExporter;