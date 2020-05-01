import { VariableSizeContext } from '../src/lib/context'

test('append context', () => {
    let id1 = new VariableSizeContext("section")
    let id2 = id1.append("organism")
    expect(id1.toString()).toEqual("section")
    expect(id2.toString()).toEqual("section/organism")
})
