
const fs = require('fs');
const mkdirp = require('mkdirp');

function fileExist(filePath) {
  return new Promise((resolve, reject) => {
    fs.access(filePath, fs.F_OK, (err) => {
      if (err) {
        resolve(false);
     }
     else {
        resolve(true);
     }
    })
  });
}

function createDir(dirPath) {
  return new Promise(function(resolve, reject) {
    mkdirp(dirPath, function(err) {
      if (err) { reject(err)}
      else { resolve() }
    });
  });
}

function writeFile(filepath, content) {
  return new Promise(function(resolve, reject) {
    fs.writeFile(filepath, content, function(err) {
      if (err) {
        reject(err);
      }
      else {
        resolve();
      }
    })
  });
}

function readFile(filepath) {
  return new Promise(function(resolve, reject) {
    fs.readFile(filepath, function(err, data) {
      if (err) {
        reject(err);
      }
      else {
        resolve(data.toString());
      }
    });
  });
}

module.exports = {
  fileExist,
  createDir,
  readFile,
  writeFile
}