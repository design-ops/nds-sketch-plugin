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

window.showSelectLibrary = (libraryData) => {
    console.log("showSelectLibrary", libraryData)
    let body = document.querySelector("#content")
    let outer = document.querySelector("template#chooseLibrary").content.cloneNode(true)
    let entryTemplate = document.querySelector("template#libraryOption").content
    console.log("(2)", body, outer, entryTemplate)
    libraryData.forEach( lib => {
        let entry = entryTemplate.cloneNode(true)
        entry.querySelector("#libraryEntry").attributes.libraryId = lib.id
        entry.querySelector("#libraryEntry").innerText = lib.name
        outer.querySelector("#libraryOptions").appendChild(entry)
    });
    console.log("appendingChild...")
    body.appendChild(outer)
    console.log("done..")
}

selectLibrary = (node) => {
    const id = node.attributes.libraryId
    window.postMessage('selectLibrary', id)
}