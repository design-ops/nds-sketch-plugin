import { Document, Library, UI } from "sketch";
import { createTextLayerSymbolLookup } from "./lib/library"
import { getIdentifiersIn } from './lib/identifier'
import { getSelectedLayers } from './lib/layers'

const UIIdentifier = 'switchthemelibrary.webview'

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
      console.log(" - " + lib.name + " (" + lib.id.slice(-6) + ")")
      libNames.push({name: lib.name, id: lib.id, type: lib.libraryType})
    }
  })

  console.log("[Show Select Library]")

  UI.getInputFromUser(
    "Select a Theme Library",
    {
      description: "Swap out the current theme for a new one.",
      type: UI.INPUT_TYPE.selection,
      possibleValues: libNames.map(el => el.name + " (" + el.id.slice(-6) + ")"),
    },
    (err, value) => {
      if (err) {
        // most likely the user canceled the input
        console.log("[Canceled]")
        return
      } else {
        const found = libNames.find(el => el.name + " (" + el.id.slice(-6) + ")" == value)
        console.log("[Selected Library: " + found.name + " ("+ found.id.slice(-6) +")]")

        getIdentifiers()
      }
    }
  )
}

const getIdentifiers = () => {
  const document = Document.getSelectedDocument()
  const targetLayer = getSelectedLayers(document)
  const lookup = createTextLayerSymbolLookup(Library.getLibraries(), document)
  console.log("[getIdentifiers - getIdentifiersIn]")
  const ids = getIdentifiersIn(targetLayer, lookup)
  console.log("/// items to replace -----------------------------------------------------------------")
  ids.forEach( item => {
    console.log(`${item.context.toString()} >> ${item.layer.type}`)
  })
}
