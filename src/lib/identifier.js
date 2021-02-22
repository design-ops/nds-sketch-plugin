import { Document } from "sketch";
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
// 1. DONE We need to get the Style Name (Token only)
// 2. DONE Groups should not be added to the ContextType (clients/Group/subtitle >  clients/subtitle)
// 3. We need to iterate through all the Symbol Overrides and repeat the above

const getNestedContexts = (layer, context, lookup) => {

    let res = []
    if (layer.layers == undefined) return
    layer.layers.forEach( sublayer => {

        let newContext = getContextFromName(context, sublayer)

        // console.log(`  [${sublayer.type}] - "${newContext.toString()}"`)

        if (sublayer.type == "Group") { // If it's a group, re-run with the new context

            // Ignore the Group name from the context
            // eg. 'artboard-name/Group' > 'artboard-name'
            newContext._arr.pop()

            let nested = getNestedContexts(sublayer, newContext, lookup)
            res = res.concat( nested )

        } else if (sublayer.type == "SymbolInstance") { // If it's a Symbol

            // Add the current symbol to the array
            // res.push({context: newContext, layer: sublayer})

            if (sublayer.overrides.length > 0){

                let nested = getContextsFromOverrides(sublayer.overrides, newContext, lookup)
                res = res.concat( nested )

            } else {
                // Not entirely convinced we need this part of the script.
                // This may mean it's an icon or other symbol from a theme.
                // We should only add layers that have shared styles (?)
                if (sublayer.sharedStyle != null){
                    console.log(`    context: ${newContext.toString()}`)
                    res.push({context: newContext, layer: sublayer})
                } else {
                    // console.log(`    context: none (no sharedStyle)`)
                    res.push({context: newContext, layer: sublayer})
                    // console.log(sublayer.name)
                }
            }

        } else { // If it's a Layer or Text style

            // only add layers that have shared styles
            if (sublayer.sharedStyle != null) {

              // Context of the layer
              // Remove the layer name because we only need the context.
              // eg. `artboard-name/symbol-name/layer-name` > 'artboard-name/symbol-name'
              newContext._arr.pop()

              // Get Token name
              // Get the actual shared style name
              // eg. 'artboard-name/symbol-name/token-name' > 'token-name'
              let thisToken = sublayer.sharedStyle.name.split('/').slice(-1)

              // Create the new Token
              newContext._arr.push(thisToken)

              res.push({context: newContext, layer: sublayer})
            }

        }

    })
    return res
}

const getContextsFromOverrides = (overrides, context, lookup) => {

    let baseContext = context;
    let nestedContexts = []
    let res = []
    overrides.forEach( override => {
        let id = override.value
        let sharedSymbol = lookup[id]

        if (override.property == "symbolID") {

          nestedContexts = updateNestedContextsFromOverride(nestedContexts, override, lookup)
          if (override.affectedLayer && override.affectedLayer.master){
              // only operate if it's not got an _ at the start
              // We need to find a way to get the override value and replace that.
              const symbolName = `${override.affectedLayer.master.name}`
              if (symbolName.charAt(0) != "_") {

                  let symbolContext = contextFromNestedContexts(baseContext, nestedContexts) //.appendLast(`${symbolName}`)

                  let result = {context: symbolContext, layer: override }
                  res.push(result)

              }
          }

      } else if (override.property == "textStyle" || override.property == "layerStyle") {

          nestedContexts = updateNestedContextsFromOverride(nestedContexts, override, lookup)
          if (sharedSymbol && sharedSymbol.name){

              let styleName = `${sharedSymbol.name}`
              let styleContext = contextFromNestedContexts(baseContext, nestedContexts).appendLast(styleName)

              let result = {context: styleContext, layer: override }
              res.push(result)

          }
        }

    })
    return res
}

// const __pad = (str, size) => {
//     // pad it, and then truncate it (in case it's already too long)
//     return str.padEnd(size).substr(0, size)
// }

const getContextFromName = (existing, layer) => {
    let name = layer.name
    if (layer.master) name = layer.master.name
    if (existing == null) {
        return new VariableSizeContext(name)
    }
    return existing.append(name)
}
