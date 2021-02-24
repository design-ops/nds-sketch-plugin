import { Document, Library, UI } from "sketch";
import { createTextLayerSymbolLookup } from "./lib/library"
import { getIdentifiersIn } from './lib/identifier'
import { getSelectedLayers } from './lib/layers'
import { matchScore } from './lib/identifierMatcher'

// const UIIdentifier = 'switchthemelibrary.webview'

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
    "Select a Theme Library",
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

const getIdentifiers = (libraryLookupID, libraryName) => {

  const document = Document.getSelectedDocument()
  const targetLayer = getSelectedLayers(document)
  const lookup = createTextLayerSymbolLookup(Library.getLibraries(), document) // Create Lookup for all Libraries
  const lookupAgainst = createTextLayerSymbolLookup(Library.getLibraries().filter(library => library.id == libraryLookupID), document) // Create Lookup for the Selected Library

  var tokenCount = 0 // Reset Token count
  var tokenMissingCount = 0 // Reset Missing Token count

  console.log("[Get Identifiers]")
  const tokens = getIdentifiersIn(targetLayer, lookup)

  console.log("[Items to replace]")
  tokens.forEach( token => {

    var styleValue
    var currentScore = 0
    var newToken = {}
    let notFound = ''
    for(var styleName in lookupAgainst) {
      styleValue = lookupAgainst[styleName]
      const getScore = matchScore(token.context.toString(), styleValue.name)

      if (getScore > currentScore) {
        currentScore = getScore
        newToken = styleValue
      }

    }

    //
    // This is where the actual swapping should take place
    //


    // Token we want to replace
    if (token.layer.type == "Override") {
       console.log(`  [${token.layer.type}: ${token.layer.affectedLayer.type}] [${token.context.toString()}]`)
    } else {
       console.log(`  [${token.layer.type}] [${token.context.toString()}]`)
    }

    // Token we found that matches
    if (newToken.name != undefined) {
      console.log(`   ∟ [${newToken.name}]`)
      tokenCount++
    } else {
      tokenMissingCount++
    }

    // We need to replace 'token' with 'newToken'
    if (tokenCount>0) {
      if (tokenMissingCount == 1) {
        notFound = ` 🚨 ${tokenMissingCount} Token not found!`
      } else if (tokenMissingCount > 1) {
        notFound = ` 🚨 ${tokenMissingCount} Tokens not found!`
      }
      UI.message(`✅ Succesfully switched ${tokenCount} Tokens to "${libraryName}"!${notFound}`)
    } else {
      UI.message(`✅ No Tokens found in "${libraryName}"!`)
    }

  })
}
