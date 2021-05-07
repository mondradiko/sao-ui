import Color from "../types/Color";
import Element from "../types/Element";
import DynamicElement from "../types/DynamicElement";
import UiPanel from "../../codegen/ui/UiPanel";
import Vector2 from "../../codegen/types/Vector2";

export default class NotchedBox extends Element implements DynamicElement {
  notch1: Vector2 = new Vector2(0.0, 0.0);
  notch2: Vector2 = this.notch1;
  notch3: Vector2 = this.notch1;

  fade_duration: f64 = 0.1;
  fade_target: f64 = this.fade_duration;
  fade_step: f64 = 0.0;

  constructor(panel: UiPanel,
              public x: f64, public y: f64,
              public w: f64, public h: f64,
              public notch_x: f64, public notch_y: f64,
              public notch_size: f64,
              public color: Color) {
    super(panel);
    this.updateNotch();
  }

  updateNotch(): void {
    let l = this.x;
    let t = this.y;
    let r = this.x + this.w;
    let b = this.y + this.h;

    let size = this.notch_size;
    let base = this.notch_size * 0.717;
    let nx = this.notch_x;
    let ny = this.notch_y;

    if (nx > this.x && nx < r &&
        ny > this.y && ny < b) {  // Inside cases
      this.makeBadNotch();
    } else if ((nx > l && (ny < t || ny > b)) ||
               (nx < b && (ny < t || ny > b))) {  // Diagonal cases
      this.makeBadNotch();
    } else if (nx < this.x) {  // Left side
      this.notch1 = new Vector2(l, ny - base);
      this.notch2 = new Vector2(l, ny + base);
      this.notch3 = new Vector2(l - size, ny);
    } else if (ny < this.y) {  // Top side
      this.notch1 = new Vector2(nx - base, t);
      this.notch2 = new Vector2(nx + base, t);
      this.notch3 = new Vector2(nx, t - size);
    } else if (nx > r) {  // Right side
      this.notch1 = new Vector2(r, ny - base);
      this.notch2 = new Vector2(r, ny + base);
      this.notch3 = new Vector2(r + size, ny);
    } else if (ny > b) {  // Bottom side
      this.notch1 = new Vector2(nx - base, b);
      this.notch2 = new Vector2(nx + base, b);
      this.notch3 = new Vector2(nx, b + size);
    }
  }

  makeBadNotch(): void {
    let r = this.x + this.w;
    let b = this.y + this.h;

    /*this.notch1 = new Vector2(r, b);
    this.notch2 = new Vector2(r + 0.1, b);
    this.notch3 = new Vector2(r, b + 0.1);*/

    this.notch1 = new Vector2(r, b);
    this.notch2 = new Vector2(r, b);
    this.notch3 = new Vector2(r, b);
  }

  update(dt: f64): bool {
    this.fade_step += dt * Math.sign(this.fade_target - this.fade_step);

    if (this.fade_step < 0.0) {
      return false;
    }

    if (this.fade_step > this.fade_duration) {
      this.fade_step = this.fade_duration;
    }

    let alpha = this.fade_step / this.fade_duration;
    if (alpha > 1.0) {
      alpha = 1.0;
    } else if (alpha < 0.0) {
      alpha = 0.0;
    }

    alpha = alpha * alpha * (3 - 2 * alpha);

    let color = this.color.clone();
    color.a = alpha;

    this.drawRect(this.x, this.y, this.w, this.h, color);

    this.panel.drawTriangle(
      this.notch1.x, this.notch1.y,
      this.notch2.x, this.notch2.y,
      this.notch3.x, this.notch3.y,
      color.r, color.g, color.b, color.a
    );

    return true;
  }

  onSelect(x: f64, y: f64): bool {
    return false;
  }

  isInBounds(x: f64, y: f64): bool {
    return x > this.x && x < (this.x + this.w) && y > this.y && y < (this.y + this.h);
  }

  close(): void {
    this.fade_target = 0.0;
  }

  animateIn(): void {
    //TODO
  }
}
