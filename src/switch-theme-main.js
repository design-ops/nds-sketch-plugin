import { Document, Library } from "sketch";
import { getWebview } from 'sketch-module-web-view/remote'
import { createTextLayerSymbolLookup } from "./lib/library"
import { createWebView } from './lib/webview'
import { getIdentifiersIn, getSelectedLayers } from './lib/identifier'
import { fromPanel } from "sketch-module-web-view";

const webviewIdentifier = 'switchthemelibrary.webview'

export default function onRun() {
  console.log("onRun....")
  if (false){
    createWebView(webviewIdentifier)
  }
  const document = Document.getSelectedDocument()
  const targetLayer = getSelectedLayers(document)
  const lookup = createTextLayerSymbolLookup(Library.getLibraries(), document)
  // console.log(lookup)
  const ids = getIdentifiersIn(targetLayer, lookup)
  // console.log(ids)
}

// When the plugin is shutdown by Sketch (for example when the user disable the plugin)
// we need to close the webview if it's open
export function onShutdown() {
  const existingWebview = getWebview(webviewIdentifier)
  if (existingWebview) {
    existingWebview.close()
  }
}
