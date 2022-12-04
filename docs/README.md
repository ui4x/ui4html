<video controls="" muted="" loop="" autoplay="" width="100%">
    <source src="intro.mp4" type="video/mp4">
</video>

## Introduction

`ui4html` brings layout to the HTML,  close to the element definitions. It is a good fit if you want
to create a web-based **app UI** quickly and intuitively, as opposed to finessing the look and feel
of an HTML **document**.

`ui4html` gives you "strict flexibility". UI elements are placed strictly ("Place this element
below that one") but flexibly ("And keep it there when it moves"). 

Here's the code from the video above, and some highlighted `ui4html` features:

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
3. There is some support for [animations](03-ANIMATION).
4. Developer [usability](04-USABILITY) is making sure that things work as you expect.
5. [Reference](05-REFERENCE) has everything listed.
6. Notes on similar packages in other environments can be found in [research](06-RESEARCH).

## Simple samples

1. [Calculator](demos/calculator.html) - may look familiar, and demonstrates a boring but
   flexible way of placing semi-repetitive elements in a grid.
2. [Lorem Picsum browser](demos/lorem_picsum_browser.html) - using images from the excellent
   Lorem Picsum [service](https://picsum.photos), demonstrates resizing the whole layout with the
   size of the screen.

## To do

1. ~~Conditions~~
2. Text sizing
3. Animation with right/bottom
4. ~~Grids and aspect ratios~~
5. Open-ended grids
6. Side menu sample
7. Docs: Reactive
8. Docs: Animation
9. Docs: Reference
