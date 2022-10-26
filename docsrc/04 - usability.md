---
layout: page
title: Usability
---

On this page: Notes and examples on how ui4 tries to make resulting UI match the expectations of
the developer connecting the elements. In other words, how we try to avoid surprises.

### Conflicting connections - Initial

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

```html example transparent 3
<div id="behind" style="background-color: #6495ED55" centery="centery" left="centerx-100" right="right" height="50"></div>
<div style="background: #6495ED" dock="center" left="centerx-100" right="right" height="50"></div>
<div centerx="behind.left" bottom="behind.top-gap">left</div>
<div centerx="behind.left" top="behind.top-gap" bottom="behind.bottom+gap" width="2" style="background-color: black"></div>
<div centerx="centerx" bottom="behind.top-gap">centerx</div>
<div centerx="centerx" top="behind.top-gap" bottom="behind.bottom+gap" width="2" style="background-color: black"></div>
<div style="color: grey" id="discarded" right="right" bottom="behind.top-gap">right</div>
<div center="discarded.center" style="font-size: 20px; color: red">X</div> 
<div right="right" top="behind.top-gap" bottom="behind.bottom+gap" width="2" style="background-color: grey"></div>
<div id="arrow" style="background-color: grey" centery="behind.centery" right="right" left="centerx+100+gap" height="2"></div>
<div style="color: grey" centery="arrow.centery" centerx="arrow.left">◀︎</div>
```

### Conflicting connections - Adding a connection

When you add a new connection with `ui4.set`, the logic of handling conflicting combinations is
changes: the just-added connection "always wins"; the other survivor is then selected in
the same priority order as shown above.

### Invisible elements

When laying out the UI, divs are useful tools to create structure or as placeholders for other
elements that are added later. Challenge with empty divs is that they do not have a size, and it is
easy to end up with an empty screen in the early stages of building the UI. To avoid this, ui4
ensures that every element has a width and a height.

```html example solid
<div center="center" height="50"></div>
```

`div`s have no intrinsic size, and there is no content in the `div`, so by default it would have
0 width and be invisible. ui4 checks for these and sets any missing dimension to 100 px. You
_can_ still have 0-sized elements, but you have to set them explicitly to zero.

### Debug mode

Debug mode can be turned on by adding `<script>ui4.debug()</script>` somewhere after importing ui4.
