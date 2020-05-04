
export class FixedSizedContextType {
    static ATOM = "ContextType.ATOM"
    static SWITCH = "ContextType.SWITCH"
    static INVALID = "ContextType.INVALID"
}

export class VariableSizeContext {
    constructor(str) {
        this._arr = this._arrayFromString(str)
    }
    _arrayFromString(str) {
        return str.split("/").map( entry => {
            if (entry.charAt(0) == "_") return entry.substr(1)
            return entry
        })
    }
    toString() {
        return this._arr.join("/")
    }
    append(str) {
        return new VariableSizeContext(this.toString()+"/"+str)
    }
    appendLast(str) {
        const arr = this._arrayFromString(str)
        return this.append(arr[arr.length-1])
    }
    // merge & duplicate should become obsolete once transition is complete
    merge(str) {
        //return new VariableSizeContext(this.toString()+"/{"+str+"}")
        return this.append(`{${str}}`)
    }
    duplicate() {
        return new VariableSizeContext(this.toString())
    }
}

export class FixedSizeContext {
    
    static validNumberOfSegments = 3

    constructor(str) {
        this._arr = this._arrayFromString(str)
        this._type = this._typeFromString(str)
    }

    _arrayFromString(str) {
        const getArray = (str) => {
            if (str.substr(0,1) == "!") return []
            if (str.substr(0,2) == "_/") {
                return str.substr(2).split("/")
            }
            let arr = str.split("/")
            if (arr.length == FixedSizeContext.validNumberOfSegments) return arr
            // handle atoms that start with a '/'
            arr = str.substr(1).split("/")
            if (arr.length == FixedSizeContext.validNumberOfSegments) return arr
            return []
        }
        let arr = getArray(str)
        if (Array.isArray(arr)){
            arr.forEach( (value, index, array) => {
                array[index] = value.split("-")[0].trim()
            })
        }
        return arr
    }

    _typeFromString(str) {
        if (str.substr(0,1) == "!") return FixedSizedContextType.INVALID
        if (str.substr(0,2) == "_/") return FixedSizedContextType.SWITCH
        if (str.split("/").length == FixedSizeContext.validNumberOfSegments) return FixedSizedContextType.ATOM
        // handle atoms that start with a '/'
        if (str.substr(1).split("/").length == FixedSizeContext.validNumberOfSegments) return FixedSizedContextType.ATOM
        return FixedSizedContextType.INVALID
    }

    get type() {
        return this._type
    }

    toString() {
        switch(this._type){
            case FixedSizedContextType.SWITCH:
                return `_/${this._arr.join("/")}`
            case FixedSizedContextType.ATOM:
                return this._arr.join("/")
        }
        return ""
    }

    duplicate() {
        return new FixedSizeContext(this.toString())
    }

    merge(str) {
        const newArr = this._arrayFromString(str)
        let arr = this._arr
        if (newArr != null) {
            for(var i=0;i<newArr.length;i++) {
                const newVal = newArr[i]
                // extend the context if merging in value is longer
                if (i >= arr.length) arr[i] = "*"
                if (newVal != "*") arr[i] = newVal
            }
        }
        if (arr.length == FixedSizeContext.validNumberOfSegments) return new FixedSizeContext(arr.join("/"))
        return new FixedSizeContext(`_/${arr.join("/")}`)
    }

    mergeLastSegmentOLD(str) {
        // remove any initial '/'
        if (str.substr(0,1) == "/"){
            str = str.substr(1)
        }
        let arr = str.split("/")
        if (arr.length > 1) {
            let max = arr.length-1
            for(var i=0;i<max;i++) {
                arr[i] = "*"
            }
        }
        let nstr = `_/${arr.join("/")}`
        return this.merge(nstr)
    }

    mergeLastSegment(str) {
        let context = new FixedSizeContext(str)
        if (context.type == FixedSizedContextType.ATOM) {
            let arr = context.toString().split("/")
            let max = arr.length-1
            for(var i=0;i<max;i++) {
                arr[i] = "*"
            }
            let nstr = arr.join("/")
            return this.merge(nstr)
        }
        return this
    }
}