---
layout: page
title: Animations
---

If you connect an element to another element with one of the ui4 attributes, and then animate the
first element with CSS or Javascript, the connected element naturally animates with the first.

In this example we use CSS to animate the first element width on hover.

<sub>EXAMPLE 12</sub>
```html
<div id="first" dock="center">Hover over me</div>
<div id="second" dock="first.below" bottom="bottom"></div>
```
<iframe style="border:1px solid #404040;border-radius:3px;background-color:#212121;" src="examples/example0012.html"></iframe>
<a href="examples/example0012.html">Open in full screen</a>

The example above works because we did not use ui4 to fix the dimension that was animated with CSS,
so there was no conflict. The next example is otherwise identical, but ui4 width keeps the width
fixed, and hovering has no effect.

<sub>EXAMPLE 13</sub>
```html
<div id="first" dock="center" width="125">No hover for me</div>
<div id="second" dock="first.below" bottom="bottom"></div>
```
<iframe style="border:1px solid #404040;border-radius:3px;background-color:#212121;" src="examples/example0013.html"></iframe>
<a href="examples/example0013.html">Open in full screen</a>

To stick to the principle of locality, and to avoid issues of CSS and ui4 conflicting, we can apply
animations as a part of the constraint directly, as in the following example:

<sub>EXAMPLE 14</sub>
```html
<div id="first" dock="center:1s" width="125" height="50">Hello!</div>
```
<iframe style="border:1px solid #404040;border-radius:3px;background-color:#212121;" src="examples/example0014.html"></iframe>
<a href="examples/example0014.html">Open in full screen</a>

ui4 JS interface can also be used to set animated constraints in event handlers:

<sub>EXAMPLE 15</sub>
```html
<div id="first" dock="center" width="125" height="50">Hello</div>
<button id="second" frame="first.frame" 
        onclick="ui4.set(this, 'top=first.bottom:0.5s')">
    Click me
</button>
```
<iframe style="border:1px solid #404040;border-radius:3px;background-color:#212121;" src="examples/example0015.html"></iframe>
<a href="examples/example0015.html">Open in full screen</a>

Animations can be chained with an arrow syntax:

```html
<div id="first" dock="center" width="125" height="50">Hello</div>
<button id="second" frame="first.frame" 
        onclick="ui4.set(this, 'top=first.bottom:0.5s >>> top=first.top:0.5s')">
    Click me
</button>
```