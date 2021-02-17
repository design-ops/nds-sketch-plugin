import { Document, Library, UI } from "sketch";
import { createTextLayerSymbolLookup } from "./lib/library"
import { createUI, closeUI, commandToUI } from './lib/ui'
import { getIdentifiersIn } from './lib/identifier'
import { getSelectedLayers } from './lib/layers'

const UIIdentifier = 'switchthemelibrary.webview'

export default function onRun() {
  console.log("------------------------------")
  console.log("[Initialise Plugin]")
  try {
    startPlugin();
  } catch (e){
    if (e instanceof ReferenceError) {
      console.log(`exception thrown: ${e.message} in ${e.fileName} on ${e.lineNumber}`)
      console.log(e.stack.split("\n")) // formats it better as an array :-/
    } else {
      console.log(`exception thrown: ${e}`);
    }
  }
}

function startPlugin() {
  showSelectLibrary()
  // closeUI(UIIdentifier)
  // createUI(UIIdentifier, {
  //   onLoad: () => {
  //     showSelectLibrary()
  //   },
  //   onSelectLibrary: (l) => {
  //     console.log(`Selected library with id '${l}'`)
  //     getIdentifiers()
  //   }
  // })
}

const showSelectLibrary = () => {

  console.log("[Get Enabled Libraries]")
  let libs = Library.getLibraries()
  let libNames = []
  libs.forEach( lib => {
    if (lib.enabled){
      console.log(" - " + lib.name + " (" + lib.id + ")")
      libNames.push({name: lib.name, id: lib.id, type: lib.libraryType})
    }
  })

  console.log("[Show Select Library]")

  UI.getInputFromUser(
    "Select a Theme Library",
    {
      description: "Swap out the current theme for a new one.",
      type: UI.INPUT_TYPE.selection,
      possibleValues: libNames.map(el => el.name),
    },
    (err, value) => {
      if (err) {
        // most likely the user canceled the input
        console.log("[Canceled]")
        return
      } else {
        const found = libNames.find(el => el.name == value)
        console.log("[Selected Library: " + found.name + " ("+ found.id +")]")
      }
    }
  )

  //
  // let libs = Library.getLibraries()
  // let libNames = []
  // libs.forEach( lib => {
  //   if (lib.enabled){
  //     // console.log(lib)
  //     libNames.push({name: lib.name, id: lib.id})
  //   }
  // })
  // commandToUI(UIIdentifier, "showSelectLibrary", libNames)
}

const getIdentifiers = () => {
  const document = Document.getSelectedDocument()
  const targetLayer = getSelectedLayers(document)
  const lookup = createTextLayerSymbolLookup(Library.getLibraries(), document)
  console.log("getIdentifiers - getIdentifiersIn")
  const ids = getIdentifiersIn(targetLayer, lookup)
  console.log("/// items to replace -----------------------------------------------------------------")
  ids.forEach( item => {
    console.log(`${item.context.toString()} >> ${item.layer.type}`)
  })
}

// When the plugin is shutdown by Sketch (for example when the user disable the plugin)
// we need to close the webview if it's open
export function onShutdown() {
  closeUI(UIIdentifier)
}
