/*jshint esversion: 9 */

class UI4 {
  static rootStyles = {
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    padding: 0,
  };

  static elementStyles = {
    position: "absolute",
    margin: 0,
    outline: 0,
    // padding: 0,
    boxSizing: "border-box",
    zIndex: 0,
  };

  static LEADING = "leading";
  static TRAILING = "trailing";
  static NEUTRAL = "neutral";

  static attrType = {
    constant: UI4.NEUTRAL,
    width: UI4.NEUTRAL,
    height: UI4.NEUTRAL,
    left: UI4.LEADING,
    right: UI4.TRAILING,
    top: UI4.LEADING,
    bottom: UI4.TRAILING,
    centerx: UI4.NEUTRAL,
    centery: UI4.NEUTRAL,
  };

  static composites = {
    center: ["centerx", "centery"],
    position: ["left", "top"],
    size: ["width", "height"],
    frame: ["top", "left", "width", "height"],
  };

  static parentDock = {
    // Order is significant
    topleft: ["top", "left"],
    topright: ["top", "right"],
    bottomleft: ["bottom", "left"],
    bottomright: ["bottom", "right"],
    topcenter: ["top", "centerx"],
    bottomcenter: ["bottom", "centerx"],
    leftcenter: ["left", "centery"],
    rightcenter: ["right", "centery"],
    sides: ["left", "right"],
    topbottom: ["top", "bottom"],
    top: ["left", "top", "right"],
    left: ["top", "left", "bottom"],
    bottom: ["left", "bottom", "right"],
    right: ["top", "right", "bottom"],
    center: ["centerx", "centery"],
    all: ["left", "right", "top", "bottom"],
  };

  static peerDock = {
    above: {
      size: "width",
      center: "centerx",
      myEdge: "bottom",
      yourEdge: "top",
    },
    below: {
      size: "width",
      center: "centerx",
      myEdge: "top",
      yourEdge: "bottom",
    },
    rightof: {
      size: "height",
      center: "centery",
      myEdge: "left",
      yourEdge: "right",
    },
    leftof: {
      size: "height",
      center: "centery",
      myEdge: "right",
      yourEdge: "left",
    },
  };

  static betweenDock = {
    betweenstart: ["min", "min"],
    betweenend: ["max", "max"],
    between: ["min", "max"],
  };

  static layers = {
    lower: -1000,
    lowest: -2000,
    higher: 1000,
    highest: 2000,
  };

  static relativeIDs = {
    beforeprevious: -2,
    previous: -1,
    this: 0,
    next: 1,
    afterNext: 2,
  };

  static absoluteIDs = {
    first: 0,
    second: 1,
    last: -1,
    secondtolast: -2,
  };

  static operations = {
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
    "*": (a, b) => a * b,
    "/": (a, b) => a / b,
    ">": (a, b) => a > b,
    "<": (a, b) => a < b,
    "=": (a, b) => a === b,
    "==": (a, b) => a === b,
    "===": (a, b) => a === b,
    "<=": (a, b) => a <= b,
    ">=": (a, b) => a >= b,
    min: Math.min,
    max: Math.max,
  };
  static comparisons = {
    "=": (a, b) => a !== b,
    "<": (a, b) => a >= b,
    ">": (a, b) => a <= b,
  };
  static ordering = { "=": 0, "<": 1, ">": 2 };
  static conditions = {
    "=": (a, b) => a === b,
    "<": (a, b) => a < b,
    ">": (a, b) => a > b,
  };
  static windowAspectFunctions = {
    landscape: () => window.innerWidth >= window.innerHeight,
    portrait: () => window.innerHeight > window.innerWidth,
  };
  static elementAspectFunctions = {
    wide: (element) => element.clientWidth >= element.clientHeight,
    high: (element) => element.clientHeight > element.clientWidth,
  };

  // Parser node types
  static OPERATOR = "operator";
  static NUMBER = "number";
  static ID_AND_ATTRIBUTE = "idAndAttribute";
  static KEYWORD = "keyword";
  static FUNCTION = "function";

  constructor() {
    this.observer = new UI4.Observer(
      this.setDependencies.bind(this),
      this.checkDependentsOf.bind(this),
      this.checkWindowResize.bind(this)
    );

    this._gap = 8;
    this.idCounter = 0;

    this.allDependencies = {};
    this.sourceDependencies = {};
    this.windowResizeDependencies = new Set();

    this.layouts = {};
    this.gaps = {};

    const _this = this;
    this.getValue = {
      width: (context) => context.sourceElem.offsetWidth,
      height: (context) => context.sourceElem.offsetHeight,
      left: (context) => (context.contained ? 0 : parseFloat(context.getStyle.left)),
      right: (context) =>
        context.contained
          ? context.sourceElem.clientWidth
          : context.parentElem.clientWidth - parseFloat(context.getStyle.right),
      top: (context) => (context.contained ? 0 : parseFloat(context.getStyle.top)),
      bottom: (context) =>
        context.contained
          ? context.sourceElem.clientHeight
          : context.parentElem.clientHeight - parseFloat(context.getStyle.bottom),
      centerx: (context) =>
        context.contained
          ? context.sourceElem.clientWidth / 2
          : parseFloat(context.getStyle.left) + context.sourceElem.offsetWidth / 2,
      centery: (context) =>
        context.contained
          ? context.sourceElem.clientHeight / 2
          : parseFloat(context.getStyle.top) + context.sourceElem.offsetHeight / 2,
      fitwidth: function (context) {
        const gap = _this.gap(context.parentElem);
        let left = false;
        let right;
        const children = context.targetElem.children;
        if (!children.length) return 2 * gap;
        for (const child of children) {
          const bbox = child.getBoundingClientRect();
          if (left === false) {
            left = bbox.left;
            right = bbox.right;
          } else {
            left = Math.min(left, bbox.left);
            right = Math.max(right, bbox.right);
          }
        }
        if (left === false) {
          right = left = 0;
        }
        return right - left + 2 * gap;
      },
      fitheight: function (context) {
        const gap = _this.gap(context.parentElem.id);
        let top = false;
        let bottom;
        const children = context.targetElem.children;
        if (!children.length) return 2 * gap;
        for (const child of children) {
          const bbox = child.getBoundingClientRect();
          if (top === false) {
            top = bbox.top;
            bottom = bbox.bottom;
          } else {
            top = Math.min(top, bbox.top);
            bottom = Math.max(bottom, bbox.bottom);
          }
        }
        if (!top) {
          bottom = top = 0;
        }
        return bottom - top + 2 * gap;
      },
      layer: (context) => context.getStyle.zIndex,
    };

    this.setValue = {
      width: function (context, value) {
        return { width: value + "px" };
      },
      height: function (context, value) {
        return { height: value + "px" };
      },
      left: function (context, value) {
        return { left: value + "px" };
      },
      right: function (context, value) {
        return { right: context.parentElem.clientWidth - value + "px" };
      },
      top: function (context, value) {
        return { top: value + "px" };
      },
      bottom: function (context, value) {
        return { bottom: context.parentElem.clientHeight - value + "px" };
      },
      centerx: function (context, value) {
        if (context.dependencies.find((item) => item.targetAttribute === "left")) {
          // left locked, width must give
          return {
            width: 2 * (value - parseFloat(context.getStyle.left)) + "px",
          };
        } else if (context.dependencies.find((item) => item.targetAttribute === "right")) {
          // right locked, width must give
          return {
            width: 2 * (context.parentElem.clientWidth - parseFloat(context.getStyle.right) - value) + "px",
          };
        } else {
          // Neither locked, move left
          return { left: value - context.targetElem.offsetWidth / 2 + "px" };
        }
      },
      centery: function (context, value) {
        if (context.dependencies.find((item) => item.targetAttribute === "top")) {
          // top locked, height must give
          return {
            height: 2 * (value - parseFloat(context.getStyle.top)) + "px",
          };
        } else if (context.dependencies.find((item) => item.targetAttribute === "bottom")) {
          // bottom locked, height must give
          return {
            height: 2 * context.parentElem.clientHeight - parseFloat(context.getStyle.bottom) - value + "px",
          };
        } else {
          // Neither locked, move top
          return { top: value - context.targetElem.offsetHeight / 2 + "px" };
        }
      },
      layer: function (context, value) {
        return { zIndex: value };
      },
    };
    this.horizontalPriority = ["width", "centerx", "left", "right"];
    this.verticalPriority = ["height", "centery", "top", "bottom"];
    this.resolveOrder = {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      width: 1,
      height: 1,
      centerx: 2,
      centery: 2,
    };

    const attributeOptions = Object.keys(this.getValue).join("|");
    this.idAndAttribute = new RegExp(`(?<id>([a-zA-Z]|\\d|_|-)+)\\.(?<attribute>(${attributeOptions}))`);

    this.valueProxies = {};
    Object.keys(this.getValue).forEach((attribute) => {
      this.valueProxies[attribute] = new Proxy(
        {},
        {
          get(target, name, receiver) {
            return 2;
          },
        }
      );
    });
  }

