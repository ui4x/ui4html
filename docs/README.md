Are you looking to create a web application instead of a document?
Is CSS with its multiple layout engines too complicated for your needs? 

ui4 provides an alternative for placing UI elements on the screen. Let's look at some examples:

#### "Connect this to the corner"


<table class="example">
  <tr>
    <td>
      <sub>EXAMPLE 1</sub>
      <pre>&lt;div id="square" top="top" left="left">&lt;/div></pre>
    </td>
    <td>
      <iframe style="border-style:none;box-shadow:0px 0px 2px 2px rgba(0,0,0,0.2);" src="examples/example0001.html"></iframe><br/>
      <button onclick="location.href='examples/example0001.html'">Open in full screen</button>
    </td>
  </tr>
</table>

Pretty close to CSS `top` or `left`, just with the little gaps added between the element and the
edges of the parent.

Note that there is no need to identify the parent by id, but `left="parent_id.left"` works, and can
make the layout more readable.

In addition to `top` and `left`, you can also use `bottom`, `right`, `width`, `height`, `centerx`
and `centery`.

#### "Connect A to B"


<table class="example">
  <tr>
    <td>
      <sub>EXAMPLE 2</sub>
      <pre>&lt;div id="a" top="b.bottom" left="b.left">A&lt;/div>
&lt;div id="b" top="top" left="left">B&lt;/div></pre>
    </td>
    <td>
      <iframe style="border-style:none;box-shadow:0px 0px 2px 2px rgba(0,0,0,0.2);" src="examples/example0002.html"></iframe><br/>
      <button onclick="location.href='examples/example0002.html'">Open in full screen</button>
    </td>
  </tr>
</table>

Same `top` and `left` work with peer elements in an intuitive way, "pushing" against them instead
of aligning with the edge.

#### "I want them closer"


<table class="example">
  <tr>
    <td>
      <sub>EXAMPLE 3</sub>
      <pre>&lt;div id="a" top="b.bottom-(gap-1)" left="b.left">A&lt;/div>
&lt;div id="b" top="top" left="left">B&lt;/div></pre>
    </td>
    <td>
      <iframe style="border-style:none;box-shadow:0px 0px 2px 2px rgba(0,0,0,0.2);" src="examples/example0003.html"></iframe><br/>
      <button onclick="location.href='examples/example0003.html'">Open in full screen</button>
    </td>
  </tr>
</table>

Simple math is available, including `min` and `max`. `gap` is by default 8 (px). In the example it
is used to make sure there is only 1 pixel between A and B, no matter what the gap has been set to.

#### "Just put it in the center"


<table class="example">
  <tr>
    <td>
      <sub>EXAMPLE 4</sub>
      <pre>&lt;div id="centered" dock="center">&lt;/div></pre>
    </td>
    <td>
      <iframe style="border-style:none;box-shadow:0px 0px 2px 2px rgba(0,0,0,0.2);" src="examples/example0004.html"></iframe><br/>
      <button onclick="location.href='examples/example0004.html'">Open in full screen</button>
    </td>
  </tr>
</table>

Instead of using the primitives (like `centerx` and `centery` in this case), `dock` provides
convenient and easier to read options.

#### "This is a top banner"


<table class="example">
  <tr>
    <td>
      <sub>EXAMPLE 5</sub>
      <pre>&lt;div id="topBanner" dock="top" height="30">&lt;/div></pre>
    </td>
    <td>
      <iframe style="border-style:none;box-shadow:0px 0px 2px 2px rgba(0,0,0,0.2);" src="examples/example0005.html"></iframe><br/>
      <button onclick="location.href='examples/example0005.html'">Open in full screen</button>
    </td>
  </tr>
</table>

Docking to the top connects the left, top and right edges of the element; bottom or height is set
separately.

All the options for docking to the parent are:
- `top`, `left`, `right`, `bottom`
- `topleft`, `topright`, `bottomleft`, `bottomright`
- `topcenter`, `leftcenter`, `rightcenter`, `bottomcenter`
- `center`, `all`

#### "Put A above B"


<table class="example">
  <tr>
    <td>
      <sub>EXAMPLE 6</sub>
      <pre>&lt;div id="a" dock="b.above" height="30">A&lt;/div></pre>
    </td>
    <td>
      <iframe style="border-style:none;box-shadow:0px 0px 2px 2px rgba(0,0,0,0.2);" src="examples/example0006.html"></iframe><br/>
      <button onclick="location.href='examples/example0006.html'">Open in full screen</button>
    </td>
  </tr>
</table>

These convenience docking options, `above`, `below`, `rightof` and `leftof`, place the element
beside another one and set the shared dimension (width in the example above) to be the same.

#### "A should be between these two guys"


<table class="example">
  <tr>
    <td>
      <sub>EXAMPLE 7</sub>
      <pre>&lt;div id="a" dock="between(b, c)" size="b.size">A&lt;/div></pre>
    </td>
    <td>
      <iframe style="border-style:none;box-shadow:0px 0px 2px 2px rgba(0,0,0,0.2);" src="examples/example0007.html"></iframe><br/>
      <button onclick="location.href='examples/example0007.html'">Open in full screen</button>
    </td>
  </tr>
</table>

Here, "between" means the center of the element is placed halfway between the centers of the other
two elements.

We also use the `size` shorthand instead of specifying `width` and `height` separately. Other
available shorthands are `position` (instead of `left` and `top`) and `frame` (matching both size
and position).

#### "No, I mean stretched all the way between them"


<table class="example">
  <tr>
    <td>
      <sub>EXAMPLE 8</sub>
      <pre>&lt;div id="a" dock="between(b.right, c.left)">A&lt;/div></pre>
    </td>
    <td>
      <iframe style="border-style:none;box-shadow:0px 0px 2px 2px rgba(0,0,0,0.2);" src="examples/example0008.html"></iframe><br/>
      <button onclick="location.href='examples/example0008.html'">Open in full screen</button>
    </td>
  </tr>
</table>

#### "This is a third of the size of the whole thing"


<table class="example">
  <tr>
    <td>
      <sub>EXAMPLE 9</sub>
      <pre>&lt;div id="one_third" dock="left" width="share(1, 3)">&lt;/div></pre>
    </td>
    <td>
      <iframe style="border-style:none;box-shadow:0px 0px 2px 2px rgba(0,0,0,0.2);" src="examples/example0009.html"></iframe><br/>
      <button onclick="location.href='examples/example0009.html'">Open in full screen</button>
    </td>
  </tr>
</table>

Because of the gaps, just dividing the width by 3 is not accurate, so we use a convenience function
for getting "gap-observing" shares of the whole.

Of course, rather than managing sizes like this, you want to...

#### "Just throw some boxes in there"


<table class="example">
  <tr>
    <td>
      <sub>EXAMPLE 10</sub>
      <pre>&lt;div id="resizable" layout="grid">
    &lt;div>&lt;/div>
    &lt;div>&lt;/div>
    &lt;div>&lt;/div>
&lt;/div></pre>
    </td>
    <td>
      <iframe style="border-style:none;box-shadow:0px 0px 2px 2px rgba(0,0,0,0.2);" src="examples/example0010.html"></iframe><br/>
      <button onclick="location.href='examples/example0010.html'">Open in full screen</button>
    </td>
  </tr>
</table>

Grid layout takes whatever you give it and layouts them so that they are as square as possible but
still fill the available space. Try resizing the example to see how it behaves (handle in the
bottom right corner).