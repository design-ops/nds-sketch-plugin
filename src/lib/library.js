import { Library, Document } from "sketch";
import { matchScore, getPathTokenAndTheme } from './identifierMatcher'

export const getAllLibraries = () => {
    //  array that will be populated with available libaries to import
    let options = [];
    // Check to see if Library is enabled
    var libraries = Library.getLibraries();

    libraries.forEach(lib => {
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
  let thisToken
  if (thisSymbol.name.charAt(0) == "_") {
    thisToken = thisSymbol.name.substring(1).split('/').slice(-1)
  } else {
    thisToken = thisSymbol.name.split('/').slice(-1)
  }
  return thisToken
}

export const swapTokens = (token, newToken) => {

  const imported = newToken.import()

  if (token.layer.type == "Override" && token.layer.property == "layerStyle") {
    token.layer.value = imported.id
  }

  if (token.layer.type == "Override" && token.layer.property == "textStyle") {
    token.layer.value = imported.id
  }

  if (token.layer.type == "Override" && token.layer.property == "symbolID") {
    token.layer.value = imported.symbolId
  }

  if (token.layer.type == "ShapePath") {
    token.layer.sharedStyleId = imported.id
    token.layer.name = imported.name
    token.layer.style.syncWithSharedStyle(imported)
  }
  if (token.layer.type == "Text") {
    token.layer.sharedStyleId = imported.id
    token.layer.name = imported.name
    token.layer.style.syncWithSharedStyle(imported)
  }

  if (token.layer.type == "SymbolInstance") {
    token.layer.symbolId = imported.symbolId
    token.layer.name = imported.name
    token.layer.resizeWithSmartLayout()
  }

}

export const findTokenMatch = (themeRequired, token, lookupAgainst) => {

  let styleValue
  let currentScore = 0
  let newToken = {}
  for(var styleName in lookupAgainst) {
    styleValue = lookupAgainst[styleName]
    const [, , theme] = getPathTokenAndTheme(styleValue.name)

    if (themeRequired !== null && theme && theme !== themeRequired) continue // Pass in the theme name eg. "dark"

    const getScore = matchScore(token.context.toString(), styleValue.name)
    if (getScore > currentScore) { // Only look for the highest scoring result
      currentScore = getScore
      newToken = styleValue
    }
  }

  return newToken

}

export const resizeTokens = (token) => {
  // console.log(`Resize: ${token.layer.name}`)
  if (token.layer.type == "SymbolInstance") {
    token.resizeWithSmartLayout()
  }
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

// an method that gets all the references (symbols, text styles, layer styles)
// from every library and put them in one object.
export const getAvailableThemeNames = (libraries, document) => {
  let themeNames = new Set()
  libraries.forEach(library => {
      var textStyles = library.getImportableTextStyleReferencesForDocument(document)
      textStyles.forEach(text => {
          if (text.name.indexOf("@") == 0) {
            themeNames.add(text.name.split("/")[0])
          } else {
            themeNames.add("@@default")
          }
      })

      var layerStyles = library.getImportableLayerStyleReferencesForDocument(document)
      layerStyles.forEach(layer => {
        if (layer.name.indexOf("@") == 0) {
          themeNames.add(layer.name.split("/")[0])
        } else {
          themeNames.add("@@default")
        }
      })

      var symbols = library.getImportableSymbolReferencesForDocument(document)
      symbols.forEach(symbol => {
        if (symbol.name.indexOf("@") == 0) {
          themeNames.add(symbol.name.split("/")[0])
        } else {
          themeNames.add("@@default")
        }
      })
  })
  let lookup = []
  // remove @
  themeNames.forEach(name => lookup.push(name.substring(1)))
  // convert @default to empty string / ""
  lookup = lookup.sort().map(name => name === "@default" ? "default" : name);
  return lookup;
}
