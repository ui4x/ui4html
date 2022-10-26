---
layout: page
title: Animations
---

If you connect an element to another element with one of the ui4 attributes, and then animate the
first element with CSS or Javascript, the connected element naturally animates with the first.

In this example we use CSS to animate the first element width on hover.

<sub>EXAMPLE 03.01</sub>
```html
<div id="first" dock="center">Hover over me</div>
<div id="second" dock="first.below" bottom="bottom"></div>
```
<iframe style="border:1px solid #404040;border-radius:3px;background-color:#212121;" src="examples/example_03.01.html"></iframe>
<a style="color: #404040" href="examples/example_03.01.html">Open in full screen</a>

The example above works because we did not use ui4 to fix the dimension that was animated with CSS,
so there was no conflict. The next example is otherwise identical, but ui4 width keeps the width
fixed, and hovering has no effect.

<sub>EXAMPLE 03.02</sub>
```html
<div id="first" dock="center" width="125">No hover for me</div>
<div id="second" dock="first.below" bottom="bottom"></div>
```
<iframe style="border:1px solid #404040;border-radius:3px;background-color:#212121;" src="examples/example_03.02.html"></iframe>
<a style="color: #404040" href="examples/example_03.02.html">Open in full screen</a>

To stick to the principle of locality, and to avoid issues of CSS and ui4 conflicting, we can apply
animations as a part of the constraint directly, as in the following example:

<sub>EXAMPLE 03.03</sub>
```html
<div id="first" dock="center:1s" width="125" height="50">Hello!</div>
```
<iframe style="border:1px solid #404040;border-radius:3px;background-color:#212121;" src="examples/example_03.03.html"></iframe>
<a style="color: #404040" href="examples/example_03.03.html">Open in full screen</a>

ui4 JS interface can also be used to set animated constraints in event handlers:

<sub>EXAMPLE 03.04</sub>
```html
<div id="first" dock="center" width="125" height="50">Hello</div>
<button id="second" frame="first.frame" 
        onclick="ui4.set(this, 'top=first.bottom:0.5s')">
    Click me
</button>
```
<iframe style="border:1px solid #404040;border-radius:3px;background-color:#212121;" src="examples/example_03.04.html"></iframe>
<a style="color: #404040" href="examples/example_03.04.html">Open in full screen</a>

Animations often require one thing happening after another. They can be chained with the arrow
syntax:

<sub>EXAMPLE 03.05</sub>
```html
<div id="first" centery="centery" ui4="left=right >>> left=free >>> centerx=centerx:0.5s"></div>
```
<iframe style="border:1px solid #404040;border-radius:3px;background-color:#212121;" src="examples/example_03.05.html"></iframe>
<a style="color: #404040" href="examples/example_03.05.html">Open in full screen</a>

Here we first place the element just outside the right edge, without animation, then animate the
element to the center. This requires also explicitly freeing the left edge.