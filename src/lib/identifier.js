import { updateNestedContextsFromOverride, contextFromNestedContexts } from './nested'
import { VariableSizeContext } from './context'

export const getIdentifiersIn = (layer, lookup) => {
    let res = []
    layer.layers.forEach( sublayer => {
        let context = getContextFromName(null, sublayer)
        let nested = getNestedContexts(sublayer, context, lookup)
        res = res.concat( nested )
    })
    return res
}

// Things to do
// 1. We need to get the Style Name (Token only)
// 2. Groups should not be added to the ContextType (clients/Group/subtitle >  clients/subtitle)
// 3.

const getNestedContexts = (layer, context, lookup) => {

    let res = []
    if (layer.layers == undefined) return
    layer.layers.forEach( sublayer => {

        let newContext = getContextFromName(context, sublayer)

        console.log(`"${sublayer.type}" >> "${newContext.toString()}" "${sublayer.name}"`)

        if (sublayer.type == "Group") { // If it's a group, re-run with the new context

            // Remove the Group name from the context
            // eg. 'artboard-name/Group' > 'artboard-name'
            newContext._arr.pop()

            let nested = getNestedContexts(sublayer, newContext, lookup)
            res = res.concat( nested )

        } else if (sublayer.type == "SymbolInstance") { // If it's a Symbol
            console.log(`  master:`, sublayer.master.name)
            if (sublayer.overrides.length > 0){
                let nested = getContextsFromOverrides(sublayer.overrides, newContext, lookup)
                res = res.concat( nested )
            } else {
                // only add layers that have shared styles
                if (sublayer.sharedStyle != null){
                    console.log(`  context: ${newContext.toString()}`)
                    res.push({context: newContext, layer: sublayer})
                } else {
                    console.log(`  context: none (no sharedStyle)`)
                }
            }
        } else { // If it's a Layer or Text style
            // only add layers that have shared styles
            if (sublayer.sharedStyle != null) {

              // console.log(`  Type: ${sublayer.type}`)
              // console.log(`  Style ID: ${sublayer.sharedStyleId}`)
              // console.log(`  Layer Context: ${newContext.toString()}`)
              // console.log(`  Style Name: ${sublayer.sharedStyle.name}`)

              // Context of the layer
              // Remove the layer name because we only need the context.
              // eg. `artboard-name/symbol-name/layer-name` > 'artboard-name/symbol-name'
              newContext._arr.pop()

              // Get Token name
              // Get the actual shared style name
              // eg. 'artboard-name/symbol-name/token-name' > 'token-name'
              let thisToken = sublayer.sharedStyle.name.split('/').slice(-1)

              // Create the new Token
              let newToken = newContext + "/" + thisToken
              // console.log(`  Token: ${newToken}`)

              res.push({context: newToken, layer: sublayer})
            } else {
                console.log(`  context: none (no sharedStyle)`)
            }

        }

    })
    return res
}

const getContextsFromOverrides = (overrides, context, lookup) => {
    console.log("OVERRIDES ---------------")
    let baseContext = context;
    let nestedContexts = []
    let res = []
    overrides.forEach( override => {
        let id = override.value
        let sharedSymbol = lookup[id]
        let padding = debugOverride(override, lookup)
        switch( override.property ){
            case "symbolID":
                nestedContexts = updateNestedContextsFromOverride(nestedContexts, override)
                if (override.affectedLayer && override.affectedLayer.master){
                    // only operate if it's not got an _ at the start
                    const symbolName = `${override.affectedLayer.master.name}`
                    if (symbolName.charAt(0) != "_") {
                        let symbolContext = contextFromNestedContexts(baseContext, nestedContexts).appendLast(`<${symbolName}>`)
                        let result = {
                            context: symbolContext,
                            layer: override }
                        res.push(result)
                        console.log(`${padding}context:   ${result.context.toString()}`)
                    }
                }
                break
            case "textStyle":
            case "layerStyle":
                nestedContexts = updateNestedContextsFromOverride(nestedContexts, override)
                if (sharedSymbol && sharedSymbol.name){
                    let styleName = `${sharedSymbol.name}`
                    let styleContext = contextFromNestedContexts(baseContext, nestedContexts).appendLast(styleName)
                    let result = {
                        context: styleContext,
                        layer: override }
                    res.push(result)
                    console.log(`${padding}context:   ${result.context.toString()}`)
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
    let padding = ""
    while (padding.length < (levels * 2)) { padding += " "; };
    console.log(`${padding}override type:${__pad(override.property,12)} levels:${levels} parent:"${__pad(parent,20)}"     name:${name}`)

    return padding
}

const __pad = (str, size) => {
    // pad it, and then truncate it (in case it's already too long)
    return str.padEnd(size).substr(0, size)
}

const getContextFromName = (existing, layer) => {
    let name = layer.name
    if (layer.master) name = layer.master.name
    if (existing == null) {
        return new VariableSizeContext(name)
    }
    return existing.append(name)
}
