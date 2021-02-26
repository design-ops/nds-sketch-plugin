import { getSymbolFromDocument } from './library'

// export is only for jest
// @TODO switch to use rewire to expose this
export class NestedContext {
    constructor(level, info) {
        this.level = level
        this.info = info
    }
}

// export is only for jest
// @TODO switch to use rewire to expose this
export const manageNesting = (arr, nestedcontext) => {
    // if the level is higher then add it
    // if the level is the same as an existing then replace
    // if the level is lower then remove until the arr

    // AKA remove any that are below or on same level
    const target = nestedcontext.level
    for(var i = arr.length-1; i >= 0; i-- ) {
        const item = arr[i]
        if (item.level >= target) {
            arr.splice(i,1)
        }
    }
    arr.push(nestedcontext)
    return arr
}

export const updateNestedContextsFromOverride = (nestedContexts, override, lookup) => {
    let levels = override.path.split("/").length
    let contextName = ''
    if (override.affectedLayer && override.affectedLayer.master){

        // 1. We lookup the current value of the Override
        // 2. If there is a value, we need to find it's name
        // 3. We do a 'Split' because we only need the token name

        // console.log(lookup[override.value])

        if (lookup[override.value] != undefined) {
          contextName = lookup[override.value].name.split('/').slice(-1)
        }

        //
        // @@ TODO Need to make this work with Text, Layers and Symbols
        else {

          console.log('Style Not found')

          // If symbol is not found in any Library
          // Go look for a reference in the current document
          contextName = getSymbolFromDocument(override.value)
        }

    }
    // const context = new Context(contextName)
    // if (context.type == ContextType.INVALID) return nestedContexts
    let ncontext = new NestedContext(levels, contextName)
    return manageNesting(nestedContexts, ncontext)
}

export const contextFromNestedContexts = (baseContext, nestedContexts) => {
    let context = baseContext
    nestedContexts.forEach( nc => {
        if (nc.info != "") context = context.append(nc.info)
    })
    return context
}
