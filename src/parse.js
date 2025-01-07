const
  util = require('@fua/core.util'),
  path = require('path'),
  fs = require('fs/promises'),
  rdf = require('@fua/module.rdf'),
  dataParser = require('./parser.js'),
  inputFile = path.join(__dirname, '../data/colors.csv'),
  outputFile = path.join(__dirname, '../data/colors.ttl');

fs.readFile(inputFile, 'utf-8')
  .then(dataParser)
  .then(dataset => rdf.serializeDataset(dataset, 'text/turtle'))
  .then(output => fs.writeFile(outputFile, output))
  .then(util.logDone)
  .catch(util.logError);
