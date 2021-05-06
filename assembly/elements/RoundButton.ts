import Color from "../types/Color";
import Element from "../types/Element";
import DynamicElement from "../types/DynamicElement";
import Theme from "../types/Theme";
import UiPanel from "../../codegen/ui/UiPanel";

export default class RoundButton extends Element implements DynamicElement {
  public signalled: bool = false;

  fade_step: f64 = 0.0;
  fade_duration: f64 = 0.25;

  constructor(panel: UiPanel,
              public x: f64, public y: f64,
              public radius: f64) {
    super(panel);
  }

  update(dt: f64): bool {
    this.fade_step -= dt;

    let d = this.fade_step / this.fade_duration;
    let color = Color.lerp(Theme.primary, Theme.white, d);
    if (d > 1.0) {
      d = 1.0;
    } else if (d < 0.0) {
      d = 0.0;
    } else {
      d = Math.pow(d, 1.5);
    }

    let shrink = (d - d * d) * 4.0;
    let outer_radius = this.radius + 0.005 * shrink;

    this.drawCircle(this.x, this.y, outer_radius, color);
    this.drawCircleOutline(this.x, this.y, this.radius + 0.005, 0.001, color);
    return true;
  }

  onSelect(x: f64, y: f64): void {
    let dx = x - this.x;
    let dy = y - this.y;
    let d = Math.sqrt(dx * dx + dy * dy);

    if (d < this.radius) {
      this.fade_step = this.fade_duration;
      this.signalled = true;
    }
  }
}
