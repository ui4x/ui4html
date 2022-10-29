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

<sub>EXAMPLE 04.01</sub>
```html
<button dock="center" left="centerx-100" right="right" height="50"></button>
```
<iframe style="border:1px solid #404040;border-radius:3px;background-color:#212121;" src="examples/example_04.01.html"></iframe>
<a style="color: #404040" href="examples/example_04.01.html">Open in full screen</a>

---------------

### Adding a connection

When you add a new connection with `ui4.set`, the logic of handling conflicting combinations
changes: the just-added connection "always wins"; the other survivor is then selected in
the same priority order as shown above.

<sub>EXAMPLE 04.02</sub>
```html
<button centerx="centerx" left="centerx-100" height="50" centery="centery"
        onclick="ui4.set(this, 'right=right:0.5s')">
    Click to expand
</button>
```
<iframe style="border:1px solid #404040;border-radius:3px;background-color:#212121;" src="examples/example_04.02.html"></iframe>
<a style="color: #404040" href="examples/example_04.02.html">Open in full screen</a>

Here, when we add a fix for `right` on button click, it wins over left even if ordinarily it would
have lower priority, and `left` is removed.

---------------

### Making sure elements have a size

When laying out the UI, divs are useful tools to create structure or as placeholders for other
elements that are added later. Challenge with empty divs is that they do not have a size, and it is
easy to end up with an empty screen in the early stages of building the UI. To avoid this, ui4
ensures that every element has a width and a height.

<sub>EXAMPLE 04.03</sub>
```html
<div center="center" height="50"></div>
```
<iframe style="border:1px solid #404040;border-radius:3px;background-color:#212121;" src="examples/example_04.03.html"></iframe>
<a style="color: #404040" href="examples/example_04.03.html">Open in full screen</a>

`div`s have no intrinsic size, and there is no content in the `div`, so by default it would have
0 width and be invisible. ui4 checks for these and sets any missing dimension to 100 px. You
_can_ still have 0-sized elements, but you have to set them explicitly to zero.

---------------

### Debug mode

Debug mode can be turned on by adding `<script>ui4.debug()</script>` somewhere after importing ui4.