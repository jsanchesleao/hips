const Exporter = require('./exporter');
const express = require('express');
const cors = require('cors');

class HttpExporter extends Exporter {
  constructor() {
    super();
    this.expositionTime = 20000;
  }

  async expose(masterkey) {
    const data = await this.getEncodedSensitiveData(masterkey);
    const app = express();

    app.use(cors());
    app.get('/keys', (req, res) => {
      res.send(data);
    });
    this.server = app.listen(8000);
    console.log('Serving your keys on http://0.0.0.0:8000/keys');
  }

  async erase() {
    console.log('Stopping the server');
    this.server.close();
  }
  
}

HttpExporter.description = 'Exposes the keys with a temporary HTTP server';

module.exports = HttpExporter;