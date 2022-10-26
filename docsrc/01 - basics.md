---
layout: page
title: Basics
---

ui4 provides an alternative to CSS for placing HTML elements on the screen. Let's look at some
examples:

---------------

### "Connect this to the corner"

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

### "Can I have an alternative syntax, please"

```html example solid_sized
<div id="square" ui4="top=top; left=left"></div>
```

Instead of separate attributes, you can collect all the connections in one `ui4` attribute,
separating them with a semicolon. Spaces can be used to make the spec more readable, but have
no effect on the final result.

---------------

### "Connect A to B"

```html example solid_sized
<div id="a" top="b.bottom" left="b.left">A</div>
<div id="b" top="top" left="left">B</div>
```

Same `top`, `left`, `width` etc. work with peer elements in an intuitive way, aligning with the
edges or size of the peer element instead of the parent. Gap is again left between the elements
whenever they are "pushing" against each other.

---------------

### "I want them closer, and I am not afraid of some math"

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

### "Just put it in the center"

```html example solid_sized
<div id="centered" dock="center"></div>
```

Instead of using the primitives (like `centerx` and `centery` in this case), `dock` provides
convenient and easier-to-read options.

---------------

### "This is a top banner"

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

### "Put A above B"

```html example solid 1
<div id="a" dock="b.above" height="30">A</div>
<div id="b" dock="center" width="50" height="30">B</div>
```

These convenience docking options, `above`, `below`, `rightof` and `leftof`, place the element
beside another one and set the shared dimension (width in the example above) to be the same.

---------------

### "A should be between these two guys"

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

### "...no, I mean stretched all the way between them"

```html example solid 3
<div id="b" dock="left" width="40">B</div>
<div id="c" dock="right" width="40">C</div>
<div id="a" dock="between(b.right, c.left)">A</div>
```

---------------

### "This is a third of the size of the whole thing"

```html example solid 1
<div id="one_third" dock="left" width="share(1, 3)"></div>
<div id="another" style="background-color: #eeeeee" dock="one_third.rightof" width="share(1, 3)"></div>
<div id="and_another" style="background-color: #eeeeee" dock="right" width="share(1, 3)"></div>
```

Because of the gaps, just dividing the width by 3 is not accurate, so we use a convenience function
for getting "gap-observing" shares of the whole.

Of course, rather than managing sizes like this, you want to...

---------------

### "Just throw some boxes in there"

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

----------------

### "Let them run free"

```html example solid
<div dock="center" left="left" width="50" height="50"></div>
```
