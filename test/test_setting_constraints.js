/*jshint esversion: 9 */

const UI4 = require("../src/ui4.js");
const ui4 = new UI4();
assert = require("assert");
expect = require("chai").expect;

beforeEach(function () {
  this.jsdomClean = require("global-jsdom")();
});

after(function () {
  this.jsdomClean();
});

describe("combineConstraintAttributes", () => {
  it("combines several attributes into a single string", async () => {
    const fakeNode = {
      getAttribute: (name) => "left=id1.left",
      attributes: [
        { name: "right", value: "id1.right" },
        { name: "fit", value: "both" },
      ],
    };
    expect(ui4.combineConstraintAttributes(fakeNode)).to.equal("left=id1.left;right=id1.right;fit=both");
  });
  it("combines several attributes into a single string, with animations", async () => {
    const fakeNode = {
      getAttribute: (name) => "left=id1.left:1s",
      attributes: [
        { name: "right", value: "id1.right:2s" },
        { name: "fit", value: "both" },
      ],
    };
    expect(ui4.combineConstraintAttributes(fakeNode)).to.equal("left=id1.left:1s;right=id1.right:2s;fit=both");
  });
  it("combines several attributes into a single string, with conditions", async () => {
    const fakeNode = {
      getAttribute: (name) => "landscape?left=id1.left",
      attributes: [
        { name: "right", value: "id1.right" },
        { name: "fit", value: "both" },
      ],
    };
    expect(ui4.combineConstraintAttributes(fakeNode)).to.equal("landscape?left=id1.left;right=id1.right;fit=both");
  });
  it("converts aspect attributes into a single string", async () => {
    const fakeNode = {
      getAttribute: (name) => "left=id1.left",
      attributes: [
        { name: "portrait", value: "right=id1.right;height=height" },
        { name: "landscape", value: "right=id1.right+gap" },
      ],
    };
    expect(ui4.combineConstraintAttributes(fakeNode)).to.equal(
      "left=id1.left;portrait?right=id1.right;portrait?height=height;landscape?right=id1.right+gap"
    );
  });
});

describe("checkStyles", () => {
  it("sets base CSS styles on any node with ui4 attribute", async () => {
    const fakeDiv = document.createElement("div");
    fakeDiv.setAttribute("ui4", "left=id1.left");
    ui4.checkStyles(fakeDiv);
    expect(fakeDiv.style.position).to.equal("absolute");
    expect(fakeDiv.style.width).to.equal("");
  });
  it("sets ui4 and root CSS styles on root node", async () => {
    const fakeDiv = document.createElement("div");
    fakeDiv.classList = ["ui4Root"];
    ui4.checkStyles(fakeDiv);
    expect(fakeDiv.style.position).to.equal("absolute");
    expect(fakeDiv.style.width).to.equal("100%");
  });
});
