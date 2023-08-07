const
    {describe, test} = require('mocha'),
    expect           = require('expect'),
    {loadDataFiles}  = require('@nrd/fua.module.rdf'),
    {Dataset}        = require('@nrd/fua.module.persistence'),
    resource         = require('../src/load.js');

describe('resource.universe.color', function () {

    this.timeout(0);

    test('should load resource with rdf-module', async function () {
        const dataFiles = await loadDataFiles(resource);
        expect(dataFiles.length).toBeGreaterThan(0);

        const data = new Dataset();
        dataFiles
            .map(({dataset}) => dataset)
            .filter(dataset => dataset)
            .forEach(dataset => data.add(dataset));
        expect(data.size).toBeGreaterThan(0);

        console.log('quads:', data.size);
        debugger;
    });

});
