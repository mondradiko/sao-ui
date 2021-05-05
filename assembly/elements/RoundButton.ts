import Color from "../types/Color";
import Element from "../types/Element";
import DynamicElement from "../types/DynamicElement";
import UiPanel from "../../codegen/ui/UiPanel";

export default class RoundButton extends Element implements DynamicElement {
  public signalled: bool = false;

  constructor(panel: UiPanel,
              public x: f64, public y: f64,
              public radius: f64,
              public color: Color) {
    super(panel);
  }

  update(dt: f64): bool {
    this.drawCircle(this.x, this.y, this.radius, this.color);
    this.drawCircleOutline(this.x, this.y, this.radius + 0.005, 0.001, this.color);
    return true;
  }

  onSelect(x: f64, y: f64): void {
    let dx = x - this.x;
    let dy = y - this.y;
    let d = Math.sqrt(dx * dx + dy * dy);

    if (d < this.radius) {
      this.signalled = true;
    }
  }
}
