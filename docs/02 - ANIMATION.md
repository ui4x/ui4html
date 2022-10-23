---
layout: page
---

# Animations

If you connect an element to another element with one of the ui4 attributes, and then animate the
first element with CSS or Javascript, the connected element naturally animates with the first.

In this example we use CSS to animate the first element width on hover.


    <table class="example">
      <tr>
        <td>
          <sub>EXAMPLE 11</sub>
          <pre>&lt;div id="first" dock="center">Hover over me&lt;/div>
&lt;div id="second" dock="first.below" bottom="bottom">&lt;/div></pre>
        </td>
        <td>
          <iframe style="border-style:none;box-shadow:0px 0px 2px 2px rgba(0,0,0,0.2);" src="examples/example0011.html"></iframe><br/>
          <button onclick="location.href='examples/example0011.html'">Open in full screen</button>
        </td>
      </tr>
    </table>

The example above works because we did not use ui4 to fix the dimension that was animated with CSS,
so there was no conflict. The next example is otherwise identical, but ui4 width keeps the width
fixed, and hovering has no effect.


    <table class="example">
      <tr>
        <td>
          <sub>EXAMPLE 12</sub>
          <pre>&lt;div id="first" dock="center" width="125">No hover for me&lt;/div>
&lt;div id="second" dock="first.below" bottom="bottom">&lt;/div></pre>
        </td>
        <td>
          <iframe style="border-style:none;box-shadow:0px 0px 2px 2px rgba(0,0,0,0.2);" src="examples/example0012.html"></iframe><br/>
          <button onclick="location.href='examples/example0012.html'">Open in full screen</button>
        </td>
      </tr>
    </table>

To stick to the principle of locality, and to avoid issues of CSS and ui4 conflicting, we can apply
animations as a part of the constraint directly, as in the following example:


    <table class="example">
      <tr>
        <td>
          <sub>EXAMPLE 13</sub>
          <pre>&lt;div id="first" dock="center" width="125" height="50">Hello!&lt;/div>
&lt;button id="second" frame="first.frame" 
        onclick="ui4.set(this, 'top=first.bottom: 0.5s, ease-in-out')">
    Click me
&lt;/button></pre>
        </td>
        <td>
          <iframe style="border-style:none;box-shadow:0px 0px 2px 2px rgba(0,0,0,0.2);" src="examples/example0013.html"></iframe><br/>
          <button onclick="location.href='examples/example0013.html'">Open in full screen</button>
        </td>
      </tr>
    </table>