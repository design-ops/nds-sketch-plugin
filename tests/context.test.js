import { Context, ContextType } from '../src/lib/context'

test('initialise SWITCH Context', () => {
    Context.validNumberOfSegments = 4
    let id1 = new Context("_/section/organism/element")
    expect(id1.type).toEqual(ContextType.SWITCH)
    expect(id1.toString()).toEqual("_/section/organism/element")
})

test('initialise ATOM Context', () => {
    Context.validNumberOfSegments = 4
    let id1 = new Context("section/organism/element/atom")
    expect(id1.type).toEqual(ContextType.ATOM)
    expect(id1.toString()).toEqual("section/organism/element/atom")
})

test('initialise INVALID Context', () => {
    Context.validNumberOfSegments = 4
    let id1 = new Context("!section/organism/element/atom")
    expect(id1.type).toEqual(ContextType.INVALID)
    expect(id1.toString()).toEqual("")
})

test('initialise INVALID Context (2)', () => {
    Context.validNumberOfSegments = 4
    let id1 = new Context("some random string")
    expect(id1.type).toEqual(ContextType.INVALID)
    expect(id1.toString()).toEqual("")
})

test('simple merge Context', () => {
    let id1 = new Context("_/section/organism/element/atom")
    id1 = id1.merge("_/*/*/newElement/atom")    
    expect(id1.toString()).toEqual("section/organism/newElement/atom")
})

test('complex merge Context', () => {
    Context.validNumberOfSegments = 4
    let id1 = new Context("_/section")
    id1 = id1.merge("_/*/organism")    
    expect(id1.toString()).toEqual("_/section/organism")
    id1 = id1.merge("_/*/*/element")    
    expect(id1.toString()).toEqual("_/section/organism/element")
    id1 = id1.merge("_/*/*/*/atom")    
    expect(id1.toString()).toEqual("section/organism/element/atom")
})

test('malformed merge Context', () => {
    Context.validNumberOfSegments = 4
    let id1 = new Context("_/section/organism/element/atom")
    id1 = id1.merge("some other string")    
    expect(id1.toString()).toEqual("section/organism/element/atom")
})

test('duplicate Context', () => {
    let id1 = new Context("_/section/organism/element/atom")
    let id2 = id1.duplicate()
    id2.merge("_/some/other/stuff/here")
    expect(id1.toString()).not.toEqual(id2.toString())
})

test('duplicate Context (2)', () => {
    let id1 = new Context("_/section")
    let id2 = id1.duplicate()
    expect(id1.toString()).toEqual(id2.toString())
})

test('chaining duplicate & merge', () => {
    Context.validNumberOfSegments = 4
    let id1 = new Context("_/section/organism/element/atom")
    let id2 = id1.duplicate().merge("_/newSection")
    expect(id2.toString()).toEqual("newSection/organism/element/atom")
})

test('chaining duplicate & bad merge', () => {
    Context.validNumberOfSegments = 4
    let id1 = new Context("_/section/organism/element/atom")
    let id2 = id1.duplicate().merge("some malformed string")
    expect(id2.toString()).toEqual("section/organism/element/atom")
})

test('mergeLastSegment leading /', () => {
    Context.validNumberOfSegments = 4
    let id1 = new Context("_/section/organism/element/atom")
    id1 = id1.mergeLastSegment("/nSection/nOrganism/nElement/nATOM")
    expect(id1.toString()).toEqual("section/organism/element/nATOM")
})

test('mergeLastSegment no leading /', () => {
    Context.validNumberOfSegments = 4
    let id1 = new Context("_/section/organism/element/atom")
    id1 = id1.mergeLastSegment("nSection/nOrganism/nElement/nATOM")
    expect(id1.toString()).toEqual("section/organism/element/nATOM")
})

test('mergeLastSegment atom', () => {
    Context.validNumberOfSegments = 4
    let id1 = new Context("_/section")
    id1 = id1.mergeLastSegment("nSection/nOrganism/nElement/nATOM")
    expect(id1.toString()).toEqual("section/*/*/nATOM")
})

test('mergeLastSegment malformed data /', () => {
    Context.validNumberOfSegments = 4
    let id1 = new Context("_/section/organism/element/atom")
    id1 = id1.mergeLastSegment("")
    expect(id1.toString()).toEqual("_/section/organism/element/atom")
})

test('types - switch', () => {
    Context.validNumberOfSegments = 4
    let id1 = new Context("_/section/organism")
    expect(id1.type).toEqual(ContextType.SWITCH)

    let id2 = new Context("section/organism/element/atom")
    expect(id2.type).toEqual(ContextType.ATOM)

    let id2a = new Context("/section/organism/element/atom")
    expect(id2a.type).toEqual(ContextType.ATOM)

    let id3 = new Context("!section/organism")
    expect(id3.type).toEqual(ContextType.INVALID)

    let id4 = new Context("organism/element/atom")
    expect(id4.type).toEqual(ContextType.INVALID)

    let id5 = new Context("some random string")
    expect(id5.type).toEqual(ContextType.INVALID)
})