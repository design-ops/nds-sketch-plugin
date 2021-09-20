import { Document, Library, UI } from "sketch";
import { getAvailableThemeNames, createTextLayerSymbolLookup, swapTokens, findTokenMatch } from "./lib/library"
import { getIdentifiersIn } from './lib/identifier'
import { getSelectedLayers, getLayersFromAllPages } from './lib/layers'
import { showNativeUI } from './lib/ui-native'

export default function onRun() {
  console.log("------------------------------")
  console.log("[Initialise Plugin]")
  try {
    showSelectLibrary()
  } catch (e){
    if (e instanceof ReferenceError) {
      console.log(`exception thrown: ${e.message} in ${e.fileName} on ${e.lineNumber}`)
      console.log(e.stack.split("\n")) // formats it better as an array :-/
    } else {
      console.log(`exception thrown: ${e}`);
    }
  }
}

const showSelectLibrary = () => {

  console.log("[Get Libraries]")
  let libs = Library.getLibraries()
  let libNames = []

  libs.forEach( lib => {
    if (lib.enabled){
      libNames.push({name: lib.name, id: lib.id, type: lib.libraryType, lastModified: lib.lastModifiedAt})
    }
  })

  console.log("[Show Select Library Window]")

  // display a native UI here...
  const ui = showNativeUI(libNames)
  ui.onLibrarySelected = (library, applyToSelection) => {
    // console.log("librarySelected!", library, applyToSelection)
    const themes = getAvailableThemeNames(Library.getLibraries().filter(library2 => library2.id == library.id), Document.getSelectedDocument())
    ui.updateTextStatus( "Available themes: '" + themes.join("', '")+"'")
    if (themes.length > 1) {
      ui.updateTextStatus("Oh look at you - multiple themes, soon you'll be able to choose one")
      // @TODO show something here to choose subtheme
      processIdentifiers(applyToSelection, library.id, library.name, ui.onProgressUpdate, ui.updateTextStatus)
    } else {
      processIdentifiers(applyToSelection, library.id, library.name, ui.onProgressUpdate, ui.updateTextStatus)
    }
    
  }

}

// TODO - move all of this into it's own module!!

let tokenCount = 0 // Reset Token count
let tokenMissingCount = 0 // Reset Missing Token count
let tokenMissingNames = []
let lookupAgainst = null
let tokens = []
let symbolTokens = []
let styleTokens = []

let progressMethod = (str) => {}

const updateProgress = () => {
  if (tokens.length > 0) progressMethod( (tokenCount + tokenMissingCount) / tokens.length )
}

const processIdentifiers = (applyToSelection, libraryLookupId, libraryName, progress, updateTextStatus) => {

  tokenCount = 0 // Reset Token count
  tokenMissingCount = 0 // Reset Missing Token count
  tokenMissingNames = []
  lookupAgainst = null
  tokens = []
  symbolTokens = []
  styleTokens = []

  progressMethod = progress

  const document = Document.getSelectedDocument()
  let getArtboards;
  if (applyToSelection === true) {

    const targetLayer = getSelectedLayers(document)
    getArtboards = targetLayer.layers.filter(tgt => tgt.type == "Artboard")
  } else {
    // whole document...
    // loop through pages, and then loop through their layers and filter to just Artboards...
    const allLayers = getLayersFromAllPages(document)
    getArtboards = allLayers.filter(tgt => tgt.type == "Artboard")
    // console.log("getArtBoards baby:", getArtboards);
  }
  const lookup = createTextLayerSymbolLookup(Library.getLibraries(), document) // Create Lookup for all Libraries
  lookupAgainst = createTextLayerSymbolLookup(Library.getLibraries().filter(library => library.id == libraryLookupId), document) // Create Lookup for the Selected Library

  console.log("[Get Identifiers]")
  tokens = getIdentifiersIn(getArtboards, lookup)

  // console.log("[Items to replace]")
  console.log("[Replacing Items]")
  symbolTokens = tokens.filter(tk => tk.layer.type == "SymbolInstance" || (tk.layer.type == "Override" && tk.layer.property == "symbolID"))
  styleTokens = tokens.filter(tk => tk.layer.type == "ShapePath" || tk.layer.type == "Text" || (tk.layer.type == "Override" && tk.layer.property == "layerStyle") || (tk.layer.type == "Override" && tk.layer.property == "textStyle"))

  // styleTokens.forEach( token => processStyleToken(token))
  // symbolTokens.forEach( token => processSymbolToken(token) )

  const theme = ""
  // const theme = "dark"

  const interval = setInterval(() => {
    if (!updateNext(theme, updateTextStatus)) {
      finishedProcessing(libraryName)
      console.log("[Operation Complete]")
      clearInterval( interval )
    }
  }, 100)

}

