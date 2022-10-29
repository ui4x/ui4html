---
layout: page
title: Usability
---

On this page: Notes and examples on how ui4 tries to make resulting UI match the expectations of
the developer connecting the elements. In other words, avoiding surprises.

---------------

### Dealing with conflicting connections

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

```html example button_solid 11
<div id="behind" style="background-color: #6495ED55" centery="centery" left="centerx-100" right="right" height="50"></div>
<div right="behind.left" centery="centery">left</div>
<div centerx="behind.left-1" top="behind.top" bottom="behind.bottom" width="2" style="background-color: black"></div>
<div centerx="centerx" bottom="behind.top-gap">centerx</div>
<div centerx="centerx" top="behind.top-gap" bottom="behind.bottom+gap" width="2" style="background-color: black"></div>
<div style="color: grey" id="discarded" right="right" bottom="behind.top-gap">right</div>
<div center="discarded.center" style="font-size: 20px; color: red">X</div> 
<div right="right" top="behind.top-gap" bottom="behind.bottom+gap" width="2" style="background-color: grey"></div>
<div id="arrow" style="background-color: grey" centery="behind.centery" right="right" left="centerx+100+gap" height="2"></div>
<div style="color: grey" centery="arrow.centery" centerx="arrow.left">◀︎</div>
<button dock="center" left="centerx-100" right="right" height="50"></button>
```

---------------

### Adding a connection

When you add a new connection with `ui4.set`, the logic of handling conflicting combinations
changes: the just-added connection "always wins"; the other survivor is then selected in
the same priority order as shown above.

```html example button_solid 5-8
<div right="centerx-100-gap" centery="centery">left</div>
<div centerx="centerx-100-1" top="centery-25" bottom="centery+25" width="2" style="background-color: black"></div>
<div centerx="centerx" bottom="centery-25-gap">centerx</div>
<div centerx="centerx" top="centery-25-gap" bottom="centery+25+gap" width="2" style="background-color: black"></div>
<button centerx="centerx" left="centerx-100" height="50" centery="centery"
        onclick="ui4.set(this, 'right=right:0.5s')">
    Click to expand
</button>
```

Here, when we add a fix for `right` on button click, it wins over left even if ordinarily it would
have lower priority, and `left` is removed.

---------------

### Making sure elements have a size

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

---------------

### Debug mode

Debug mode can be turned on by adding `<script>ui4.debug()</script>` somewhere after importing ui4.
