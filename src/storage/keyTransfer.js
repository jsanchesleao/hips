const exporters = [
  require('./exporters/consoleExporter'),
  require('./exporters/httpExporter'),
  require('./exporters/githubExporter')
];

async function exposeKeys(masterkey, exporterName) {
  const exporter = createExporter(exporterName);
  await exporter.expose(masterkey);
  await exporter.waitExpositionTime();
  await exporter.erase();
}

function getAvailableExporters() {
  return exporters.map(e => ({
    name: e.name,
    description: e.description
  }));
}

function createExporter(name) {
  const Exporter = exporters.find(e => e.name === name);
  if (Exporter) {
    return new Exporter();
  }
  throw new Error(`Cannot find exporter ${name}`);
}

module.exports = {
  getAvailableExporters, exposeKeys
};