import { Document, Library } from "sketch";
import { createTextLayerSymbolLookup } from "./lib/library"
import { createUI, closeUI, commandToUI } from './lib/ui'
import { getIdentifiersIn } from './lib/identifier'
import { getSelectedLayers } from './lib/layers'
import { FixedSizeContext } from './lib/context'

const UIIdentifier = 'switchthemelibrary.webview'

export default function onRun() {
  console.log("[Start Switch Theme Library Plugin] !!")
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
  closeUI(UIIdentifier)
  createUI(UIIdentifier, {
    onLoad: () => {
      showSelectLibrary()
    },
    onSelectLibrary: (l) => {
      console.log(`Selected library with id '${l}'`)
      getIdentifiers()
    }
  })
}

const showSelectLibrary = () => {
  console.log("showSelectLibrary")
  let libs = Library.getLibraries()
  let libNames = []
  libs.forEach( lib => {
    if (lib.enabled){
      // console.log(lib)
      libNames.push({name: lib.name, id: lib.id})
    }
  })
  commandToUI(UIIdentifier, "showSelectLibrary", libNames)
}

const getIdentifiers = () => {
  FixedSizeContext.validNumberOfSegments = 4
  const document = Document.getSelectedDocument()
  const targetLayer = getSelectedLayers(document)
  const lookup = createTextLayerSymbolLookup(Library.getLibraries(), document)
  console.log("getIdentifiers - getIdentifiersIn")
  const ids = getIdentifiersIn(targetLayer, lookup)
  console.log("// items to replace -----------------------------------------------------------------")
  ids.forEach( item => {
    console.log(`${item.context.toString()} >> ${item.layer.type}`)
  })
}

// When the plugin is shutdown by Sketch (for example when the user disable the plugin)
// we need to close the webview if it's open
export function onShutdown() {
  closeUI(UIIdentifier)
}
