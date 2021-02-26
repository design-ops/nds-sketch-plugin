import { Library, Document } from "sketch";

export const getAllLibraries = () => {
    //  array that will be populated with available libaries to import
    let options = [];
    // Check to see if Library is enabled
    var libraries = Library.getLibraries();

    libraries.forEach(lib => {
        // @TODO filter out inactive libraries
        options.push(lib.name);
    });

    return options
}

export const getLibraryByName = (name) => {
    var selectedLibrary = null;
    var libraries = Library.getLibraries();
    libraries.forEach(lib => {
        if (lib.name.includes(name)) {
            selectedLibrary = lib;
        }
    })
    return selectedLibrary
}

export const getSymbolFromDocument = (id) => {
  let thisDocument = Document.getSelectedDocument()
  let getSymbols = thisDocument.getSymbols()
  let thisSymbol = getSymbols.find(el => el.symbolId == id)
  let thisToken = thisSymbol.name.split('/').slice(-1)
  return thisToken
}

// an method that gets all the references (symbols, text styles, layer styles)
// from every library and put them in one object.
export const createTextLayerSymbolLookup = (libraries, document) => {
    let lookup = {}
    libraries.forEach(library => {
        var textStyles = library.getImportableTextStyleReferencesForDocument(document)
        textStyles.forEach(text => {
            lookup[text.id] = text;
        })

        var layerStyles = library.getImportableLayerStyleReferencesForDocument(document)
        layerStyles.forEach(layer => {
            lookup[layer.id] = layer;
        })

        var symbols = library.getImportableSymbolReferencesForDocument(document)
        symbols.forEach(symbol => {
            lookup[symbol.id] = symbol;
        })
    })
    return lookup;
}
