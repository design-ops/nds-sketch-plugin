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
