---
layout: page
title: Basics
---

ui4 provides an alternative to CSS for placing HTML elements on the screen. Let's look at some
examples:

**"Connect this to the corner"**

<sub>EXAMPLE 1</sub>
```html
<div id="square" top="top" left="left"></div>
```

<iframe style="border-style:none;box-shadow:0px 0px 2px 2px rgba(0,0,0,0.2);" src="examples/example0001.html"></iframe></br>
<a href="examples/example0001.html">Open in full screen</a>

Here we connect the element to the left and top edges of the parent. Unless you say otherwise,
a standard gap of 8px is left between an element and whatever it is connected to.

Note that there is no need to identify the parent by id, but `left="parent_id.left"` works, and can
make the layout more readable.

In addition to `top` and `left`, you can also use `bottom`, `right`, `width`, `height`, `centerx`
and `centery`.

**"Can I have an alternative syntax, please"**

<sub>EXAMPLE 2</sub>
```html
<div id="square" ui4="top=top; left=left"></div>
```

<iframe style="border-style:none;box-shadow:0px 0px 2px 2px rgba(0,0,0,0.2);" src="examples/example0002.html"></iframe></br>
<a href="examples/example0002.html">Open in full screen</a>

Instead of separate attributes, you can collect all the connections in one `ui4` attribute,
separating them with a semicolon. Spaces can be used to make the spec more readable, but have
no effect on the final result.

**"Connect A to B"**

<sub>EXAMPLE 3</sub>
```html
<div id="a" top="b.bottom" left="b.left">A</div>
<div id="b" top="top" left="left">B</div>
```

<iframe style="border-style:none;box-shadow:0px 0px 2px 2px rgba(0,0,0,0.2);" src="examples/example0003.html"></iframe></br>
<a href="examples/example0003.html">Open in full screen</a>

Same `top`, `left`, `width` etc. work with peer elements in an intuitive way, aligning with the
edges or size of the peer element instead of the parent. Gap is again left between the elements
whenever they are "pushing" against each other.

**"I want them closer"**

<sub>EXAMPLE 4</sub>
```html
<div id="a" top="b.bottom-(gap-1)" left="b.left">A</div>
<div id="b" top="top" left="left">B</div>
```

<iframe style="border-style:none;box-shadow:0px 0px 2px 2px rgba(0,0,0,0.2);" src="examples/example0004.html"></iframe></br>
<a href="examples/example0004.html">Open in full screen</a>

Simple math is available, including `min` and `max`. `gap` is by default 8 (px). In the example it
is used to make sure there is only 1 pixel between A and B, no matter what the gap has been set to.

> You can change the standard gap of 8 px in these ways:
> - Adding some modifiers, like in the example above
> - With a `gap` attribute that sets the default for all the child elements
> - Setting a global value, e.g. to 4 px with `<script>globalGap(4)</script>`

#### "Just put it in the center"

<sub>EXAMPLE 5</sub>
```html
<div id="centered" dock="center"></div>
```

<iframe style="border-style:none;box-shadow:0px 0px 2px 2px rgba(0,0,0,0.2);" src="examples/example0005.html"></iframe></br>
<a href="examples/example0005.html">Open in full screen</a>

Instead of using the primitives (like `centerx` and `centery` in this case), `dock` provides
convenient and easier to read options.

#### "This is a top banner"

<sub>EXAMPLE 6</sub>
```html
<div id="topBanner" dock="top" height="30"></div>
```

<iframe style="border-style:none;box-shadow:0px 0px 2px 2px rgba(0,0,0,0.2);" src="examples/example0006.html"></iframe></br>
<a href="examples/example0006.html">Open in full screen</a>

Docking to the top connects the left, top and right edges of the element; bottom or height is set
separately.

All the options for docking to the parent are:
- `top`, `left`, `right`, `bottom`
- `topleft`, `topright`, `bottomleft`, `bottomright`
- `topcenter`, `leftcenter`, `rightcenter`, `bottomcenter`
- `center`, `all`

#### "Put A above B"

<sub>EXAMPLE 7</sub>
```html
<div id="a" dock="b.above" height="30">A</div>
```

<iframe style="border-style:none;box-shadow:0px 0px 2px 2px rgba(0,0,0,0.2);" src="examples/example0007.html"></iframe></br>
<a href="examples/example0007.html">Open in full screen</a>

These convenience docking options, `above`, `below`, `rightof` and `leftof`, place the element
beside another one and set the shared dimension (width in the example above) to be the same.

#### "A should be between these two guys"

<sub>EXAMPLE 8</sub>
```html
<div id="a" dock="between(b, c)" size="b.size">A</div>
```

<iframe style="border-style:none;box-shadow:0px 0px 2px 2px rgba(0,0,0,0.2);" src="examples/example0008.html"></iframe></br>
<a href="examples/example0008.html">Open in full screen</a>

Here, "between" means the center of the element is placed halfway between the centers of the other
two elements.

We also use the `size` shorthand instead of specifying `width` and `height` separately. Other
available shorthands are `position` (instead of `left` and `top`) and `frame` (matching both size
and position).

#### "No, I mean stretched all the way between them"

<sub>EXAMPLE 9</sub>
```html
<div id="a" dock="between(b.right, c.left)">A</div>
```

<iframe style="border-style:none;box-shadow:0px 0px 2px 2px rgba(0,0,0,0.2);" src="examples/example0009.html"></iframe></br>
<a href="examples/example0009.html">Open in full screen</a>

#### "This is a third of the size of the whole thing"

<sub>EXAMPLE 10</sub>
```html
<div id="one_third" dock="left" width="share(1, 3)"></div>
```

<iframe style="border-style:none;box-shadow:0px 0px 2px 2px rgba(0,0,0,0.2);" src="examples/example0010.html"></iframe></br>
<a href="examples/example0010.html">Open in full screen</a>

Because of the gaps, just dividing the width by 3 is not accurate, so we use a convenience function
for getting "gap-observing" shares of the whole.

Of course, rather than managing sizes like this, you want to...

#### "Just throw some boxes in there"

<sub>EXAMPLE 11</sub>
```html
<div id="resizable" layout="grid">
    <div></div>
    <div></div>
    <div></div>
</div>
```

<iframe style="border-style:none;box-shadow:0px 0px 2px 2px rgba(0,0,0,0.2);" src="examples/example0011.html"></iframe></br>
<a href="examples/example0011.html">Open in full screen</a>

Grid layout takes whatever you give it and layouts them so that they are as square as possible but
still fill the available space. Try resizing the example to see how it behaves (handle in the
bottom right corner).