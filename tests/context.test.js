import { FixedSizeContext, FixedSizedContextType } from '../src/lib/context'

test('initialise SWITCH Context', () => {
    FixedSizeContext.validNumberOfSegments = 4
    let id1 = new FixedSizeContext("_/section/organism/element")
    expect(id1.type).toEqual(FixedSizedContextType.SWITCH)
    expect(id1.toString()).toEqual("_/section/organism/element")
})

test('initialise ATOM Context', () => {
    FixedSizeContext.validNumberOfSegments = 4
    let id1 = new FixedSizeContext("section/organism/element/atom")
    expect(id1.type).toEqual(FixedSizedContextType.ATOM)
    expect(id1.toString()).toEqual("section/organism/element/atom")
})

test('initialise INVALID Context', () => {
    FixedSizeContext.validNumberOfSegments = 4
    let id1 = new FixedSizeContext("!section/organism/element/atom")
    expect(id1.type).toEqual(FixedSizedContextType.INVALID)
    expect(id1.toString()).toEqual("")
})

test('initialise INVALID Context (2)', () => {
    FixedSizeContext.validNumberOfSegments = 4
    let id1 = new FixedSizeContext("some random string")
    expect(id1.type).toEqual(FixedSizedContextType.INVALID)
    expect(id1.toString()).toEqual("")
})

test('simple merge Context', () => {
    let id1 = new FixedSizeContext("_/section/organism/element/atom")
    id1 = id1.merge("_/*/*/newElement/atom")    
    expect(id1.toString()).toEqual("section/organism/newElement/atom")
})

test('complex merge Context', () => {
    FixedSizeContext.validNumberOfSegments = 4
    let id1 = new FixedSizeContext("_/section")
    id1 = id1.merge("_/*/organism")    
    expect(id1.toString()).toEqual("_/section/organism")
    id1 = id1.merge("_/*/*/element")    
    expect(id1.toString()).toEqual("_/section/organism/element")
    id1 = id1.merge("_/*/*/*/atom")    
    expect(id1.toString()).toEqual("section/organism/element/atom")
})

test('malformed merge Context', () => {
    FixedSizeContext.validNumberOfSegments = 4
    let id1 = new FixedSizeContext("_/section/organism/element/atom")
    id1 = id1.merge("some other string")    
    expect(id1.toString()).toEqual("section/organism/element/atom")
})

test('duplicate Context', () => {
    let id1 = new FixedSizeContext("_/section/organism/element/atom")
    let id2 = id1.duplicate()
    id2.merge("_/some/other/stuff/here")
    expect(id1.toString()).not.toEqual(id2.toString())
})

test('duplicate Context (2)', () => {
    let id1 = new FixedSizeContext("_/section")
    let id2 = id1.duplicate()
    expect(id1.toString()).toEqual(id2.toString())
})

test('chaining duplicate & merge', () => {
    FixedSizeContext.validNumberOfSegments = 4
    let id1 = new FixedSizeContext("_/section/organism/element/atom")
    let id2 = id1.duplicate().merge("_/newSection")
    expect(id2.toString()).toEqual("newSection/organism/element/atom")
})

test('chaining duplicate & bad merge', () => {
    FixedSizeContext.validNumberOfSegments = 4
    let id1 = new FixedSizeContext("_/section/organism/element/atom")
    let id2 = id1.duplicate().merge("some malformed string")
    expect(id2.toString()).toEqual("section/organism/element/atom")
})

test('mergeLastSegment leading /', () => {
    FixedSizeContext.validNumberOfSegments = 4
    let id1 = new FixedSizeContext("_/section/organism/element/atom")
    id1 = id1.mergeLastSegment("/nSection/nOrganism/nElement/nATOM")
    expect(id1.toString()).toEqual("section/organism/element/nATOM")
})

test('mergeLastSegment no leading /', () => {
    FixedSizeContext.validNumberOfSegments = 4
    let id1 = new FixedSizeContext("_/section/organism/element/atom")
    id1 = id1.mergeLastSegment("nSection/nOrganism/nElement/nATOM")
    expect(id1.toString()).toEqual("section/organism/element/nATOM")
})

test('mergeLastSegment atom', () => {
    FixedSizeContext.validNumberOfSegments = 4
    let id1 = new FixedSizeContext("_/section")
    id1 = id1.mergeLastSegment("nSection/nOrganism/nElement/nATOM")
    expect(id1.toString()).toEqual("section/*/*/nATOM")
})

test('mergeLastSegment malformed data /', () => {
    FixedSizeContext.validNumberOfSegments = 4
    let id1 = new FixedSizeContext("_/section/organism/element/atom")
    id1 = id1.mergeLastSegment("")
    expect(id1.toString()).toEqual("_/section/organism/element/atom")
})

test('types - switch', () => {
    FixedSizeContext.validNumberOfSegments = 4
    let id1 = new FixedSizeContext("_/section/organism")
    expect(id1.type).toEqual(FixedSizedContextType.SWITCH)

    let id2 = new FixedSizeContext("section/organism/element/atom")
    expect(id2.type).toEqual(FixedSizedContextType.ATOM)

    let id2a = new FixedSizeContext("/section/organism/element/atom")
    expect(id2a.type).toEqual(FixedSizedContextType.ATOM)

    let id3 = new FixedSizeContext("!section/organism")
    expect(id3.type).toEqual(FixedSizedContextType.INVALID)

    let id4 = new FixedSizeContext("organism/element/atom")
    expect(id4.type).toEqual(FixedSizedContextType.INVALID)

    let id5 = new FixedSizeContext("some random string")
    expect(id5.type).toEqual(FixedSizedContextType.INVALID)
})

test('name with --radius at the end', () => {
    let id1 = new FixedSizeContext("_/section/organism")
    
})