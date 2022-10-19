Are you looking to create a web application instead of a document?
Is CSS with its multiple layout engines too complicated for your needs? 

ui4 provides an alternative for placing UI elements on the screen. Let's look at some examples:

#### "Connect this to the corner"

```html example solid_sized
<div id="square" top="top" left="left"></div>
```

Pretty close to CSS `top` or `left`, just with the little gaps added between the element and the
edges of the parent.

Note that there is no need to identify the parent by id, but `left="parent_id.left"` works, and can
make the layout more readable.

In addition to `top` and `left`, you can also use `bottom`, `right`, `width`, `height`, `centerx`
and `centery`.

#### "Connect A to B"

```html example solid_sized
<div id="a" top="b.bottom" left="b.left">A</div>
<div id="b" top="top" left="left">B</div>
```

Same `top` and `left` work with peer elements in an intuitive way, "pushing" against them instead
of aligning with the edge.

#### "I want them closer"

```html example solid_sized
<div id="a" top="b.bottom-(gap-1)" left="b.left">A</div>
<div id="b" top="top" left="left">B</div>
```

Simple math is available, including `min` and `max`. `gap` is by default 8 (px). In the example it
is used to make sure there is only 1 pixel between A and B, no matter what the gap has been set to.

#### "Just put it in the center"

```html example solid_sized
<div id="centered" dock="center"></div>
```

Instead of using the primitives (like `centerx` and `centery` in this case), `dock` provides
convenient and easier to read options.

#### "This is a top banner"

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

#### "Put A above B"

```html example solid 1
<div id="a" dock="b.above" height="30">A</div>
<div id="b" dock="center" width="50" height="30">B</div>
```

These convenience docking options, `above`, `below`, `rightof` and `leftof`, place the element
beside another one and set the shared dimension (width in the example above) to be the same.

#### "A should be between these two guys"

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

#### "No, I mean stretched all the way between them"

```html example solid 3
<div id="b" dock="left" width="40">B</div>
<div id="c" dock="right" width="40">C</div>
<div id="a" dock="between(b.right, c.left)">A</div>
```

#### "This is a third of the size of the whole thing"

```html example solid 1
<div id="one_third" dock="left" width="share(1, 3)"></div>
<div id="another" style="background-color: #eeeeee" dock="one_third.rightof" width="share(1, 3)"></div>
<div id="and_another" style="background-color: #eeeeee" dock="right" width="share(1, 3)"></div>
```

Because of the gaps, just dividing the width by 3 is not accurate, so we use a convenience function
for getting "gap-observing" shares of the whole.

Of course, rather than managing sizes like this, you want to...

#### "Just throw some boxes in there"

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