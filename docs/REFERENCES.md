---
layout: page
---

Similar works and things to learn from them:

Practical implementations

**Apple UIKit constraints**
- Auto Layout 2011-2016
- Constraints as a set of equations to be solved, could result in an ambiguous or invalid layout
- Many open source convenience libraries built on top
- Seems like Apple walked away from these even before they walked away from ObjC
- Connecting to parent or peer looks similar and can be handled consistently
- Concept of device-specific safe areas that avoid e.g. the notch
- Everything always rounded to nearest pixel at the end of the layout
  
**Apple SwiftUI**
- Dropped the idea of Auto Layout (more Flutter-y)
- Layout is always valid
  
**Nativescript-Vue**
- Different typical layouts like
- DockingLayout is interesting because the docking areas are filled and managed by the
  layout manager not to be overlapping (i.e. dock 2 to right is same as `dock="right"` plus
  `dock="first.leftof"`)

**Android**
- Similar to UIKit, but only as one type of layout manager, not as a fundamental building block.
- Text baseline alignment
- Guidelines and dividers can be implemented with divs with 0 width or height
- Size as ratio

**React constraints**
- Remove the HTML attribute after parsing, does it make a difference for the "hygiene"?
  
**GSS & Constraint CSS**
- Constraints as equations
- Abandoned, "never used much beyond company internal implementation", "too heavy computationally"
