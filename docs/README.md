<video controls="" muted="" loop="" autoplay="" width="100%">
    <source src="intro.mp4" type="video/mp4">
</video>

ui4html brings layout close to the element definitions. ui4 mindset is focused on building an
**app UI** quickly and intuitively, not typographically finessing an HTML **document**.

Here's the code from the video above, and some highlighted ui4 features:

```html
<div fit="true" dock="center">
    <input placeholder="Username" dock="topleft">
    <input placeholder="Password" dock="previous.below">
    <button id="login" dock="previous.below"
            click="error.top=login.bottom:0.3s">
        Login
    </button>
    <div id="error" center="login.center" layer="lower">
        Check username
    </div>
</div>
```

1. Placing an element relative to the containing element: `dock="topleft"`, `dock="center"`
2. Placing an element relative to a peer element: `dock="previous.below"`
3. Leaving a standard gap between the elements
4. Sizing an element based on the space required for the children: `fit="true"`
5. Controlling the "layer" or z-index of an element: `layer="lower"`
6. Changing the layout in reaction to an event: `click="error.top..."`
7. Animating the changes in the layout: `error.top=login.bottom:0.3s`

## Getting started

Include the latest version of `ui4.js` on your page from the CDN with:

```html
<script src="https://unpkg.com/ui4html"></script>
```

Or fixed to a specific version:

```html
<script src="https://unpkg.com/ui4html@0.8.0/dist/ui4.js"></script>
```

## Documentation

Dig deeper in these sections:

1. [Basics](01-BASICS) cover element placement on the page.
2. Page layouts can be made more [responsive](02-RESPONSIVE) with conditions and layouts.
3. There is some support for animations.
4. Developer usability is making sure that things work as you expect.
5. Reference has everything listed.
6. Research contains notes on similar packages in other environments.
