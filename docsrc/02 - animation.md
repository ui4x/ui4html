---
layout: page
---

# Animations

If you connect an element to another element with one of the ui4 attributes, and then animate the
first element with CSS or Javascript, the connected element naturally animates with the first.

In this example we use CSS to animate the first element width on hover.

```html example animation_hover
<div id="first" dock="center">Hover over me</div>
<div id="second" dock="first.below" bottom="bottom"></div>
```

The example above works because we did not use ui4 to fix the dimension that was animated with CSS,
so there was no conflict. The next example is otherwise identical, but ui4 width keeps the width
fixed, and hovering has no effect.

```html example animation_hover
<div id="first" dock="center" width="125">No hover for me</div>
<div id="second" dock="first.below" bottom="bottom"></div>
```

To stick to the principle of locality, and to avoid issues of CSS and ui4 conflicting, we can apply
animations as a part of the constraint directly, as in the following example:

```html example solid
<div id="first" dock="center:1s" width="125" height="50">Hello!</div>
```

ui4 JS interface can also be used to set animated constraints in event handlers:

```html example solid
<div id="first" dock="center" width="125" height="50">Hello</div>
<button id="second" frame="first.frame" 
        onclick="ui4.set(this, 'top=first.bottom:0.5s')">
    Click me
</button>
```

Animations can be chained with an arrow syntax:

```html
<div id="first" dock="center" width="125" height="50">Hello</div>
<button id="second" frame="first.frame" 
        onclick="ui4.set(this, 'top=first.bottom:0.5s >>> top=first.top:0.5s')">
    Click me
</button>
```