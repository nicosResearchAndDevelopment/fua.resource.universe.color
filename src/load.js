module.exports = {
    '@context':        'fua.load.rdf',
    'dct:identifier':  __filename,
    'dct:format':      'application/fua.load+js',
    'dct:title':       'load',
    'dct:alternative': '@nrd/fua.resource.universe.color',
    'dct:requires':    [{
        'dct:identifier': '../data/colors.ttl',
        'dct:format':     'text/turtle'
    }]
};
