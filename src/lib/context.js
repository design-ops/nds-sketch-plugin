
export class VariableSizeContext {
    constructor(str) {
        this._arr = this._arrayFromString(str) 
    }
    _arrayFromString(str) {
        return str.split("/").map( entry => {
            if (entry.charAt(0) == "_") return entry.substr(1).split(" - ")[0]
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
        if (arr.length > 0) {
          return this.append(arr[arr.length-1])
        } else {
          return this
        }
    }
}
