import { updateNestedContextsFromOverride, contextFromNestedContexts } from './nested'
import { VariableSizeContext } from './context'
import { Document } from "sketch";

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

        if (sublayer.type == "Group") { // If it's a group, re-run with the new context

            // Ignore the Group name from the context
            // eg. 'artboard-name/Group' > 'artboard-name'
            newContext._arr.pop()

            let nested = getNestedContexts(sublayer, newContext, lookup)
            res = res.concat( nested )

        } else if (sublayer.type == "SymbolInstance") { // If it's a Symbol

            if (sublayer.overrides.length > 0){ // If the Symbol has Overrides
                let nested = getContextsFromOverrides(sublayer.overrides, newContext, lookup)
                res = res.concat( nested )
            } else {  // If the Symbol does NOT have Overrides

                // Context of the layer
                // Since we're on an Artboard, and not inside a symbol, the context must be the artboard name.
                // eg. `artboard-name/symbol-name/layer-name` > 'artboard-name'
                newContext._arr.splice(1)

                // Get Token name
                // Get the actual shared style name
                // eg. 'symbol-name/token-name' > 'token-name'
                let thisToken

                if (lookup[sublayer.symbolId] == undefined) {
                  // If symbol is not found in any Library
                  // Go look for a reference in the current document
                  let thisDocument = Document.getSelectedDocument()
                  let getSymbols = thisDocument.getSymbols()
                  let thisSymbol = getSymbols.find(el => el.symbolId == sublayer.symbolId)
                  thisToken = thisSymbol.name.split('/').slice(-1)
                } else {
                  thisToken = lookup[sublayer.symbolId].name.split('/').slice(-1)
                }

                // Create the new Token
                newContext._arr.push(thisToken)

                res.push({context: newContext, layer: sublayer})
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
              let thisToken
              thisToken = sublayer.sharedStyle.name.split('/').slice(-1)

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

          //
          // Look for the symbol in the existing libraries
          // console.log(`  [Looking for override.value: ${override.value}]`)
          // let lookupValue = lookup[override.value]
          //
          // if (lookupValue == undefined) { // Symbol not found in any Library
          //   console.log(`  [Missing!]`) // Go look for it in the document
          //   let thisDocument = Document.getSelectedDocument()
          //   let getSymbols = thisDocument.getSymbols()
          //   let thisSymbol = getSymbols.find(el => el.symbolId == override.value)
          //   console.log(`  [Found reference in Document: ${thisSymbol.name}]`)
          // } else {
          //   console.log(`  [Found!]`)
          //   console.log(`  [Found symbol in Library: ${lookup[override.value].name}`)
          // }

          nestedContexts = updateNestedContextsFromOverride(nestedContexts, override, lookup)

          if (override.affectedLayer && override.affectedLayer.master){

              let symbolName = `${override.affectedLayer.master.name}`

              // Only operate if it's not got an _ at the start
              if (symbolName.charAt(0) != "_") {

                let symbolContext = contextFromNestedContexts(baseContext, nestedContexts)
                // console.log(symbolContext)
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

const getContextFromName = (existing, layer) => {
    let name = layer.name
    if (layer.master) name = layer.master.name
    if (existing == null) {
        return new VariableSizeContext(name)
    }
    return existing.append(name)
}
