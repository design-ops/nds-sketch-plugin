import { Context } from '../src/lib/identifier'

test('initialise Context', () => {
    let id1 = new Context("_/section/organism/element/atom")
    expect(id1.toString()).toEqual("_/section/organism/element/atom")
    expect(id1.isValid).toStrictEqual(true)
})

test('simple merge Context', () => {
    let id1 = new Context("_/section/organism/element/atom")
    id1.merge("_/*/*/newElement/atom")    
    console.log(id1.toString())
    expect(id1.toString()).toEqual("_/section/organism/newElement/atom")
})

test('complex merge Context', () => {
    let id1 = new Context("_/section")
    id1.merge("_/*/organism")    
    expect(id1.toString()).toEqual("_/section/organism")
    id1.merge("_/*/*/element")    
    expect(id1.toString()).toEqual("_/section/organism/element")
    id1.merge("_/*/*/*/atom")    
    expect(id1.toString()).toEqual("_/section/organism/element/atom")
})

test('malformed merge Context', () => {
    let id1 = new Context("_/section/organism/element/atom")
    id1.merge("some other string")    
    expect(id1.toString()).toEqual("_/section/organism/element/atom")
})

test('duplicate Context', () => {
    let id1 = new Context("_/section/organism/element/atom")
    let id2 = id1.duplicate()
    id2.merge("_/some/other/stuff/here")
    expect(id1.toString()).not.toEqual(id2.toString())
    console.log(id1)
})

test('duplicate Context (2)', () => {
    let id1 = new Context("_/section")
    let id2 = id1.duplicate()
    expect(id1.toString()).toEqual(id2.toString())
})

test('chaining duplicate & merge', () => {
    let id1 = new Context("_/section/organism/element/atom")
    let id2 = id1.duplicate().merge("_/newSection")
    expect(id2.toString()).toEqual("_/newSection/organism/element/atom")
})

test('chaining duplicate & bad merge', () => {
    let id1 = new Context("_/section/organism/element/atom")
    let id2 = id1.duplicate().merge("some malformed string")
    expect(id2.toString()).toEqual("_/section/organism/element/atom")
})
