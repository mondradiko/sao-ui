import Color from "../types/Color";
import Element from "../types/Element";
import DynamicElement from "../types/DynamicElement";
import UiPanel from "../types/UiPanel";

export default class Label extends Element implements DynamicElement {
  w: f64;
  h: f64;

  constructor(panel: UiPanel, public text: string,
              public x: f64, public y: f64,
              public color: Color) {
    super(panel);

    this.w = text.length * 0.0375;
    this.h = 0.05;

    this.x -= 0.02;
    this.y -= this.h / 2.0;
  }

  update(dt: f64): bool {
    this.drawRect(this.x, this.y, this.w, this.h, this.color);
    return true;
  }

  onSelect(x: f64, y: f64): void {}
}
