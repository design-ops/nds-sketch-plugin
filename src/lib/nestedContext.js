
export class NestedContext {
    constructor(level, info) {
        this.level = level
        this.info = info
    }
}

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