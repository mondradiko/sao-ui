import Element from "./Element";
import DynamicElement from "./DynamicElement";
import UiPanel from "../../codegen/ui/UiPanel";

export default class Container<ElementType extends DynamicElement> extends Element implements DynamicElement {
  elements: Array<ElementType> = [];

  constructor(panel: UiPanel) { super(panel); }

  addElement(element: ElementType): void {
    this.elements.push(element);
  }

  update(dt: f64): bool {
    let i: i32 = 0;
    while (i < this.elements.length) {
      let element = this.elements[i];

      if (element.update(dt)) {
        i++;
      } else {
        this.elements.splice(i, 1);
      }
    }

    return i != 0;
  }

  //if any one of the elements consumed the event then return true
  onSelect(x: f64, y: f64): bool {
    let status = false;
    for (let i = 0; i < this.elements.length; i++) {
      if (this.elements[i].onSelect(x, y)) {
        status = true;
      }
    }
    return status;
  }

  isInBounds(x: f64, y: f64): bool {
    for (let i = 0; i < this.elements.length; i++) {
      if (this.elements[i].isInBounds(x, y)) {
        return true;
      }
    }
    return false;
  }

  animateIn(): void {
    for (let i = 0; i < this.elements.length; i++) {
      this.elements[i].animateIn();
    }
  }
}
