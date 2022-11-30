---
layout: page
title: Basics
---

ui4 provides an alternative to CSS for placing HTML elements on the screen. Let's look at some
examples:

---------------

### Connect to the edges

```html example solid_sized
<div id="square" top="top" left="left"></div>
```

Here we connect the element to the left and top edges of the parent. Unless you say otherwise,
a standard gap of 8px is left between an element and whatever it is connected to.

Note that there is no need to identify the parent by id, but `left="parent_id.left"` works, and can
make the layout more readable.

In addition to `top` and `left`, we have `bottom`, `right`, `width`, `height`, `centerx`
and `centery`.

---------------

### Alternative syntax

```html example solid_sized
<div id="square" ui4="top=top; left=left"></div>
```

Instead of separate attributes, you can collect all the connections in one `ui4` attribute,
separating them with a semicolon. Spaces can be used to make the spec more readable, but have
no effect on the final result.

---------------

### Connect peer elements

```html example solid_sized
<div id="a" top="b.bottom" left="b.left">A</div>
<div id="b" top="top" left="left">B</div>
```

Same `top`, `left`, `width` etc. work with peer elements in an intuitive way, aligning with the
edges or size of the peer element instead of the parent. Gap is again left between the elements
whenever they are "pushing" against each other.

---------------

### Fine-tuning

```html example solid_sized
<div id="a" top="b.bottom-(gap-1)" left="b.left">A</div>
<div id="b" top="top" left="left">B</div>
```

Simple math is available, including `min` and `max`. `gap` is by default 8 (px). In the example it
is used to make sure there is only 1 pixel between A and B, no matter what the gap has been set to.

> You can change the standard gap of 8 px in these ways:
> - Adding some modifiers, like in the example above
> - With a `gap` attribute that sets the default for all the child elements
> - Setting a global value, e.g. to 4 px with `<script>globalGap(4)</script>`

---------------

### Docking shortcuts

```html example solid_sized
<div id="centered" dock="center"></div>
```

Instead of using the primitives (like `centerx` and `centery` in this case), `dock` provides
convenient and easier-to-read options.

---------------

### Docking to edges

```html example solid
<div id="topBanner" dock="top" height="30"></div>
```

Docking to the top connects the left, top and right edges of the element; bottom or height is set
separately.

All the options for docking to the parent are:
- `top`, `left`, `right`, `bottom`
- `topleft`, `topright`, `bottomleft`, `bottomright`
- `topcenter`, `leftcenter`, `rightcenter`, `bottomcenter`
- `center`, `all`

---------------

### Dock to a peer element

```html example solid 1
<div id="a" dock="b.above" height="30">A</div>
<div id="b" dock="center" width="50" height="30">B</div>
```

These convenience docking options, `above`, `below`, `rightof` and `leftof`, place the element
beside another one and set the shared dimension (width in the example above) to be the same.

---------------

### Docking between other elements

```html example solid 3
<div id="b" dock="left" width="40">B</div>
<div id="c" dock="right" width="40">C</div>
<div id="a" dock="between(b, c)" size="b.size">A</div>
```

Here, "between" means the center of the element is placed halfway between the centers of the other
two elements.

We also use the `size` shorthand instead of specifying `width` and `height` separately. Other
available shorthands are `position` (instead of `left` and `top`) and `frame` (matching both size
and position).

---------------

### Filling the available space

```html example solid 3
<div id="b" dock="left" width="40">B</div>
<div id="c" dock="right" width="40">C</div>
<div id="a" dock="between(b.right, c.left)">A</div>
```

---------------

### Fix the aspect ratio

```html example solid
<div centery="centery" centerx="width/3" width=40 ratio="16/9"></div>
<div centery="centery" centerx="width*2/3" height=40 ratio="16/9"></div>
```

Point of `ratio` is to make the aspect ratio visible and easily readable. For squares (`ratio="1"`),
it lets you adjust just one dimension to change the size of the square.

---------------

### Taking a relative share of the available space

```html example solid 1
<div dock="left" width="share(1, 3)"></div>
<div dock="center" height="previous.height" width="share(1, 3)" style="background-color: #eeeeee" ></div>
<div dock="right" width="share(1, 3)" style="background-color: #eeeeee" ></div>
```

Because of the gaps, just dividing the width by 3 is not accurate, so we use a convenience function
for getting "gap-observing" shares of the whole.

Of course, rather than managing sizes like this, you might want to use a ...

---------------

### Grid

```html example solid_resizable
<div id="resizable" layout="grid">
    <div></div>
    <div></div>
    <div></div>
</div>
```

Grid layout takes whatever you give it and layouts them so that they are as square as possible but
still fill the available space. Try resizing the example to see how it behaves (handle in the
bottom right corner).