  init() {
    this.observer.start();
  }

  checkWindowResize() {
    this.windowResizeDependencies.forEach((targetID) => {
      this.checkDependenciesFor(targetID);
    });
  }

  // Gap is the only externally-settable parameter
  gap(elementID) {
    if (elementID in this.gaps) {
      return this.gaps[elementID];
    }
    return this._gap;
  }

  set globalGap(value) {
    this._gap = value;
    this.checkDependencies();
  }

  set(elementOrID, dependency, animationOptions) {
    let element = elementOrID;
    if (typeof elementOrID === "string") {
      element = document.getElementById(elementOrID);
    }
    const targetID = element.id;

    const lockedCSSPropertiesBeforeChange = this.activeCSSProperties(targetID, element);

    const newDependencies = this.parseAndCleanDependencies(element, dependency);
    if (animationOptions) {
      newDependencies.forEach((dependency) => (dependency.animation = animationOptions));
    }
    const newAttributes = new Set(newDependencies.map((dependency) => dependency.targetAttribute));
    const existingDependencies = this.allDependencies[targetID] || [];
    existingDependencies.forEach((dependency) => {
      newDependencies.forEach((newDependency, index) => {
        if (
          dependency.targetAttribute === newDependency.targetAttribute &&
          dependency.comparison === newDependency.comparison
        ) {
          dependency.value = newDependency.value;
          dependency.animation = newDependency.animation;
          newDependencies.splice(index, 1);
          this.setSourceDependencies(targetID, dependency);
        }
      });
    });
    let combinedDependencies = existingDependencies.concat(newDependencies);
    combinedDependencies = this.removeConflictsAndOrder(combinedDependencies, newAttributes);
    this.allDependencies[targetID] = combinedDependencies;
    combinedDependencies.forEach((dependency) => this.setSourceDependencies(targetID, dependency));

    const lockedCSSPropertiesAfterChange = this.activeCSSProperties(targetID, element);
    lockedCSSPropertiesBeforeChange.forEach((property) => {
      if (!lockedCSSPropertiesAfterChange.has(property)) {
        element.style.removeProperty(property);
      }
    });

    this.checkDependenciesFor(targetID);
    // this.checkDependenciesFor(targetID);
  }

  activeCSSProperties(targetID, targetElement) {
    const cssProperties = new Set();
    const dependencies = this.allDependencies[targetID];
    const context = {
      targetElem: targetElement,
      dependencies: dependencies,
      parentElem: targetElement.parentElement,
      getStyle: window.getComputedStyle(targetElement),
    };
    dependencies.forEach((dependency) => {
      cssProperties.add(Object.keys(this.setValue[dependency.targetAttribute](context, 0))[0]);
    });
    return cssProperties;
  }

  share(targetElem, targetAttribute, shareOf, total) {
    const gap = this.gap(targetElem.parentElement.id);

    const dimensions = {
      width: "clientWidth",
      height: "clientHeight",
    };
    const actualDimension = dimensions[targetAttribute];
    if (actualDimension === undefined) {
      throw SyntaxError(`Can not use attribute ${targetAttribute} with share()`);
    }
    const parentDimension = parseFloat(targetElem.parentElement[actualDimension]);

    if (!(shareOf && total)) {
      throw SyntaxError("Share needs both total number of elements and this elements share of it");
    }

    return ((parentDimension - (total + 1) * gap) / total) * shareOf + (shareOf - 1) * gap;
  }

  setDependencies(element) {
    // We need the node to have an id from this point forward
    if (!element.id) {
      if (!element.getAttribute) return;
      element.id = "ui4id" + this.idCounter++;
    }
    const targetID = element.id;

    // this.gaps[targetID] = undefined;

    // const ui4AnimationID = element.getAttribute("ui4anim");

    const ui4Attr = this.checkStyles(element);

    if (ui4Attr) {
      let dependencies;
      try {
        dependencies = this.parseAndCleanDependencies(element, ui4Attr);
      } catch (error) {
        console.error(error);
        return;
      }
      if (!dependencies.length) {
        if (targetID in this.allDependencies) {
          for (const dependency of this.allDependencies[targetID]) {
            if (typeof dependency.value === "object" && "dependencyIDs" in dependency.value) {
              dependency.value.dependencyIDs.forEach((sourceID) => delete this.sourceDependencies[sourceID][targetID]);
            }
          }
        }
        delete this.allDependencies[targetID];
      } else {
        this.allDependencies[targetID] = dependencies;
        for (const dependency of dependencies) {
          this.setSourceDependencies(targetID, dependency);
        }
      }
    }

    const parentID = element.parentElement.id;
    if (parentID && this.layouts[parentID]) {
      const sources = this.sourceDependencies[targetID] || {};
      sources[parentID] = true;
      this.sourceDependencies[targetID] = sources;
      // console.log(targetID + " -> " + parentID);
    }
    /*
        // Check animated styles
        const ui4Style = node.getAttribute('ui4style');

        if (ui4Style) {
            let styles;
            try {
                styles = parse(ui4Style.replace(/\s/g,''), {startRule: 'styles'});
            } catch(error) {
                console.error(error.toString());
                return;
            }
            if (styles) {
                this.startCSSAnimations(node, styles);
            }
        }
        */
    // Check children, since mutation observer only seems to pick the root of changes
    element.childNodes.forEach((childNode) => this.setDependencies(childNode));

    // console.log(JSON.stringify(this.allDependencies));
  }

  setSourceDependencies(targetID, dependency) {
    [dependency.value, dependency.condition].forEach((value) => {
      if (typeof value === "object" && "dependencyIDs" in value) {
        value.dependencyIDs.forEach((sourceID) => {
          const targetIDs = this.sourceDependencies[sourceID] || {};
          targetIDs[targetID] = true;
          this.sourceDependencies[sourceID] = targetIDs;
        });
      }
    });
  }

