import { Document, Library } from "sketch";
import { createTextLayerSymbolLookup } from "./lib/library"
import { createUI, closeUI, commandToUI } from './lib/ui'
import { getIdentifiersIn } from './lib/identifier'
import { getSelectedLayers } from './lib/layers'
import { Context } from './lib/context'

const UIIdentifier = 'switchthemelibrary.webview'

export default function onRun() {
  console.log("onRun....")
  
  closeUI(UIIdentifier)
  createUI(UIIdentifier, {
    onLoad: () => {
      showSelectLibrary()
    },
    onSelectLibrary: (l) => {
      getIdentifiers()
    }
  })
}

const showSelectLibrary = () => {
  console.log("showSelectLibrary")
  let libs = Library.getLibraries()
  let libNames = []
  libs.forEach( lib => {
    libNames.push(lib.name)
  })
  commandToUI(UIIdentifier, "showSelectLibrary", libNames)
}

const getIdentifiers = () => {
  Context.validNumberOfSegments = 4
  const document = Document.getSelectedDocument()
  const targetLayer = getSelectedLayers(document)
  const lookup = createTextLayerSymbolLookup(Library.getLibraries(), document)
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
