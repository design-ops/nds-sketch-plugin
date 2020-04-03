import { NestedContext, manageNesting } from '../src/lib/nested'

test('nesting', () => {
    let nc1 = new NestedContext(1, "")
    let nc2 = new NestedContext(2, "")
    let nc3 = new NestedContext(3, "")
    let nc4 = new NestedContext(2, "")
    let arr = []

    arr = manageNesting(arr, nc1)
    expect(arr.length).toEqual(1)
    expect(arr).toEqual([nc1])

    arr = manageNesting(arr, nc2)
    expect(arr.length).toEqual(2)
    expect(arr).toEqual([nc1, nc2])

    arr = manageNesting(arr, nc3)
    expect(arr.length).toEqual(3)
    expect(arr).toEqual([nc1, nc2, nc3])

    arr = manageNesting(arr, nc4)
    expect(arr.length).toEqual(2)
    expect(arr).toEqual([nc1, nc4])

})