  recordSourceDependencies(sourceID, targetID) {
    const targetIDs = this.sourceDependencies[sourceID] || {};
    targetIDs[targetID] = true;
    this.sourceDependencies[sourceID] = targetIDs;
  }

  checkStyles(node) {
    // Check constraints
    const ui4Attr = this.combineConstraintAttributes(node);
    const isRootElem = node.classList.contains("ui4Root");

    if (ui4Attr || isRootElem) {
      Object.assign(node.style, UI4.elementStyles);
    }

    if (isRootElem) {
      Object.assign(node.style, UI4.rootStyles);
    }

    return ui4Attr;
  }

  combineConstraintAttributes(node) {
    let ui4Attr = node.getAttribute("ui4");
    const constraintArray = (ui4Attr && ui4Attr.split(";")) || [];

    for (const attribute of node.attributes) {
      const name = attribute.name;
      if (
        name in this.setValue ||
        name in UI4.composites ||
        ["dock", "fit", "layout", "gap", "ratio", "click"].includes(name)
      ) {
        for (const singleConstraint of attribute.value.split(";")) {
          const fullConstraint = `${attribute.name}=${singleConstraint}`;
          constraintArray.push(fullConstraint);
        }
      } else if (name in UI4.windowAspectFunctions || name in UI4.elementAspectFunctions) {
        for (const singleConstraint of attribute.value.split(";")) {
          const aspectConstraint = `${name}?${singleConstraint}`;
          constraintArray.push(aspectConstraint);
        }
      }
    }
    return constraintArray.join(";");
  }

  parseAndCleanDependencies(node, specString) {
    let dependencies = this.parse(node, specString.replace(/\s/g, ""));

    dependencies = this.removeConflictsAndOrder(dependencies, node);

    return dependencies;
  }

  removeConflictsAndOrder(dependencies, node, mustHave) {
    // Only 2 vertical and 2 horizontal attributes can be sanely constrained
    const targetAttributeSet = new Set(dependencies.map((dependency) => dependency.targetAttribute));

    if (targetAttributeSet.has("ratio")) {
      targetAttributeSet.delete("ratio");
      dependencies.forEach((dependency, index) => {
        if (dependency.targetAttribute === "ratio") {
          let sourceSpec;
          let attribute;
          if (targetAttributeSet.has("width") && !targetAttributeSet.has("height")) {
            sourceSpec = `${node.id}.width/(${dependency.value})`;
            attribute = "height";
          } else if (targetAttributeSet.has("height") && !targetAttributeSet.has("width")) {
            sourceSpec = `${node.id}.height*(${dependency.value})`;
            attribute = "width";
          }
          if (sourceSpec) {
            const tempDependencies = [];
            this.parseCoreSpec(node, attribute, "=", sourceSpec, tempDependencies, dependency.animation);
            const newDependency = tempDependencies[0];
            dependencies[index] = newDependency;
            targetAttributeSet.add(attribute);
          } else {
            console.error("ratio is only effective if exactly one of width and height is defined");
          }
        }
      });
    }

    [this.horizontalPriority, this.verticalPriority].forEach((dimension) => {
      // Move any "must have" attributes to the start
      if (mustHave) {
        let start = dimension.filter((attribute) => mustHave.has(attribute));
        dimension = start.concat(dimension.filter((attribute) => !mustHave.has(attribute)));
      }
      const overlapping = dimension.filter((attribute) => targetAttributeSet.has(attribute));
      if (overlapping.length > 2) {
        const attributesToFree = overlapping.slice(2);
        attributesToFree.forEach((attribute) => {
          dependencies = dependencies.filter((dependency) => dependency.targetAttribute !== attribute);
        });
      }
    });

    dependencies.sort((a, b) => {
      // All connections ("=") must come before limits ("><")
      if (a.comparison !== b.comparison) {
        return UI4.ordering[a.comparison] - UI4.ordering[b.comparison];
      } else {
        return this.resolveOrder[a.targetAttribute] - this.resolveOrder[b.targetAttribute];
      }
    });

    return dependencies;
  }

  parse(node, specString) {
    const specs = specString.split(";");
    const dependencies = [];
    specs.forEach((spec) => {
      if (!spec) {
        return;
      } // Accidental double ";", probably

      // Process conditions and animation, if any
      let coreSpec = spec;
      let condition, animationOptions;

      const conditionAndCore = spec.split("?");
      if (conditionAndCore.length === 2) {
        condition = this.parseConditionSpec(node, conditionAndCore[0]);
        coreSpec = conditionAndCore[1];
      } else if (conditionAndCore.length > 2) {
        console.error(`Too many '?' in '${spec}'`);
        return;
      }
      const coreAndAnimation = spec.split(":");
      if (coreAndAnimation.length === 2) {
        coreSpec = coreAndAnimation[0];
        animationOptions = new UI4.Parser().parseAnimation(coreAndAnimation[1]);
      } else if (coreAndAnimation.length > 2) {
        console.error(`Too many ':' in '${spec}'`);
        return;
      }
      let targetAttribute, comparison, sourceSpec;
      for (const comparisonCandidate of Object.keys(UI4.comparisons)) {
        const targetAttributeAndSourceSpec = coreSpec.split(comparisonCandidate, 2);
        if (targetAttributeAndSourceSpec.length === 2) {
          targetAttribute = targetAttributeAndSourceSpec[0];
          comparison = comparisonCandidate;
          sourceSpec = coreSpec.substring(targetAttribute.length + 1);
          break;
        }
      }
      if (comparison === undefined) {
        console.error(`Could not locate '=', '>' or '<' in ${spec}`);
        return;
      }

      this.parseCoreSpec(node, targetAttribute, comparison, sourceSpec, dependencies, condition, animationOptions);
    });
    return dependencies;
  }

  parseConditionSpec(element, conditionSpec) {
    let conditionFunction;
    let dependencyIDs = [];
    if (Object.keys(UI4.windowAspectFunctions).includes(conditionSpec)) {
      conditionFunction = UI4.windowAspectFunctions[conditionSpec];
      this.windowResizeDependencies.add(element.id);
    } else if (Object.keys(UI4.elementAspectFunctions).includes(conditionSpec)) {
      conditionFunction = UI4.elementAspectFunctions[conditionSpec].bind(this, element.parentElement);
      dependencyIDs.push(element.parentElement.id);
    } else {
      const components = conditionSpec.split(".");
      if (components.length === 2 && Object.keys(UI4.elementAspectFunctions).includes(components[1])) {
        const aspectElement = document.getElementById(components[0]);
        if (aspectElement) {
          conditionFunction = UI4.elementAspectFunctions[components[1]].bind(this, aspectElement);
          dependencyIDs.push(aspectElement.id);
        }
      }
    }

    if (conditionFunction) {
      return { type: "function", function: conditionFunction, args: [], dependencyIDs: dependencyIDs };
    } else {
      const conditionTree = new UI4.Parser().parseCondition(conditionSpec);
      conditionTree.dependencyIDs = this.finalizeIDAndAttributeTree(element, conditionTree);
      return conditionTree;
    }
  }

