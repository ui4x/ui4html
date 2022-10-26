---
layout: page
title: Usability
---

On this page: Notes and examples on how ui4 tries to make resulting UI match the expectations of
the developer connecting the elements. In other words, how we try to avoid surprises.

### Conflicting connections - Initial setup

It is easy to accidentally define an impossible layout. For example, defining `width` in addition to
`left` and `right` is redundant or, more likely, conflicting.

To avoid conflicting constraints, ui4 allows you to define only 2 constraints in each dimension. In
other words, you can only define two of:
- `width`, `centerx`, `left`, `right` in the horizontal dimension
- `height`, `centery`, `top`, `bottom` in the vertical dimension.

If you accidentally break this rule, ui4 will drop all but the first 2 constraints in each
dimension. The order of priority follows the lists above.

As an example, if you define `centerx`, `left` and `right`, ui4 will drop the `right` constraint,
because logically `right` cannot be anywhere else but as far to the right from `centerx` as `left`
is to the left of it.

```html example transparent 2
<div style="background-color: #6495ED55" centery="centery" left="centerx-100" right="right" height="50"></div>
<div id="sample" style="background-color: cornflowerblue"
centerx="centerx" left="centerx-100" right="right"
centery="centery" height="50">
</div>
<div centerx="sample.left" bottom="sample.top-gap">left</div>
<div centerx="sample.left" top="sample.top-gap" bottom="sample.bottom+gap" width="2" style="background-color: black"></div>
<div centerx="sample.centerx" bottom="sample.top-gap">centerx</div>
<div centerx="sample.centerx" top="sample.top-gap" bottom="sample.bottom+gap" width="2" style="background-color: black"></div>
<div style="color: grey" id="discarded" right="right" bottom="sample.top-gap">right</div>
<div center="discarded.center" style="font-size: 20px; color: red">X</div> 
<div right="right" top="sample.top-gap" bottom="sample.bottom+gap" width="2" style="background-color: grey"></div>
<div id="arrow" style="background-color: grey" centery="sample.centery" right="right" left="sample.right" height="2"></div>
<div style="color: grey" centery="arrow.centery" centerx="arrow.left">◀︎</div>
```

### Conflicting connections - Adding a connection


### Invisible elements

When laying out the UI, divs are useful tools to create structure or as placeholders for other
elements that are added later. Challenge with empty divs is that they do not have a size, and it is
easy to end up with an empty screen in the early stages of building the UI. To avoid this, ui4
ensures that every element has a width and a height.