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

  onSelect(x: f64, y: f64): void {
    for (let i = 0; i < this.elements.length; i++) {
      this.elements[i].onSelect(x, y);
    }
  }

  animateIn(): void {
    for (let i = 0; i < this.elements.length; i++) {
      this.elements[i].animateIn();
    }
  }
}