  parseCoreSpec(node, targetAttribute, comparison, sourceSpec, dependencies, condition, animationOptions) {
    if (targetAttribute in this.setValue) {
      const sourceTree = new UI4.Parser().parse(sourceSpec);
      sourceTree.dependencyIDs = this.finalizeIDAndAttributeTree(node, sourceTree);
      if (sourceTree.type === UI4.KEYWORD && sourceTree.value === "free") {
        const allDependencies = this.allDependencies[node.id] || [];
        allDependencies[node.id].forEach((dependency, index) => {
          if (dependency.targetAttribute === targetAttribute) {
            allDependencies.splice(index, 1);
          }
        });
      } else {
        dependencies.push({
          targetAttribute: targetAttribute,
          comparison: comparison,
          value: sourceTree,
          condition: condition,
          animation: animationOptions,
        });
      }
    } else if (targetAttribute in UI4.composites) {
      const targetCombo = UI4.composites[targetAttribute];
      let sourceAttribute, sourceCombo;
      for (const [attribute, combo] of Object.entries(UI4.composites)) {
        if (combo.length === targetCombo.length) {
          if (sourceSpec.includes(`${attribute}`)) {
            sourceAttribute = attribute;
            sourceCombo = combo;
            break;
          }
        }
      }
      if (sourceAttribute) {
        targetCombo.forEach((expandedAttribute, index) => {
          const modifiedSourceSpec = sourceSpec.replace(`${sourceAttribute}`, `${sourceCombo[index]}`);
          this.parseCoreSpec(
            node,
            expandedAttribute,
            comparison,
            modifiedSourceSpec,
            dependencies,
            condition,
            animationOptions
          );
        });
      }
    } else if (targetAttribute === "ratio") {
      dependencies.push({
        targetAttribute: targetAttribute,
        comparison: comparison,
        value: sourceSpec,
        animation: animationOptions,
      });
    } else if (targetAttribute === "dock") {
      let handled = false;
      for (const [dockAttribute, attributes] of Object.entries(UI4.peerDock)) {
        const matcher = new RegExp(`[a-zA-Z\\d_-]+\\.${dockAttribute}`);
        if (sourceSpec.match(matcher)) {
          let modifiedSourceSpec = sourceSpec.replace(dockAttribute, attributes.size);
          this.parseCoreSpec(
            node,
            attributes.size,
            comparison,
            modifiedSourceSpec,
            dependencies,
            condition,
            animationOptions
          );

          modifiedSourceSpec = sourceSpec.replace(dockAttribute, attributes.center);
          this.parseCoreSpec(
            node,
            attributes.center,
            comparison,
            modifiedSourceSpec,
            dependencies,
            condition,
            animationOptions
          );

          modifiedSourceSpec = sourceSpec.replace(dockAttribute, attributes.yourEdge);
          this.parseCoreSpec(
            node,
            attributes.myEdge,
            comparison,
            modifiedSourceSpec,
            dependencies,
            condition,
            animationOptions
          );

          handled = true;
          break;
        }
      }

      if (!handled) {
        for (const [dockAttribute, attributes] of Object.entries(UI4.parentDock)) {
          if (sourceSpec.startsWith(dockAttribute)) {
            const parentID = node.parentNode.id;
            attributes.forEach((attribute) => {
              const modifiedSourceSpec = sourceSpec.replace(dockAttribute, `${parentID}.${attribute}`);
              this.parseCoreSpec(
                node,
                attribute,
                comparison,
                modifiedSourceSpec,
                dependencies,
                condition,
                animationOptions
              );
            });
            handled = true;
            break;
          }
        }
      }

      if (!handled) {
        handled = this.parseBetweenSpec(node, sourceSpec, dependencies, condition, animationOptions);
      }

      if (!handled) {
        throw SyntaxError(`Could not parse dock value ${sourceSpec}`);
      }
    } else if (targetAttribute === "fit") {
      if (["width", "true", "both"].includes(sourceSpec)) {
        this.parseCoreSpec(node, "width", comparison, `${node.id}.fitwidth`, dependencies, condition, animationOptions);
      }
      if (["height", "true", "both"].includes(sourceSpec)) {
        this.parseCoreSpec(
          node,
          "height",
          comparison,
          `${node.id}.fitheight`,
          dependencies,
          condition,
          animationOptions
        );
      }
    } else if (targetAttribute === "layout") {
      let sourceTree;
      if (sourceSpec === "grid") {
        this.parseCoreSpec(node, "layout", comparison, "grid(1)", dependencies, condition, animationOptions);
      } else if (sourceSpec === "column") {
        this.parseCoreSpec(node, "layout", comparison, "columns(1)", dependencies, condition, animationOptions);
      } else if (sourceSpec === "row") {
        this.parseCoreSpec(node, "layout", comparison, "rows(1)", dependencies, condition, animationOptions);
      } else {
        sourceTree = new UI4.Parser().parse(sourceSpec);
        if (
          !(
            sourceTree.type === UI4.FUNCTION &&
            ["grid", "columns", "rows"].includes(sourceTree.value) &&
            sourceTree.args &&
            sourceTree.args.length >= 1 &&
            sourceTree.args.length <= 2
          )
        ) {
          throw SyntaxError(`Parse error for layout: ${sourceSpec}`);
        }
        this.finalizeIDAndAttributeTree(node, sourceTree);
      }
      if (sourceTree) {
        this.layouts[node.id] = sourceTree;
      }
    } else if (targetAttribute === "click") {
      const dotIndex = sourceSpec.indexOf(".");
      let targetNodeId = node.id;
      if (dotIndex > -1 && dotIndex < sourceSpec.indexOf("=")) {
        targetNodeId = sourceSpec.substring(0, dotIndex);
        sourceSpec = sourceSpec.substring(dotIndex + 1);
      }
      node.addEventListener("click", this.set.bind(this, targetNodeId, sourceSpec, animationOptions));
    } else if (targetAttribute === "gap") {
      this.gaps[node.id] = parseFloat(sourceSpec);
    } else {
      console.error(`Unknown target attribute: ${targetAttribute}`);
    }
  }

