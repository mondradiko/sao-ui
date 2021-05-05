import Color from "../types/Color";
import Element from "../types/Element";
import DynamicElement from "../types/DynamicElement";
import UiPanel from "../../codegen/ui/UiPanel";

export default class NotchedBox extends Element implements DynamicElement {
  constructor(panel: UiPanel,
              public x: f64, public y: f64,
              public w: f64, public h: f64,
              public color: Color) {
    super(panel);
  }

  update(dt: f64): bool {
    this.drawRect(this.x, this.y, this.w, this.h, this.color);
    // WIP: Notch position/size
	  // this.panel.drawTriangle(-0.38, 0, -0.44, 0.035, -0.44, -0.035, this.color.r, this.color.g, this.color.b, this.color.a);
    return true;
  }

  onSelect(x: f64, y: f64): void {}
}
