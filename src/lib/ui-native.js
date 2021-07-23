import sketch from 'sketch'
import settings from 'sketch/settings'
import createFloatingPanel from '../ui/create-floating-panel'
import createText from '../ui/create-text'
import createScrollView from '../ui/create-scroll-view'
import createRadioButtons from '../ui/create-radio-buttons'

import styles from '../ui/styles'

import createView from '../ui/create-view'
import createProgressBar from '../ui/create-progressview'
const pluginName = __command.pluginBundle().name()

const theme = sketch.UI.getTheme()

let events = {
  onLibrarySelected: (library, applyToSelection) => {
    console.log("default onLibrarySelected - override this!")
  },
  onProgressUpdate: (perc) => {

  }
}

let selectLibraryView
let progressView
let progressUpdate

export const showNativeUI = (libraries) => {
  let panelStyles = styles()
  selectLibraryView = createSelectLibraryView(panelStyles, theme, libraries)
  let data = createProgressView(panelStyles, theme)

  progressView = data.view
  progressUpdate = data.updateProgress

  progressView.setHidden(true)

  let fiber = sketch.Async.createFiber()
  let panel = createFloatingPanel(theme, pluginName, NSMakeRect(0, 0, panelStyles.panelWidth, panelStyles.panelHeight))
  let panelClose = panel.standardWindowButton(NSWindowCloseButton)

  panelClose.setCOSJSTargetFunction(function () {
    panel.close()
    fiber.cleanup()
  })

  panel.contentView().addSubview(selectLibraryView)
  panel.contentView().addSubview(progressView)

  return events
}

const libraryWasSelected = (lib, applyToSelection) => {

  selectLibraryView.setHidden(true)
  progressView.setHidden(false)

  events.onProgressUpdate = (perc) => {
    console.log("progress is " + (perc * 100) + "%")
    progressUpdate(perc)
  }

  // tell plugin to start processing!
  setTimeout( () => {
    events.onLibrarySelected(lib, applyToSelection)
  }, 100)

}