  parseBetweenSpec(node, sourceSpec, dependencies, condition, animationOptions) {
    let attribute, minMax;
    for (const [dockAttribute, minmax] of Object.entries(UI4.betweenDock)) {
      if (sourceSpec.startsWith(dockAttribute)) {
        attribute = dockAttribute;
        minMax = minmax;
        break;
      }
    }
    if (!attribute) {
      return false;
    }

    const edgesRE =
      /\((?<id1>[a-zA-Z\d_-]+)\.(?<attribute1>([a-zA-Z]+)),(?<id2>[a-zA-Z\d_-]+)\.(?<attribute2>([a-zA-Z]+))\)/;
    const match = sourceSpec.match(edgesRE);
    if (match) {
      const lookup = {};
      lookup[match.groups.attribute1] = match.groups.id1;
      lookup[match.groups.attribute2] = match.groups.id2;
      if ("top" in lookup && "bottom" in lookup) {
        this.parseCoreSpec(node, "top", "=", `${lookup.bottom}.bottom`, dependencies, condition, animationOptions);

        this.parseCoreSpec(node, "bottom", "=", `${lookup.top}.top`, dependencies, condition, animationOptions);
        this.parseCoreSpec(
          node,
          "left",
          "=",
          `${minMax[0]}(${lookup.top}.left,${lookup.bottom}.left)`,
          dependencies,
          condition,
          animationOptions
        );
        this.parseCoreSpec(
          node,
          "right",
          "=",
          `${minMax[1]}(${lookup.top}.right,${lookup.bottom}.right)`,
          dependencies,
          conditions,
          animationOptions
        );
      } else if ("left" in lookup && "right" in lookup) {
        this.parseCoreSpec(node, "left", "=", `${lookup.right}.right`, dependencies, condition, animationOptions);
        this.parseCoreSpec(node, "right", "=", `${lookup.left}.left`, dependencies, condition, animationOptions);
        this.parseCoreSpec(
          node,
          "top",
          "=",
          `${minMax[0]}(${lookup.right}.top,${lookup.left}.top)`,
          dependencies,
          condition,
          animationOptions
        );
        this.parseCoreSpec(
          node,
          "bottom",
          "=",
          `${minMax[1]}(${lookup.right}.bottom,${lookup.left}.bottom)`,
          dependencies,
          condition,
          animationOptions
        );
      } else {
        throw SyntaxError(`Not a possible combination for between: ${Object.keys(lookup)}`);
      }
    } else {
      const centersRE = /between\((?<id1>[a-zA-Z\d_-]+),(?<id2>[a-zA-Z\d_-]+)\)/;
      const match = sourceSpec.match(centersRE);

      if (match) {
        const id1 = this.resolveRelativeID(match.groups.id1, node);
        const id2 = this.resolveRelativeID(match.groups.id2, node);

        this.parseCoreSpec(
          node,
          "centerx",
          "=",
          `(${id1}.centerx+${id2}.centerx)/2`,
          dependencies,
          condition,
          animationOptions
        );
        this.parseCoreSpec(
          node,
          "centery",
          "=",
          `(${id1}.centery+${id2}.centery)/2`,
          dependencies,
          condition,
          animationOptions
        );
      } else {
        throw SyntaxError(`Could not parse ${sourceSpec}`);
      }
    }

    return true;
  }

  finalizeIDAndAttributeTree(node, sourceTree) {
    const _this = this;
    const _node = node;
    const walker = function (treeNode) {
      switch (treeNode.type) {
        case UI4.ID_AND_ATTRIBUTE:
          if (!(treeNode.value.attribute in _this.getValue)) {
            throw SyntaxError(`Unknown attribute in '${treeNode.value.id}.${treeNode.value.attribute}'`);
          }
          treeNode.value.id = _this.resolveRelativeID(treeNode.value.id, _node);
          treeNode.function = _this.getIDAndAttributeValue.bind(_this);
          return treeNode.value.id; // Return dependency IDs
        case UI4.KEYWORD:
          if (treeNode.value === "gap") {
            treeNode.function = (targetElem, treeNode, result) => _this.gap(targetElem);
            return;
          } else if (treeNode.value in UI4.layers) {
            treeNode.type = "number";
            treeNode.value = UI4.layers[treeNode.value];
            return;
          }
          // Rewrite sole attributes to be full references to parent attribute
          else if (treeNode.value in _this.setValue) {
            treeNode.type = UI4.ID_AND_ATTRIBUTE;
            treeNode.value = {
              id: node.parentElement.id,
              attribute: treeNode.value,
            };
            treeNode.function = _this.getIDAndAttributeValue.bind(_this);
            return treeNode.value.id;
          } else {
            throw SyntaxError(`Unknown keyword '${treeNode.value}'`);
          }
        case UI4.FUNCTION:
          switch (treeNode.value) {
            case "min":
              treeNode.function = Math.min;
              return;
            case "max":
              treeNode.function = Math.max;
              return;
            case "share":
            case "grid":
            case "columns":
            case "rows":
              return;
          }
          throw SyntaxError(`Unknown function '${treeNode.value}'`);
      }
    };
    const dependencyIDs = this.walkParseTree(sourceTree, walker);
    const uniqueDependencyIDs = new Set(dependencyIDs);
    uniqueDependencyIDs.delete(undefined);
    return [...uniqueDependencyIDs];
  }

  resolveRelativeID(id, node) {
    // Update relative id with a concrete id, if applicable
    const children = node.parentNode.children;
    const childrenList = Array.from(children);
    const referenceIndex = childrenList.indexOf(node);

    let indexOfDependency;
    if (id in UI4.relativeIDs) {
      indexOfDependency = referenceIndex + UI4.relativeIDs[id];
    } else if (id in UI4.absoluteIDs) {
      const index = UI4.absoluteIDs[id];
      if (index > 0) {
        indexOfDependency = index;
      } else {
        indexOfDependency = childrenList.length + index;
      }
    } else {
      return id;
    }

    const dependency = children.item(indexOfDependency);
    if (!dependency) {
      console.error(`Element id ${node.id}: No ${id} sibling at index ${indexOfDependency}`);
      return;
    }
    if (!dependency.id) {
      dependency.id = "ui4ID" + this.idCounter++;
    }

    return dependency.id;
  }

  getIDAndAttributeValue(targetElem, treeNode, resultContext) {
    const id = treeNode.value.id;
    const attribute = treeNode.value.attribute;
    const attributeType = UI4.attrType[attribute];
    if (!resultContext.type) {
      resultContext.type = attributeType;
    } else if (resultContext.type !== attributeType) {
      throw SyntaxError(`Mixed attribute types in one constraint: ${attributeType}, ${result.type}`);
    }
    const sourceElem = document.getElementById(id);

    if (!sourceElem) {
      throw SyntaxError(`Could not find source element with id ${id}`);
    }

    const contained = targetElem.parentElement === sourceElem;
    if (!resultContext.contained) {
      resultContext.contained = contained;
    } else if (resultContext.contained !== contained) {
      throw SyntaxError("Both contained and non-contained source attributes in one constraint");
    }

    let sourceContext = {
      contained: contained,
      getStyle: window.getComputedStyle(sourceElem),
      parentStyle: window.getComputedStyle(sourceElem.parentElement),
      targetElem: targetElem,
      sourceElem: sourceElem,
      parentElem: sourceElem.parentElement,
    };

    return this.getValue[attribute](sourceContext);
  }

  startCSSAnimations(elem, styles) {
    const startingStyles = window.getComputedStyle(elem);

    styles.forEach((targetStyle) => {
      //const animationID = spec.animationID;
      const key = this.toCamelCase(targetStyle.key);
      const fromFrame = {};
      fromFrame[key] = startingStyles[targetStyle.key];
      const toFrame = {};
      toFrame[key] = targetStyle.value;

      const animation = elem.animate([fromFrame, toFrame], targetStyle.options);
    });
  }

  checkSourceDependencies(entries) {
    const toCheck = [];
    const seen = {};
    let findDependants = [];
    entries.forEach((entry) => {
      const sourceNode = entry.target;
      if (sourceNode) {
        const sourceID = sourceNode.id;
        if (sourceID && !(sourceID in seen)) {
          toCheck.push(sourceID);
          findDependants.push(sourceID);
          seen[sourceID] = 1;
        }
      }
    });

    while (findDependants.length > 0) {
      const toExpand = findDependants.shift();
      const dependants = this.sourceDependencies[toExpand];
      if (dependants) {
        Object.keys(dependants).forEach((dependantID) => {
          const seenCount = seen[dependantID] || 0;
          if (seenCount > 3) {
            // Allow little circularity
            return;
          }
          toCheck.push(dependantID);
          findDependants.push(dependantID);
          seen[dependantID] = seenCount + 1;
        });
      }
    }
    for (const targetID of toCheck) {
      if (targetID in this.allDependencies || targetID in this.layouts) {
        this.checkDependenciesFor(targetID);
      }
    }
  }

