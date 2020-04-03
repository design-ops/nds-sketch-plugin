// disable the context menu (eg. the right click menu) to have a more native feel
/*
document.addEventListener('contextmenu', (e) => {
  e.preventDefault()
})
*/
/*
// call the plugin from the webview
document.getElementById('button').addEventListener('click', () => {
  window.postMessage('nativeLog', 'Called from the webview')
})
*/

window.showSelectLibrary = (libraryNames) => {
    console.log("showSelectLibrary", libraryNames)
    let body = document.querySelector("#content")
    let outer = document.querySelector("template#chooseLibrary").content.cloneNode(true)
    let entryTemplate = document.querySelector("template#libraryOption").content
    console.log("(2)", body, outer, entryTemplate)
    libraryNames.forEach( name => {
        let entry = entryTemplate.cloneNode(true)
        // entry.querySelector("#libraryEntry").attributes.libraryName = name
        entry.querySelector("#libraryEntry").innerText = name
        outer.querySelector("#libraryOptions").appendChild(entry)
    });
    console.log("appendingChild...")
    body.appendChild(outer)
    console.log("done..")
}

selectLibrary = (node) => {
    const libraryName = node.attributes.libraryName
    window.postMessage('selectLibrary', libraryName)
}