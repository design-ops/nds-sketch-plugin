import BrowserWindow from 'sketch-module-web-view'
import { getWebview } from 'sketch-module-web-view/remote'
import UI from 'sketch/ui'

export function createUI(identifier, callbacks) {
    console.log("[Create Web View]")
    const options = {
      identifier: identifier,
      width: 240,
      height: 300,
      show: false
    }

    const browserWindow = new BrowserWindow(options)

    // only show the window when the page has loaded to avoid a white flash
    browserWindow.once('ready-to-show', () => {
      browserWindow.show()
    })

    const webContents = browserWindow.webContents

    // print a message when the page loads
    webContents.on('did-finish-load', () => {
      // UI.message('UI loaded!')
      callbacks.onLoad()
    })

    // add a handler for a call from web content's javascript
    webContents.on('selectLibrary', l => {
        callbacks.onSelectLibrary(l)
    })

    browserWindow.loadURL(require('../../resources/webview.html'))
}

export const commandToUI = (identifier, command, payload) => {
    const existingWebview = getWebview(identifier)
    if (existingWebview && existingWebview.webContents) {
        let param = JSON.stringify(payload)
        let jsCall = `${command}(${param})`

        existingWebview.webContents
          .executeJavaScript(jsCall)
          .catch(console.error)
    }
}

export const closeUI = (identifier) => {
    const existingWebview = getWebview(identifier)
    if (existingWebview) {
        existingWebview.close()
    }
}
