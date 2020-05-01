import { FixedSizeContext, FixedSizedContextType } from "./context"

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

export const updateNestedContextsFromOverride = (nestedContexts, override) => {
    let levels = override.path.split("/").length
    let contextName = ""
    if (override.affectedLayer && override.affectedLayer.master){
        contextName = override.affectedLayer.master.name
    }
    // const context = new Context(contextName)
    // if (context.type == ContextType.INVALID) return nestedContexts
    let ncontext = new NestedContext(levels, contextName)
    return manageNesting(nestedContexts, ncontext)
}

export const contextFromNestedContexts = (baseContext, nestedContexts) => {
    let context = baseContext.duplicate()
    let debug = []
    nestedContexts.forEach( nc => {
        context = context.merge(nc.info)
        debug.push( nc.info )
    })
    return context
}
