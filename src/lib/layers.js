
export const getSelectedLayers = (document) => {
    let selectedLayers
    if (document.selectedLayers && document.selectedLayers.length !== 0 && selectedLayersAreArtboard(document.selectedLayers)) {
        selectedLayers = document.selectedLayers;
    } else {
        selectedLayers = document.selectedPage;
    }
    return selectedLayers
}

const selectedLayersAreArtboard = (selectedLayers) => {
    if (selectedLayers.layers.length > 0 && selectedLayers.layers[0].layers != undefined){
        return true
    }
    return false
}

export const getLayersFromAllPages = (document) => {
    let selectedLayers = [];
    document.pages.forEach( page => {
        selectedLayers = selectedLayers.concat(page.layers);
    })
    return selectedLayers;
}