const createSelectLibraryView = (panelStyles, theme, libraries) => {

  //Settings
  let lastSelected = settings.sessionVariable('Selected')

  let swapType = createRadioButtons(
    ['Apply to selection', 'Apply to document (Beta)'],
    lastSelected
  )

  let panelContent = createView(NSMakeRect(0, 0, panelStyles.panelWidth, panelStyles.panelHeight - panelStyles.panelHeader))
  let themesTitle = createText(theme, panelStyles.blackText, panelStyles.whiteText, panelStyles.sectionFont, `Select Library (${libraries.length})`, NSMakeRect(20, 55, 200, 18))

  let libraryScroll = createScrollView(theme,NSMakeRect(20,90,338,239))
  let libraryContent = createView(NSMakeRect(0,0,panelStyles.itemWidth,panelStyles.itemHeight * libraries.length))


  libraries.forEach((lib, i) => {
    let listItem = createView(NSMakeRect(0,panelStyles.itemHeight*i,panelStyles.itemWidth,panelStyles.itemHeight))

    let title = createText(theme, panelStyles.blackText, panelStyles.whiteText, panelStyles.titleFont, lib.name, NSMakeRect(20, 20, 200, 18))

    let button = NSButton.alloc().initWithFrame(NSMakeRect(237,10,80,36))
    button.setTitle('Swap')
    button.setBezelStyle(NSRoundedBezelStyle)
    button.setAction('callAction:')

    button.setCOSJSTargetFunction(function() {
      let applyToSelection = (swapType.selectedCell().tag() === 0)
      libraryWasSelected(lib, applyToSelection)
    })

    const wut = [title, button].forEach(i => listItem.addSubview(i))

    libraryContent.addSubview(listItem)
  })

  libraryScroll.setDocumentView(libraryContent)

  const ignore = [ libraryScroll, themesTitle, swapType ].forEach(i => panelContent.addSubview(i))

  /*
  let swapType = createRadioButtons(
    ['Apply to selection', 'Apply to document'],
    lastSelected
  )

  let themesTitle = createText(theme, panelStyles.blackText, panelStyles.whiteText, panelStyles.sectionFont, 'Libraries', NSMakeRect(20, 55, 100, 18))
  let optionsTitle = createText(theme, panelStyles.blackText, panelStyles.whiteText, panelStyles.sectionFont, 'Options', NSMakeRect(20, 349, 100, 18))
  let scrollViewMask = createImage(theme, NSMakeRect(20, 90, 338, 239), 'scrollViewMask.png', 'scrollViewMaskDark.png')
  let libraryList = createScrollView(theme, NSMakeRect(20, 90, 338, 239))

  let addComponentsToPanel = [themesTitle, optionsTitle, swapType, libraryList, scrollViewMask].forEach(i => panelContent.addSubview(i))
  let itemContent = createView(NSMakeRect(0, 0, panelStyles.itemWidth, panelStyles.itemHeight * libraries.length))
  let count = 0

  libraries.forEach(function (library, i) {
    let lib = library
    let nativeLibrary = lib.sketchObject
    let nativeLibraryLayers = library.sketchObject.document().documentData().pages()
    let listItem = createView(NSMakeRect(0, panelStyles.itemHeight * count, panelStyles.itemWidth, panelStyles.itemHeight))
    let imageMask = createImage(theme, NSMakeRect(20, 15, 40, 40), 'mask.png', 'maskDark.png')
    let imageArea = createLibraryPreview(theme, nativeLibraryLayers, NSMakeRect(20, 15, 40, 40))
    let artboardSubtitle = createText(theme, panelStyles.darkTextGrey, panelStyles.lightTextGrey, panelStyles.subtitleFont, String(library.libraryType), NSMakeRect(panelStyles.rightColX, 38, panelStyles.rightColWidth - 88, 14))
    let artboardTitle = createText(theme, panelStyles.blackText, panelStyles.whiteText, panelStyles.titleFont, String(library.name), NSMakeRect(panelStyles.rightColX, 20, panelStyles.rightColWidth - 88, 18))
    let divider = createDivider(theme, NSMakeRect(20, panelStyles.itemHeight - 1, panelStyles.itemWidth - 40, 0.5))

    let button = NSButton.alloc().initWithFrame(NSMakeRect(237, 18, 88, 36))
    button.setTitle('Swap')
    button.setBezelStyle(NSRoundedBezelStyle)
    button.setAction('callAction:')

    button.setCOSJSTargetFunction(function () {
      let doc = sketch.getSelectedDocument()

      if (swapType.selectedCell().tag() === 0) {
        settings.setSessionVariable('Selected', 0)
        const selectedLayers = doc.selectedLayers.layers
        if (selectedLayers.length < 1) {
          sketch.UI.message(`Select a layer`)
        } else {
          switchSelection(doc, lib)
          googleAnalytics(context, 'Replace selected with', lib.name, 'Library')
          sketch.UI.message(`🎉 🎈 🙌🏼  Applied theme from ${lib.name}  🙌🏼 🎉 🎈`)
        }
      }

      if (swapType.selectedCell().tag() === 1) {
        settings.setSessionVariable('Selected', 1)
        switchLibrary(doc, lib)
        googleAnalytics(context, 'Replace document with', lib.name, 'Library')
        sketch.UI.message(`🎉 🎈 🙌🏼  Applied theme from ${lib.name}  🙌🏼 🎉 🎈`)
      }
    })

    let addComponentsToList = [imageArea, imageMask, artboardSubtitle, artboardTitle, button, divider].forEach(i => listItem.addSubview(i))

    itemContent.addSubview(listItem)

    count++
  })

  libraryList.setDocumentView(itemContent)
  */

  return panelContent
}

const createProgressView = (panelStyles, theme) => {
  let panelContent = createView(NSMakeRect(0, 0, panelStyles.panelWidth, panelStyles.panelHeight - panelStyles.panelHeader))
  let themesTitle = createText(theme, panelStyles.blackText, panelStyles.whiteText, panelStyles.sectionFont, `Progress Goes Here`, NSMakeRect(20, 55, 200, 18))

  let progressTitle = createText(theme, panelStyles.blackText, panelStyles.whiteText, panelStyles.sectionFont, `Analysing document`, NSMakeRect(20, 155, 200, 18))
  let progressBar = createProgressBar(NSMakeRect(20, 175, 340, 18))

  themesTitle.setStringValue("Applying theme...")

  const ignore = [ themesTitle, progressTitle, progressBar ].forEach(i => panelContent.addSubview(i))

  const updateProgress = (perc) => {
    progressTitle.setStringValue("Swapping: " + Math.round(perc*100) + "%")
    // progressBar.setDoubleValue(20.0)
    // progressBar.isIndeterminate = false
    progressBar.indeterminate = false
    progressBar.setDoubleValue(perc*100.0)
    // progressBar.incrementBy(5.0);
    // console.log("progress percentage is ", progressBar.doubleValue())
    if (perc == 1) {
      themesTitle.setStringValue("Done")
        progressTitle.setStringValue("100%")
    }

  }

  return { view: panelContent, updateProgress: updateProgress }
}
