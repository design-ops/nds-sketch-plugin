import { Document, Library, UI } from "sketch";
import { createTextLayerSymbolLookup, swapTokens, findTokenMatch } from "./lib/library"
import { getIdentifiersIn } from './lib/identifier'
import { getSelectedLayers } from './lib/layers'

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

  console.log("[Get Enabled Libraries]")
  let libs = Library.getLibraries()
  let libNames = []

  libs.forEach( lib => {
    if (lib.enabled){
      libNames.push({name: lib.name, id: lib.id, type: lib.libraryType, lastModified: lib.lastModifiedAt})
    }
  })

  console.log("[Show Select Library Window]")

  // If we use a custom UI, we can remove the trailing characters from the ID.
  UI.getInputFromUser(
    "NDS Theme Replacer",
    {
      description: "Swap out the current theme for a new one.",
      type: UI.INPUT_TYPE.selection,
      possibleValues: libNames.map(el => el.name + " (" + el.id.slice(-6) + ")"),
    },
    (err, value) => {
      if (err) {
        console.log("[Canceled]")
        return
      } else {
        const found = libNames.find(el => el.name + " (" + el.id.slice(-6) + ")" == value)
        console.log(`[Selected Library] - "${found.name} (${found.id.slice(-6)})"`)
        getIdentifiers(found.id, found.name)
      }
    }
  )

}

const getIdentifiers = (libraryLookupId, libraryName) => {

  const document = Document.getSelectedDocument()
  const targetLayer = getSelectedLayers(document)
  const getArtboards = targetLayer.layers.filter(tgt => tgt.type == "Artboard")
  const lookup = createTextLayerSymbolLookup(Library.getLibraries(), document) // Create Lookup for all Libraries
  const lookupAgainst = createTextLayerSymbolLookup(Library.getLibraries().filter(library => library.id == libraryLookupId), document) // Create Lookup for the Selected Library

  var tokenCount = 0 // Reset Token count
  var tokenMissingCount = 0 // Reset Missing Token count
  var tokenMissingNames = []

  console.log("[Get Identifiers]")
  const tokens = getIdentifiersIn(getArtboards, lookup)

  console.log("[Items to replace]")
  let symbolTokens = tokens.filter(tk => tk.layer.type == "SymbolInstance" || (tk.layer.type == "Override" && tk.layer.property == "symbolID"))
  let styleTokens = tokens.filter(tk => tk.layer.type == "ShapePath" || tk.layer.type == "Text" || (tk.layer.type == "Override" && tk.layer.property == "layerStyle") || (tk.layer.type == "Override" && tk.layer.property == "textStyle"))

  styleTokens.forEach( token => {

    let newToken
    newToken = findTokenMatch(token, lookupAgainst)

    //
    // Token we want to replace
    if (token.layer.type == "Override") {
       console.log('\x1b[37m', `  [${token.layer.type}: ${token.layer.affectedLayer.type}] [${token.context.toString()}]`) // token [object Object]
    } else {
       console.log('\x1b[37m', `  [${token.layer.type}] [${token.context.toString()}]`) // token [object Object]
    }
    // Token we found that matches
    if (newToken.name != undefined) {
      console.log('\x1b[37m', `   ∟ [${newToken.name}]`) // newToken [object Object]
      swapTokens(token, newToken)
      tokenCount++
    } else {
      console.log('\x1b[31m', `   ∟ [Not Match Found!]`)
      tokenMissingCount++
      tokenMissingNames.push(token.context.toString())
      // console.log(`   ∟ ${token.context.toString()}`)
    }

  })

  symbolTokens.forEach( token => {

    let newToken
    newToken = findTokenMatch(token, lookupAgainst)

    //
    // Token we want to replace
    if (token.layer.type == "Override") {
       console.log('\x1b[37m', `  [${token.layer.type}: ${token.layer.affectedLayer.type}] [${token.context.toString()}]`) // token [object Object]
    } else {
       console.log('\x1b[37m', `  [${token.layer.type}] [${token.context.toString()}]`) // token [object Object]
    }
    // Token we found that matches
    if (newToken.name != undefined) {
      console.log('\x1b[37m', `   ∟ [${newToken.name}]`) // newToken [object Object]
      swapTokens(token, newToken)
      tokenCount++
    } else {
      console.log('\x1b[31m', `   ∟ [Not Match Found!]`)
      tokenMissingCount++
      tokenMissingNames.push(token.context.toString())
      // console.log(`   ∟ ${token.context.toString()}`)
    }

  })

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
    console.log('\x1b[37m', `\n`, `✅ Found ${tokenCount} Tokens to swap from "${libraryName}"!${notFound}`)
  } else {
    UI.message(`😱 No Tokens found in "${libraryName}"!`)
    console.log('\x1b[37m', `\n`, `😱 No Tokens found in "${libraryName}"!`)
  }

  // if (tokenMissingNames.length > 0) {
  //   UI.alert('Done, but!', `I did not find these tokens: /n ${tokenMissingNames}`)
  // }


  // TODO:
  // Consider adding extensive error message
  // eg. If 'notFound', which Tokens where not found?


}