  checkDependencies() {
    this.checkAllDependencies();
  }

  checkAllDependencies() {
    let redrawNeeded = false;
    for (const [targetID, dependencies] of Object.entries(this.allDependencies)) {
      redrawNeeded = this.checkDependenciesFor(targetID, dependencies);
    }
    if (redrawNeeded) {
      requestAnimationFrame(this.checkDependencies.bind(this));
    }
  }

  checkDependentsOf(source) {
    const sourceID = source.id;
    const dependents = this.sourceDependencies[sourceID];
    if (dependents) {
      Object.keys(dependents).forEach((dependentID) => {
        this.checkDependenciesFor(dependentID);
      });
    }

    const layout = this.layouts[sourceID];
    if (layout) {
      this.updateLayout(source, layout);
    }
  }

  checkDependenciesFor(targetID) {
    let redrawNeeded = false;
    // console.log("Checking deps for " + targetID);
    if (targetID in this.allDependencies) {
      const targetElem = document.getElementById(targetID);
      let checkResults = this.checkResults(targetID);

      let finalValues = checkResults[0];
      if (checkResults[1]) {
        redrawNeeded = true;
      }

      // Apply the final value for each attribute
      for (const [targetAttribute, data] of Object.entries(finalValues)) {
        const updates = this.setValue[targetAttribute](data.context, data.sourceValue);
        for (const [key, value] of Object.entries(updates)) {
          const oldValue = targetElem.style[key];
          if (!oldValue) {
            targetElem.style[key] = value;
            continue;
          }
          const oldValueFloat = Math.round(parseFloat(oldValue));
          const valueFloat = Math.round(parseFloat(value));
          if (oldValueFloat !== valueFloat) {
            if (typeof value === "string") {
              if (value.endsWith("px")) {
                targetElem.style[key] = `${valueFloat}px`;
              } else {
                targetElem.style[key] = valueFloat.toString();
              }
            } else {
              targetElem.style[key] = value;
            }
          }
        }
      }
    }
  }

  updateLayout(container, layout) {
    if (layout.value === "grid") {
      this.grid_layout(container, undefined, undefined, layout.args[0].value);
    } else if (layout.value === "columns") {
      this.grid_layout(container, layout.args[0].value, undefined, layout.args[1].value);
    } else if (layout.value === "rows") {
      this.grid_layout(container, undefined, layout.args[0].value, layout.args[1].value);
    }
  }

  checkResults(targetID) {
    const targetElem = document.getElementById(targetID);
    const dependencies = this.allDependencies[targetID];
    let values = {};
    let redrawNeeded = false;

    dependencies.forEach((dependency) => {
      // console.log("Check: " + targetID + "." + dependency.targetAttribute);
      if (dependency.animation && dependency.animation.running) {
        redrawNeeded = true;
        return;
      }

      if (dependency.condition) {
        const shouldApply = this.resolveSourceTree(targetElem, dependency.targetAttribute, dependency.condition, {});
        if (!shouldApply) {
          return;
        }
      }

      const sourceContext = {};
      let sourceValue = this.resolveSourceTree(targetElem, dependency.targetAttribute, dependency.value, sourceContext);

      if (sourceValue === undefined) {
        return;
      }

      let targetContext = this.getTargetContext(targetElem, dependencies);
      let target = this.getTargetValue(dependency.targetAttribute, targetContext);

      sourceValue += this.gapAdjustment(sourceContext, target);

      const result = {
        targetElem: targetElem,
        targetValue: target.value,
        sourceValue: sourceValue,
        context: target.context,
      };
      const previousResult = values[dependency.targetAttribute];
      let setValue;

      if (previousResult) {
        if (UI4.comparisons[dependency.comparison](previousResult.sourceValue, sourceValue)) {
          setValue = result;
        }
      } else if (UI4.comparisons[dependency.comparison](target.value, sourceValue)) {
        setValue = result;
      }

      if (setValue !== undefined) {
        if (dependency.animation) {
          setTimeout(this.startAnimation.bind(this), 10, dependency.targetAttribute, result, dependency);
        } else {
          values[dependency.targetAttribute] = setValue;
        }
      }
    });

    return [values, redrawNeeded];
  }

  resolveSourceTree(targetElem, targetAttribute, treeNode, resultContext) {
    if (treeNode.type === UI4.NUMBER) {
      return treeNode.value;
    } else if (treeNode.type === UI4.OPERATOR) {
      const left = this.resolveSourceTree(targetElem, targetAttribute, treeNode.left, resultContext);
      const right = this.resolveSourceTree(targetElem, targetAttribute, treeNode.right, resultContext);
      return UI4.operations[treeNode.operator](left, right);
    } else if ([UI4.ID_AND_ATTRIBUTE, UI4.KEYWORD].includes(treeNode.type)) {
      return treeNode.function(targetElem, treeNode, resultContext);
    } else if (treeNode.type === UI4.FUNCTION) {
      const functionArguments = [];
      for (const attributeTreeNode of treeNode.args) {
        functionArguments.push(this.resolveSourceTree(targetElem, targetAttribute, attributeTreeNode, resultContext));
      }
      if (treeNode.value === "share") {
        return this.share(targetElem, targetAttribute, ...functionArguments);
      }
      return treeNode.function(...functionArguments);
    }
  }

  processSourceSpec(targetElem, sourceSpec) {
    if ("id" in sourceSpec) {
      return this.processSourceAttribute(targetElem, sourceSpec);
    } else if (sourceSpec.attribute === "constant") {
      return {
        value: sourceSpec.valueFunction(this.gap(targetElem.parentElem.id)),
        type: UI4.attrType[sourceSpec.attribute],
        contained: true,
      };
    }
  }

  processSourceAttribute(targetElem, sourceSpec) {
    const sourceElem = document.getElementById(sourceSpec.id);

    if (!sourceElem) {
      console.error("Could not find source element with id " + sourceSpec.id);
      return;
    }

    const contained = targetElem.parentElement === sourceElem;

    let sourceContext = {
      contained: contained,
      getStyle: window.getComputedStyle(sourceElem),
      parentStyle: window.getComputedStyle(sourceElem.parentElement),
      targetElem: targetElem,
    };
    return {
      value: this.getValue[sourceSpec.attribute](sourceContext),
      type: UI4.attrType[sourceSpec.attribute],
      contained: contained,
    };
  }

  getTargetContext(targetElem, dependencies) {
    return {
      dependencies: dependencies,
      targetElem: targetElem,
      parentElem: targetElem.parentElement,
      getStyle: window.getComputedStyle(targetElem),
      style: targetElem.style,
      parentStyle: window.getComputedStyle(targetElem.parentElement),
      contained: false,
    };
  }

  getTargetValue(targetAttribute, targetContext) {
    const fullContext = { ...targetContext };
    fullContext.sourceElem = targetContext.targetElem;
    fullContext.parentElem = targetContext.targetElem.parentElement;
    return {
      value: this.getValue[targetAttribute](fullContext),
      type: UI4.attrType[targetAttribute],
      context: targetContext,
    };
  }

