import Color from "../types/Color";
import Element from "../types/Element";
import DynamicElement from "../types/DynamicElement";
import Theme from "../types/Theme";
import UiPanel from "../../codegen/ui/UiPanel";

export default class RoundButton extends Element implements DynamicElement {
  public signalled: bool = false;

  fade_duration: f64 = 0.2;
  fade_duration_ring: f64 = 0.45;
  fade_step: f64 = this.fade_duration;

  constructor(panel: UiPanel,
              public x: f64, public y: f64,
              public radius: f64) {
    super(panel);
  }

  update(dt: f64): bool {
    this.fade_step += dt;

    let d = 1 - (this.fade_step / this.fade_duration);
    let d_ring = 1 - (this.fade_step / this.fade_duration_ring);
    if (d > 1.0) {
      d = 1.0;
    } else if (d < 0.0) {
      d = 0.0;
    } else {
      d = Math.pow(d, 1.5);
    }
    if (d_ring > 1.0) {
      d_ring = 1.0;
    } else if (d_ring < 0.0) {
      d_ring = 0.0;
    } else {
      d_ring = Math.pow(d_ring, 5);
    }
    let color = Color.lerp(Theme.primary, Theme.white, d);
    let ring_color = Theme.primary.clone();
    ring_color.a = 1 - Math.sqrt(d_ring);

    let shrink = (d - d * d) * 4.0;
    let shrink_ring = (d_ring - d_ring * d_ring) * 4.0;
    let outer_radius = this.radius - 0.005 * shrink;
    let ring_radius = this.radius + 0.005 + (0.005 * shrink_ring);

    this.drawCircle(this.x, this.y, outer_radius, color);
    this.drawCircleOutline(this.x, this.y, ring_radius, 0.001, ring_color);
    return true;
  }

  onSelect(x: f64, y: f64): void {
    let dx = x - this.x;
    let dy = y - this.y;
    let d = Math.sqrt(dx * dx + dy * dy);

    if (d < this.radius) {
      this.fade_step = 0;
      this.signalled = true;
    }
  }
}
