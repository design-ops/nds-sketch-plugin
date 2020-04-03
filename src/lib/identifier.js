import { 
    updateNestedContextsFromOverride, 
    contextFromNestedContexts 
} from './nested'
import { 
    Context, 
    ContextType 
} from './context'

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
            if (sublayer.overrides.length > 0){
                let nested = getContextsFromOverrides(sublayer.overrides, newContext, lookup)
                res = res.concat( nested )
            } else {
                if (newContext.type == ContextType.ATOM){
                    res.push({context: newContext, layer: sublayer})
                }
            }
        } else {
            if (newContext.type == ContextType.ATOM){
                res.push({context: newContext, layer: sublayer})
            }
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
        let sharedSymbol = lookup[id]
        debugOverride(override, lookup)
        switch( override.property ){
            case "symbolID":
                nestedContexts = updateNestedContextsFromOverride(nestedContexts, override)
                // need to get the master symbol name
                // if it has the right number of levels and doesn't start with `_/`
                // then it's valid to be swapped.
                if (override.affectedLayer && override.affectedLayer.master){
                    const symbolName = override.affectedLayer.master.name
                    let symbolContext = new Context(symbolName)
                    if (symbolContext.type == ContextType.ATOM) {
                        symbolContext = baseContext.duplicate().mergeLastSegment(symbolName)
                        let result = {
                            context: contextFromNestedContexts(symbolContext, nestedContexts),
                            layer: override }
                        res.push(result)
                        console.log(`    context:   ${result.context.toString()}`)
                    }
                }
                break
            case "textStyle":
            case "layerStyle":
                let styleName = ""
                if (sharedSymbol && sharedSymbol.name) styleName = sharedSymbol.name
                // need to get the atom out of styleName :-/
                let styleContext = new Context(styleName)
                if (styleContext.type == ContextType.ATOM) {
                    styleContext = baseContext.duplicate().mergeLastSegment(styleName)
                    let result = {
                        context: contextFromNestedContexts(styleContext, nestedContexts),
                        layer: override }
                    res.push(result)
                    console.log(`    context:   ${result.context.toString()}`)
                } else {
                    console.log(`    not a valid atom, so ignoring:   ${styleName}`)
                }
                break
        }
    })
    return res
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
