---
layout: page
title: Research
---

_Similar works and things to learn from them:_

**Apple UIKit constraints**
- Auto Layout 2011-2016
- Constraints as a set of equations to be solved, could result in an ambiguous or invalid layout
- Many open source convenience libraries built on top
- Seems like Apple walked away from these even before they walked away from ObjC
- Connecting to parent or peer looks similar and can be handled consistently
- Concept of device-specific safe areas that avoid e.g. the notch
- Everything always rounded to nearest pixel at the end of the layout

Constraint solvers
- [Cassowary.js](https://github.com/slightlyoff/cassowary.js)
- [LUME Kiwi](https://github.com/lume/kiwi) - faster reimplementation of the previous

[LUME AutoLayout](https://github.com/lume/autolayout)
- Apple's Auto Layout implementation in JS using the same constraint language.
- Nice online editor for experimentation and debugging.
- Fork of an earlier autolayout.js.
- Supports Apple's VFL, but adds opt-in features (Extended VFL).
- Has an explicit constraint option that looks very similar to ui4html.
- Potentially interesting features to consider for ui4: z-ordering, ranges (spread ..)

**Apple SwiftUI**
- Dropped the idea of Auto Layout (more Flutter-y)
- Layout is always valid
  
[Nativescript-Vue](https://nativescript-vue.org/en/docs/introduction/)
- [DockLayout](https://nativescript-vue.org/en/docs/elements/layouts/dock-layout/),
  [FlexboxLayout](https://nativescript-vue.org/en/docs/elements/layouts/flexbox-layout/),
  [GridLayout](https://nativescript-vue.org/en/docs/elements/layouts/grid-layout/)
- Other typical layouts like RowLayout, StackLayout
- DockLayout is interesting because the docking areas are filled and managed by the
  layout manager not to be overlapping (i.e. dock 2 to right is same as `dock=right` plus
  `dock=first.leftof`)
- GridLayout has relatively sized columns, rows

[Android](https://developer.android.com/develop/ui/views/layout/constraint-layout)
- Similar to UIKit, but only as one type of layout manager, not as a fundamental building block.
- Text baseline alignment
- Guidelines and dividers can be implemented with divs with 0 width or height
- Size as ratio

[React constraints](https://github.com/kwameopareasiedu/react-constraint-layout)
- Remove the HTML attribute after parsing, does it make a difference for the "hygiene"?
  
[Grid Style Sheets](https://gss.github.io)
- [Constraint CSS](https://gss.github.io/guides/ccss)
- Constraints as equations
- Abandoned, "never used much beyond company internal implementation", "too heavy computationally"

[Flutter ConstraintLayout](https://github.com/hackware1993/Flutter_ConstraintLayout)
- Seems to tick all the boxes
- Some things to ~~steal~~ learn from:
  - Control over z - idea: layer=lower, lowest, higher, highest, id.lower, id.higher
  - Relative references to other elements - idea: previous.below, next, peer()
  - ratio, again - ratio=16/9, translates to setting the unset dimension
  - translate, rotate?
  - polar coordinates? - angle, distance
