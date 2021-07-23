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

  },
  resetProgress: () => {

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
  events.resetProgress = data.resetProgress

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

const processingHasFinished = () => {
  selectLibraryView.setHidden(false)
  progressView.setHidden(true)
  events.resetProgress();
}

const createSelectLibraryView = (panelStyles, theme, libraries) => {

  //Settings
  let lastSelected = settings.sessionVariable('Selected')

  let swapType = createRadioButtons(
    ['Apply to selection', 'Apply to document (Beta)'],
    lastSelected
  )
  let swapTitle = createText(theme, panelStyles.blackText, panelStyles.whiteText, panelStyles.sectionFont, `Select Option`, NSMakeRect(20, 358, 200, 18))


  let panelContent = createView(NSMakeRect(0, 0, panelStyles.panelWidth, panelStyles.panelHeight - panelStyles.panelHeader))
  let libraryTitle = createText(theme, panelStyles.blackText, panelStyles.whiteText, panelStyles.sectionFont, `Select Library`, NSMakeRect(20, 55, 200, 18))

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

  const ignore = [ libraryScroll, libraryTitle, swapTitle, swapType ].forEach(i => panelContent.addSubview(i))

  return panelContent
}

const createProgressView = (panelStyles, theme) => {
  let panelContent = createView(NSMakeRect(0, 0, panelStyles.panelWidth, panelStyles.panelHeight - panelStyles.panelHeader))
  let themesTitle = createText(theme, panelStyles.blackText, panelStyles.whiteText, panelStyles.sectionFont, `..`, NSMakeRect(20, 55, 200, 18))

  let progressTitle = createText(theme, panelStyles.blackText, panelStyles.whiteText, panelStyles.sectionFont, `..`, NSMakeRect(20, 155, 200, 18))
  let progressBar = createProgressBar(NSMakeRect(20, 175, 340, 18))
  
  let completeButton = NSButton.alloc().initWithFrame(NSMakeRect(panelStyles.panelWidth-80-12,200,80,36))
  completeButton.setTitle('Done')
  completeButton.setBezelStyle(NSRoundedBezelStyle)
  completeButton.setAction('callAction:')
  completeButton.enabled = false

  completeButton.setCOSJSTargetFunction(function() {
    processingHasFinished();
  })

  const ignore = [ themesTitle, progressTitle, progressBar, completeButton ].forEach(i => panelContent.addSubview(i))

  const updateProgress = (perc) => {

    progressTitle.setStringValue("Swapping: " + Math.round(perc*100) + "%")
    progressBar.indeterminate = false
    progressBar.setDoubleValue(perc*100.0)
    
    if (perc >= 1) {
      themesTitle.setStringValue("Done")
      progressTitle.setStringValue("100%")
      completeButton.enabled = true
    }
  }

  const resetProgress = () => {
    progressBar.indeterminate = true
    completeButton.enabled = false
    themesTitle.setStringValue("Applying theme...")
    progressTitle.setStringValue("Analysing document")
  }

  resetProgress();

  return { view: panelContent, updateProgress: updateProgress, resetProgress: resetProgress }
}