  gapAdjustment(source, target) {
    const parentID = target.context.parentElem.id;
    if (source.contained) {
      // aligned
      if (source.type === UI4.LEADING && target.type === UI4.LEADING) {
        return this.gap(parentID);
      } else if (source.type === UI4.TRAILING && target.type === UI4.TRAILING) {
        return -this.gap(parentID);
      }
    } else {
      // butting
      if (source.type === UI4.LEADING && target.type === UI4.TRAILING) {
        return -this.gap(parentID);
      } else if (source.type === UI4.TRAILING && target.type === UI4.LEADING) {
        return this.gap(parentID);
      }
    }

    return 0;
  }

  startAnimation(targetAttr, data, dependency) {
    const animationOptions = dependency.animation;
    // if ("iterations" in animationOptions && animationOptions.iterations === 0) {
    //   animationOptions.iterations = Infinity;
    // }
    // animationOptions.fill = "both";
    const animation = data.targetElem.animate(
      [
        this.setValue[targetAttr](data.context, data.targetValue),
        this.setValue[targetAttr](data.context, data.sourceValue),
      ],
      animationOptions
    );
    dependency.animation.running = true;
    const _this = this;
    animation.onfinish = function () {
      delete dependency.animation;
      _this.checkDependenciesFor(data.targetElem.id);
    };
  }

  // UTILITIES

  walkParseTree(treeNode, walker) {
    let result = [walker(treeNode)];

    if (treeNode.left) {
      result = result.concat(this.walkParseTree(treeNode.left, walker));
    }
    if (treeNode.right) {
      result = result.concat(this.walkParseTree(treeNode.right, walker));
    }
    if (treeNode.args) {
      treeNode.args.forEach((argument) => (result = result.concat(this.walkParseTree(argument, walker))));
    }

    return result;
  }

  toCamelCase(variableName) {
    return variableName.replace(/-([a-z])/g, function (str, letter) {
      return letter.toUpperCase();
    });
  }

  grid_dimensions(count, width, height, ratio) {
    const initialX = Math.min(count, Math.sqrt((count * width) / (ratio * height)));
    const initialY = Math.min(count, Math.sqrt((count * ratio * height) / width));
    const operations = [
      [Math.floor, Math.floor],
      [Math.floor, Math.ceil],
      [Math.ceil, Math.floor],
      [Math.ceil, Math.ceil],
    ];
    let best, bestX, bestY;
    operations.forEach((operation) => {
      const candidateX = operation[0](initialX);
      const candidateY = operation[1](initialY);
      const delta = candidateX * candidateY - count;
      if (delta >= 0) {
        if (best === undefined || delta < best) {
          best = delta;
          bestX = candidateX;
          bestY = candidateY;
        }
      }
    });
    return [bestX, bestY];
  }

  grid_layout(element, countX, countY, ratio) {
    if (!ratio) ratio = 1.0;
    const count = element.childElementCount;
    const gap = this.gap(element.id);
    if (!count) return;

    if (!countX && !countY) {
      [countX, countY] = this.grid_dimensions(count, element.clientWidth, element.clientHeight, ratio);
    } else if (!countX) {
      countX = Math.ceil(count / countY);
    } else if (!countY) {
      countY = Math.ceil(count / countX);
    }
    if (count > countX * countY) {
      throw SyntaxError("Check columns/rows value, should be integer larger than 0");
    }

    const dimX = (element.clientWidth - (countX + 1) * gap) / countX;
    const dimY = (element.clientHeight - (countY + 1) * gap) / countY;

    // px = self.pack_x
    // exp_pack_x = px[0] + px[1] * (count_x - 1) + px[2]
    // py = self.pack_y
    // exp_pack_y = py[0] + py[1] * (count_y - 1) + py[2]
    // free_count_x = exp_pack_x.count('_')
    // free_count_y = exp_pack_y.count('_')

    // if free_count_x > 0:
    //     per_free_x = (
    //         self.width - borders - count_x * dim -
    //         (count_x + 1 - free_count_x) * self.gap) / free_count_x
    // if free_count_y > 0:
    //     per_free_y = (
    //         self.height - borders - count_y * dim -
    //         (count_y + 1 - free_count_y) * self.gap) / free_count_y

    const realDimX = dimX; // if free_count_x == 0 else dim
    const realDimY = dimY; // if free_count_y == 0 else dim

    const children = [...element.children];
    let y = gap; // + (per_free_y if self.top_free else self.gap)
    for (let row = 0; row < countY; row++) {
      let x = gap; // + (per_free_x if self.leading_free else self.gap)
      for (let col = 0; col < countX; col++) {
        const child = children.shift();
        if (!child) return;
        Object.assign(child.style, UI4.elementStyles);
        child.style.left = x;
        child.style.top = y;
        child.style.width = realDimX;
        child.style.height = realDimY;
        x += realDimX + gap; // + (per_free_x if self.center_x_free else self.gap)
      }
      y += realDimY + gap; // (per_free_y if self.center_y_free else self.gap)
    }
  }
}

UI4.Observer = class {
  constructor(setDependencies, checkDependencies, checkWindowResizeDependencies) {
    this.dirties = new Set();
    this.frame = undefined;
    this.setDependencies = setDependencies;
    this.checkDependencies = checkDependencies;
    this.checkWindowResizeDependencies = checkWindowResizeDependencies;
  }

  start() {
    new MutationObserver(this.classChangeHandler.bind(this)).observe(document, {
      subtree: true,
      childList: true,
      attributes: true,
    });

    window.addEventListener("resize", this.checkWindowResizeDependencies);
  }

  classChangeHandler(mutations, observer) {
    mutations.forEach((mutation) => {
      switch (mutation.type) {
        case "childList":
          mutation.addedNodes.forEach((node) => {
            if (node.getAttribute) {
              this.setDependencies(node);
              this.setResizeObserver(node);
            }
          });
          break;
        case "attributes":
          if (mutation.target.getAttribute) {
            this.mutationHandler(mutation.target);
          }
          break;
      }
    });
  }

  setResizeObserver(element) {
    const sourceID = element.id;
    if (!sourceID) {
      return;
    }
    new ResizeObserver(this.resizeEntriesHandler.bind(this)).observe(element, { box: "border-box" });
  }

  resizeEntriesHandler(entries) {
    entries.forEach((entry) => {
      this.mutationHandler(entry.target);
    });
  }

  mutationHandler(target) {
    this.dirties.add(target);
    if (this.frame) window.cancelAnimationFrame(this.frame);
    this.frame = requestAnimationFrame(this.animationFrame.bind(this));
  }

  animationFrame() {
    this.frame = undefined;
    this.dirties.forEach((element) => {
      // console.log("Frame: " + element.id);
      this.checkDependencies(element);
    });
    this.dirties.clear();
  }
};

// UI4 ATTRIBUTE PARSER

