const
    persist    = require('@nrd/fua.module.persistence'),
    dfc        = require('@nrd/fua.module.dfc'),
    context    = require('../data/context.json'),
    factory    = new persist.TermFactory(context),
    dataParser = new dfc.CSVTransformer({
        id:        'colors-parser',
        delimiter: ';',
        headers:   true,
        trim:      true
    }),
    rowParser  = new dfc.Transformer('colors-parser'),
    RDF        = factory.namespace(context.rdf),
    RDFS       = factory.namespace(context.rdfs),
    LDP        = factory.namespace(context.ldp),
    XSD        = factory.namespace(context.xsd),
    DBO        = factory.namespace(context.dbo),
    FUA_COLOR  = factory.namespace(context.fua_color);

dataParser.use(function (source, output, next) {
    output.dataset = new persist.Dataset(null, factory);
    output.dataset.add(factory.quad(
        FUA_COLOR(),
        RDF('type'),
        LDP('Container')
    ));
    output.dataset.add(factory.quad(
        FUA_COLOR(),
        RDFS('label'),
        factory.literal('Colors', 'en')
    ));
    output.dataset.add(factory.quad(
        FUA_COLOR(),
        RDFS('label'),
        factory.literal('Farben', 'de')
    ));
    next();
});

dataParser.use(async function (source, output, next) {
    try {
        for (let row of output.rows) {
            if (!row['Identifier']) continue;
            const rowParam = {
                id:        row['Identifier'].toLowerCase(),
                labelEN:   row['ColorName'],
                colourHex: row['HexValue'].toUpperCase(),
                rgbRed:    row['RedValue'],
                rgbGreen:  row['GreenValue'],
                rgbBlue:   row['BlueValue']
            };
            await rowParser(rowParam, output.dataset);
        }
        next();
    } catch (err) {
        next(err);
    }
});

dataParser.use(function (source, output, next) {
    next(null, output.dataset);
});

rowParser.use(function (source, output, next) {
    output.add(factory.quad(
        FUA_COLOR(source.id),
        RDF('type'),
        LDP('RDFSource')
    ));
    next();
});

rowParser.use(function (source, output, next) {
    output.add(factory.quad(
        FUA_COLOR(),
        LDP('contains'),
        FUA_COLOR(source.id)
    ));
    next();
});

rowParser.use(function (source, output, next) {
    if (source.labelEN) output.add(factory.quad(
        FUA_COLOR(source.id),
        RDFS('label'),
        factory.literal(source.labelEN, 'en')
    ));
    next();
});

rowParser.use(function (source, output, next) {
    if (source.colourHex) output.add(factory.quad(
        FUA_COLOR(source.id),
        DBO('colourHexCode'),
        factory.literal(source.colourHex)
    ));
    next();
});

rowParser.use(function (source, output, next) {
    if (source.rgbRed && source.rgbGreen && source.rgbBlue) {
        output.add(factory.quad(
            FUA_COLOR(source.id),
            DBO('rgbCoordinateRed'),
            factory.literal(source.rgbRed, XSD('integer'))
        ));
        output.add(factory.quad(
            FUA_COLOR(source.id),
            DBO('rgbCoordinateGreen'),
            factory.literal(source.rgbGreen, XSD('integer'))
        ));
        output.add(factory.quad(
            FUA_COLOR(source.id),
            DBO('rgbCoordinateBlue'),
            factory.literal(source.rgbBlue, XSD('integer'))
        ));
    }
    next();
});

rowParser.lock();
module.exports = dataParser.lock();