const updateNext = (theme, updateTextStatus) => {
  if (styleTokens.length > 0) {
    const token = styleTokens.pop()
    processStyleToken(theme, token, updateTextStatus)
    return true
  } else if (symbolTokens.length > 0) {
    const token = symbolTokens.pop()
    processSymbolToken(theme, token, updateTextStatus)
    return true
  } else {
    return false
  }
}

const finishedProcessing = (libraryName) => {
   //
  // Sketch UI Message
  let notFound = ''
  if (tokenCount>0) {
    if (tokenMissingCount == 1) {
      notFound = ` 🚨 ${tokenMissingCount} Token match not found!`
    } else if (tokenMissingCount > 1) {
      notFound = ` 🚨 ${tokenMissingCount} Token matches not found!`
    }
    UI.message(`✅ Found ${tokenCount} Tokens to swap from "${libraryName}"!${notFound}`)
    // console.log('\x1b[37m', `\n`, `✅ Found ${tokenCount} Tokens to swap from "${libraryName}"!${notFound}`)
  } else {
    UI.message(`😱 No Tokens found in "${libraryName}"!`)
    // console.log('\x1b[37m', `\n`, `😱 No Tokens found in "${libraryName}"!`)
  }

  if (tokenMissingNames.length > 0) {
    UI.alert('Done, but!', `I did not find these tokens: /n ${tokenMissingNames}`)
  }

}

const processStyleToken = (theme, token, updateTextStatus) => {

  let newToken
  newToken = findTokenMatch(theme, token, lookupAgainst)

  //
  // Token we want to replace
  if (token.layer.type == "Override") {
     // console.log('\x1b[37m', `  [${token.layer.type}: ${token.layer.affectedLayer.type}] [${token.context.toString()}]`) // token [object Object]
     updateTextStatus(`${token.context.toString()}`)
  } else {
     // console.log('\x1b[37m', `  [${token.layer.type}] [${token.context.toString()}]`) // token [object Object]
     updateTextStatus(`${token.context.toString()}`)
  }
  // Token we found that matches
  if (newToken.name != undefined) {
    // console.log('\x1b[37m', `   ∟ [${newToken.name}]`) // newToken [object Object]
    updateTextStatus(`  ∟ ${newToken.name}\n`)
    swapTokens(token, newToken)
    tokenCount++
  } else {
    // console.log('\x1b[31m', `   ∟ [No Match Found!]`)
    updateTextStatus(`  ∟ No Match Found!\n`)
    tokenMissingCount++
    tokenMissingNames.push(token.context.toString())
    // console.log(`   ∟ ${token.context.toString()}`)
  }
  updateProgress()
}

const processSymbolToken = (theme, token, updateTextStatus) => {

  let newToken
  newToken = findTokenMatch(theme, token, lookupAgainst)

  //
  // Token we want to replace
  if (token.layer.type == "Override") {
     // console.log('\x1b[37m', `  [${token.layer.type}: ${token.layer.affectedLayer.type}] [${token.context.toString()}]`) // token [object Object]
     updateTextStatus(`${token.context.toString()}`)
  } else {
     // console.log('\x1b[37m', `  [${token.layer.type}] [${token.context.toString()}]`) // token [object Object]
     updateTextStatus(`${token.context.toString()}`)
  }
  // Token we found that matches
  if (newToken.name != undefined) {
    // console.log('\x1b[37m', `   ∟ [${newToken.name}]`) // newToken [object Object]
    updateTextStatus(`  ∟ ${newToken.name}\n`)
    swapTokens(token, newToken)
    tokenCount++
  } else {
    // console.log('\x1b[31m', `   ∟ [No Match Found!]`)
    updateTextStatus(`  ∟ No Match Found!\n`)
    tokenMissingCount++
    tokenMissingNames.push(token.context.toString())
    // console.log(`   ∟ ${token.context.toString()}`)
  }
  updateProgress()
}