UI4.Parser = class {
  constructor() {
    // Tokens - Basic math
    this.OPERATOR = "operator";
    this.COMPARISON = "comparison";
    this.LEFT_PARENTHESIS = "leftParenthesis";
    this.RIGHT_PARENTHESIS = "rightParenthesis";
    this.NUMBER = "number";

    // Tokens - Application-specific
    this.ID_AND_ATTRIBUTE = "idAndAttribute";
    this.KEYWORD = "keyword";
    this.FUNCTION = "function";
    this.DURATION = "duration";
    this.EASING = "easing";
    this.COMMA = "comma";

    const keywords = [
      "gap",
      "left",
      "right",
      "top",
      "bottom",
      "centerx",
      "centery",
      "width",
      "height",
      "position",
      "size",
      "frame",
      "lower",
      "lowest",
      "higher",
      "highest",
    ];

    const TOKEN_TYPES = [
      "(?<idAndAttribute>([a-zA-Z]|\\d|_|-)+\\.([a-zA-Z]+))",
      `(?<keyword>${keywords.join("|")})`,
      "(?<function>min|max|share|grid|columns|rows)",
      "(?<duration>[\\d\\.]+s)",
      "(?<easing>linear|ease\\-in\\-out|ease\\-in|ease\\-out|ease)", // Order is significant
      "(?<comma>,)",
      "(?<operator>[\\+\\-\\*\\/\\^])",
      "(?<comparison>\\<=|\\>=|\\=\\=\\=|\\=\\=|\\=|\\<|\\>)",
      "(?<leftParenthesis>[(\\[])",
      "(?<rightParenthesis>[)\\]])",
      "(?<number>[\\d\\.]+)",
    ];
    this.matcher = new RegExp(`(${TOKEN_TYPES.join("|")})`);

    this.currentToken = undefined;
  }

  parse(string) {
    string = string.replace(" ", "");
    if (string.length === 0) {
      return {};
    }

    this.tokens = this.tokenize(string);
    return this.additive();
  }

  parseCondition(string) {
    string = string.replace(" ", "");
    if (string.length === 0) {
      return {};
    }

    this.tokens = this.tokenize(string);
    return this.comparison();
  }

  parseAnimation(string) {
    string = string.replace(" ", "");
    if (string.length === 0) {
      return {};
    }

    this.tokens = this.tokenize(string);
    return this.animationArguments();
  }

  *tokenize(string) {
    let index = 0;
    string = string.replace(" ", "");
    while (index < string.length) {
      const match = string.substring(index).match(this.matcher);

      if (!match) {
        throw new SyntaxError(`Could not recognize token starting from "${string.substring(index)}"`);
      }
      index += match[0].length;
      for (const [key, value] of Object.entries(match.groups)) {
        if (value !== undefined) {
          yield { type: key, value: value };
          break;
        }
      }
    }
  }

  getToken() {
    let token = this.currentToken ? this.currentToken : this.tokens.next().value;
    this.currentToken = undefined;
    return token;
  }

  peekToken() {
    if (!this.currentToken) {
      this.currentToken = this.tokens.next().value;
    }
    return this.currentToken;
  }

  skipToken() {
    if (!this.currentToken) {
      this.currentToken = this.tokens.next().value;
    }
    this.currentToken = undefined;
  }

  comparison() {
    let left = this.additive();
    let token = this.peekToken();
    if (token && token.type === this.COMPARISON) {
      this.skipToken();
      const right = this.additive();
      left = {
        type: this.OPERATOR,
        operator: token.value,
        left: left,
        right: right,
      };
    }
    return left;
  }

  additive() {
    let left = this.multiplicative();
    let token = this.peekToken();
    while (token && token.type === this.OPERATOR && (token.value === "+" || token.value === "-")) {
      this.skipToken();
      const right = this.multiplicative();
      left = this.getNode(token.value, left, right);
      token = this.peekToken();
    }
    return left;
  }

  multiplicative() {
    let left = this.primary();
    let token = this.peekToken();
    while (token && token.type === this.OPERATOR && (token.value === "*" || token.value === "/")) {
      this.skipToken();
      const right = this.primary();
      left = this.getNode(token.value, left, right);
      token = this.peekToken();
    }
    return left;
  }

  primary() {
    let token = this.peekToken();
    if (token && token.type === this.NUMBER) {
      this.skipToken();
      return { type: this.NUMBER, value: parseFloat(token.value) };
    } else if (token && token.type === this.ID_AND_ATTRIBUTE) {
      this.skipToken();
      const [id, attribute] = token.value.split(".");
      return {
        type: this.ID_AND_ATTRIBUTE,
        value: { id: id, attribute: attribute },
      };
    } else if (token && token.type === this.KEYWORD) {
      this.skipToken();
      return { type: this.KEYWORD, value: token.value };
    } else if (token && token.type === this.FUNCTION) {
      const functionName = token.value;
      this.skipToken();
      token = this.getToken();
      if (!token || token.type !== this.LEFT_PARENTHESIS) {
        // Functions do not need arguments or even parenthesis
        return {
          type: this.FUNCTION,
          value: functionName,
          args: [],
        };
        //throw new SyntaxError(`Function name should be followed by parenthesis`);
      }
      let argumentExpression = functionName.startsWith("between")
        ? this.idAndAttributeArguments.bind(this)
        : this.arguments.bind(this);
      return {
        type: this.FUNCTION,
        value: functionName,
        args: argumentExpression(),
      };
    } else if (token && token.type === this.LEFT_PARENTHESIS) {
      this.skipToken();
      const node = this.additive();
      token = this.getToken();
      if (!token || token.type !== this.RIGHT_PARENTHESIS) {
        throw new SyntaxError("Missing closing parenthesis");
      }
      return node;
    } else {
      throw new SyntaxError(`Unexpected ${token.type}: ${token.value}`);
    }
  }

  arguments() {
    // Allow empty args
    let token = this.peekToken();
    if (token && token.type === this.RIGHT_PARENTHESIS) {
      this.skipToken();
      return [];
    }
    let argument = this.additive();
    token = this.getToken();
    if (token && token.type === this.COMMA) {
      return [argument].concat(this.arguments());
    } else if (token && token.type === this.RIGHT_PARENTHESIS) {
      return [argument];
    } else {
      throw new SyntaxError(`Expected comma or closing parenthesis in function arguments, got: ${token}`);
    }
  }

  idAndAttributeArguments() {
    let token = this.getToken();
    if (!token || token.type !== this.ID_AND_ATTRIBUTE) {
      throw new SyntaxError(`Expected an id-and-attribute argument, got: ${token}`);
    }
    let argument = token;
    token = this.getToken();
    if (token && token.type === this.COMMA) {
      return [argument].concat(this.idAndAttributeArguments());
    } else if (token && token.type === this.RIGHT_PARENTHESIS) {
      return [argument];
    } else {
      throw new SyntaxError(`Expected comma or closing parenthesis in function arguments, got: ${token}`);
    }
  }

  animationArguments(options = {}) {
    let token = this.getToken();
    if (token) {
      switch (token.type) {
        case this.DURATION:
          options.duration = parseFloat(token.value) * 1000;
          break;
        case this.EASING:
          options.easing = token.value;
          break;
        default:
          throw SyntaxError(`Animation options, could not parse ${token.value}`);
      }
      token = this.getToken();
      if (token) {
        if (token.type === this.COMMA) {
          return this.animationArguments(options);
        } else {
          throw new SyntaxError(`Animation parameters, expected comma, got: ${token.value}`);
        }
      } else {
        return options;
      }
    }
    return options;
  }

  getNode(operator, left, right) {
    // Return a node combining the operator and left and right sides, or if possible, already calculated number node
    if (left && left.type === this.NUMBER && right && right.type === this.NUMBER) {
      return {
        type: this.NUMBER,
        value: UI4.operations[operator](left.value, right.value),
      };
    } else {
      return {
        type: this.OPERATOR,
        operator: operator,
        left: left,
        right: right,
      };
    }
  }
};

// Export only for tests under Node, instantiate only for browser
if (new Function("try {return this === global;} catch(e) {return false;}")()) {
  module.exports = UI4;
} else {
  var ui4 = new UI4();
  ui4.init();
}
