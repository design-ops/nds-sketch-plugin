import { NestedContext, manageNesting } from './nestedContext'

export const getIdentifiersIn = (layer, lookup) => {
    let res = []
    layer.layers.forEach( sublayer => {
        let context = getContextFromName(null, sublayer)
        let nested = getNestedContexts(sublayer, context, lookup)
        res = res.concat( nested )
    })
    return res
}

const getNestedContexts = (layer, context, lookup) => {
    let res = []
    if (layer.layers == undefined) return
    layer.layers.forEach( sublayer => {
        let newContext = getContextFromName(context, sublayer)
        console.log(`${sublayer.type} >> '${newContext.toString()}' '${sublayer.name}'`)
        if (sublayer.type == "Group") {
            let nested = getNestedContexts(sublayer, newContext, lookup)
            res = res.concat( nested )
        } else if (sublayer.type == "SymbolInstance") {
            console.log(`  master:`, sublayer.master.name)
            let nested = getContextsFromOverrides(sublayer.overrides, newContext, lookup)
            res = res.concat( nested )
        } else {
            res.push({context: newContext, layer: sublayer})
        }
    })
    return res
}

const getContextsFromOverrides = (overrides, context, lookup) => {
    console.log("OVERRIDES ---------------")
    let baseContext = context.duplicate() //
    let nestedContexts = []
    let res = []
    overrides.forEach( override => {
        let id = override.value
        let levels = override.path.split("/").length
        let sharedSymbol = lookup[id]
        debugOverride(override, lookup)
        switch( override.property ){
            case "symbolID":
                let symbolName = ""
                if (override.affectedLayer && override.affectedLayer.master){
                    symbolName = override.affectedLayer.master.name
                }
                let ncontext = new NestedContext(levels, symbolName)
                manageNesting(nestedContexts, ncontext)
                break
            case "textStyle":
            case "layerStyle":
                let styleName = ""
                if (sharedSymbol) styleName = sharedSymbol.name
                // need to get the atom out of styleName :-/
                let result = {
                    context: contextFromNestedContexts(baseContext, nestedContexts),
                    layer: override }
                res.push(result)
                console.log(result.context)
                break;
        }
    })
    return res
}

const contextFromNestedContexts = (baseContext, nestedContexts) => {
    let context = baseContext.duplicate()
    nestedContexts.forEach( nc => {
        context.merge(nc.info)
    })
    return context
}

const debugOverride = (override, lookup) => {
    let id = override.value//path.split("/").pop()
    let levels = override.path.split("/").length
    let item = lookup[id]
    let name = "<unknown>"
    if (item) name = item.name 
    let parent = "<unknown>"
    if (override.affectedLayer && override.affectedLayer.master) parent = `${override.affectedLayer.master.name}`
    console.log(`  override type:${__pad(override.property,12)} levels:${levels} parent:"${__pad(parent,20)}"     name:${name}`)
    
    return null
}

const __pad = (str, size) => {
    // pad it, and then truncate it (in case it's already too long)
    return str.padEnd(size).substr(0, size)
}

const getContextFromName = (existing, layer) => {
    let name = layer.name
    if (layer.master) name = layer.master.name
    if (existing == null) {
        return new Context(name)
    }
    return existing.duplicate().merge(name)
}

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

export class Context {
    
    constructor(str) {
        this._isValid = false
        this._arr = this._arrayFromString(str)
        if (this._arr != null) {
            this._isValid = true
        }
    }

    _arrayFromString(str) {
        if (str.substr(0,2) != "_/") {
            return null
        }
        return str.substr(2).split("/")
    }

    get isValid() {
        return this._isValid
    }

    toString() {
        return `_/${this._arr.join("/")}`
    }

    duplicate() {
        return new Context(this.toString())
    }

    merge(str) {
        const newArr = this._arrayFromString(str)
        if (newArr != null) {
            for(var i=0;i<newArr.length;i++) {
                const newVal = newArr[i]
                // extend the context if merging in value is longer
                if (i >= this._arr.length) this._arr[i] = "*"
                if (newVal != "*") this._arr[i] = newVal
            }
        }
        return this
    }

    get length() {
        return this._arr.length
    }

    segmentAtIndex(index) {
        
    }
}