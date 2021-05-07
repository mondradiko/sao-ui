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
  playing_clicked_animation: bool = false;

  is_visible: bool = false;

  playing_animate_in: bool = false;
  animate_in_length: f64 = 0.6;
  animate_in_distance: f64 = 0.25;

  constructor(panel: UiPanel,
              public x: f64, public y: f64,
              public radius: f64) {
    super(panel);
  }

  update(dt: f64): bool {
    this.fade_step += dt;

    if (!this.is_visible) return true;

    if (this.playing_animate_in) {
      this.drawAnimateIn()
    } else if (this.playing_clicked_animation) {
      this.drawClicked()
    } else {
      let color = Theme.primary;
      this.drawCircle(this.x, this.y, this.radius, color);
      this.drawCircleOutline(this.x, this.y, this.radius + 0.005, 0.001, color);
    }

    return true;
  }

  drawAnimateIn(): void {
    let d = this.fade_step / this.animate_in_length; //from 0.0-1.0
    if (d >= 1) {
      this.playing_animate_in = false;
      d = 1;
    }

    let color = Theme.primary;
    color.a = d;
    let ease_func = this.easeOutExpo(d);
    this.drawCircle(this.x, this.y + this.animate_in_distance * (1 - ease_func), this.radius, color);
    this.drawCircleOutline(this.x, this.y + this.animate_in_distance * (1 - ease_func), this.radius + 0.005, 0.001, color);
  }

  easeOutExpo(x: number): number {
    return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
  }

  drawClicked(): void {
    let d = 1 - (this.fade_step / this.fade_duration);
    let d_ring = 1 - (this.fade_step / this.fade_duration_ring);
    if (d > 1.0) {
      d = 1.0;
    } else if (d < 0.0) {
      d = 0.0;
      this.playing_clicked_animation = false;
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
  }

  onSelect(x: f64, y: f64): void {
    let dx = x - this.x;
    let dy = y - this.y;
    let d = Math.sqrt(dx * dx + dy * dy);

    if (d < this.radius) {
      this.fade_step = 0;
      this.signalled = true;
      this.playing_clicked_animation = true;
    }
  }

  animateIn(): void {
    this.is_visible = true;
    this.playing_animate_in = true;
    this.fade_step = 0;
    //TODO
  }
}
