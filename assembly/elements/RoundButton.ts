import Color from "../types/Color";
import Element from "../types/Element";
import DynamicElement from "../types/DynamicElement";
import Theme from "../types/Theme";
import UiPanel from "../types/UiPanel";
import ColorAnimation from "../types/ColorAnimation";
import Animation from "../types/Animation";
import { AnimationTimingFunction } from "../types/Animation";

export default class RoundButton extends Element implements DynamicElement {
  public is_selected: bool = false;

  fade_duration: f64 = 0.2;
  fade_duration_ring: f64 = 0.45;
  fade_step: f64 = this.fade_duration;
  playing_clicked_animation: bool = false;

  is_visible: bool = false;

  public animate_in_distance: f64 = 0.25;
  animate_in_length: f64 = 0.6;

  private anim_button_status: i8 = 0;
  anim_change_duration: f64 = 0.15;
  anim_ring_color: ColorAnimation = new ColorAnimation(Theme.white, Theme.white, 0, AnimationTimingFunction.LINEAR);
  anim_circle_color: ColorAnimation = new ColorAnimation(Theme.white, Theme.white, 0, AnimationTimingFunction.LINEAR);
  anim_icon_color: ColorAnimation = new ColorAnimation(Theme.white, Theme.white, 0, AnimationTimingFunction.LINEAR);

  anim_y: Animation = new Animation(0, 0, 0, AnimationTimingFunction.LINEAR);
  anim_x: Animation = new Animation(0, 0, 0, AnimationTimingFunction.LINEAR);

  constructor(panel: UiPanel,
              public x: f64, public y: f64,
              public radius: f64) {
    super(panel);
    
  }

  update(dt: f64): bool {
    this.fade_step += dt;

    this.anim_circle_color.update(dt);
    this.anim_ring_color.update(dt);
    this.anim_icon_color.update(dt);
    let draw_y = this.anim_y.update(dt);
    this.anim_x.update(dt);

    if (!this.is_visible) return true;

    if (this.playing_clicked_animation) {
      this.drawClicked()
    } else {
      this.drawCircle(this.anim_x.getValue(), draw_y, this.radius, this.anim_circle_color.getCurrentColor());
      this.drawCircleOutline(this.anim_x.getValue(), draw_y, this.radius + 0.005, 0.001, this.anim_ring_color.getCurrentColor());
    }

    return true;
  }

  /**
   * 0 = Entering
   * 1 = Disabled
   * 2 = Deselected
   * 3 = Active
   */
  setVisualStatus(status: i8): void {
    this.anim_button_status = status;

    let currentCircleColor: Color = this.anim_circle_color.getCurrentColor();
    let currentRingColor: Color = this.anim_ring_color.getCurrentColor();
    let currentIconColor: Color = this.anim_icon_color.getCurrentColor();

    this.anim_circle_color = new ColorAnimation(currentCircleColor, Theme.CIRCLE_COLORS[status], this.anim_change_duration, AnimationTimingFunction.LINEAR);
    this.anim_ring_color = new ColorAnimation(currentRingColor, Theme.RING_COLORS[status], this.anim_change_duration, AnimationTimingFunction.LINEAR);
    this.anim_icon_color = new ColorAnimation(currentIconColor, Theme.ICON_COLORS[status], this.anim_change_duration, AnimationTimingFunction.LINEAR);
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
    let color_circle = Color.lerp(this.anim_circle_color.getCurrentColor(), Theme.white, d);
    let target_ring_color = Theme.white.clone();
    target_ring_color.a = 1 - Math.sqrt(d_ring);
    let color_ring = Color.lerp(this.anim_ring_color.getCurrentColor(), target_ring_color, d);

    let shrink = (d - d * d) * 4.0;
    let shrink_ring = (d_ring - d_ring * d_ring) * 4.0;
    let outer_radius = this.radius - 0.005 * shrink;
    let ring_radius = this.radius + 0.005 + (0.005 * shrink_ring);

    this.drawCircle(this.anim_x.getValue(), this.anim_y.getValue(), outer_radius, color_circle);
    this.drawCircleOutline(this.anim_x.getValue(), this.anim_y.getValue(), ring_radius, 0.001, color_ring);
  }

  moveToY(target_y: f64): void {
    this.y = target_y;
    this.anim_y = new Animation(this.anim_y.getValue(), target_y, 0.3, AnimationTimingFunction.EASE_IN_OUT);
  }

  onSelect(x: f64, y: f64): bool {
    if (this.isInBounds(x, y)) {
      this.fade_step = 0;
      this.is_selected = true;
      this.playing_clicked_animation = true;
      if (this.anim_button_status == 2) { //if deselected
        this.setVisualStatus(3);
      }
      return true;
    } else {
      return false;
    }
  }

  isInBounds(x: f64, y: f64): bool {
    let dx = x - this.x;
    let dy = y - this.y;
    let d = Math.sqrt(dx * dx + dy * dy);
    return d < this.radius;
  }

  markDeselected(): void {
    this.is_selected = false;
    if (this.anim_button_status == 3) {
      this.setVisualStatus(2);
    }
  }

  animateIn(): void {
    this.is_visible = true;
    this.anim_y = new Animation(this.y + this.animate_in_distance, this.y, this.animate_in_length, AnimationTimingFunction.EASE_OUT);
    this.anim_x = new Animation(this.x, this.x, 0, AnimationTimingFunction.LINEAR);
    this.anim_ring_color = new ColorAnimation(Theme.white, Theme.white, 0, AnimationTimingFunction.LINEAR);
    this.anim_circle_color = new ColorAnimation(Theme.white, Theme.white, 0, AnimationTimingFunction.LINEAR);
    this.anim_icon_color = new ColorAnimation(Theme.white, Theme.white, 0, AnimationTimingFunction.LINEAR);
    this.fade_step = 0;
  }

  animateOut(): void {
    //this.anim_x = new Animation(this.x, this.x - 0.2, 0.3, AnimationTimingFunction.EASE_IN);
    this.anim_ring_color = new ColorAnimation(this.anim_ring_color.getCurrentColor(), Theme.transparent, 0.3, AnimationTimingFunction.LINEAR);
    this.anim_circle_color = new ColorAnimation(this.anim_circle_color.getCurrentColor(), Theme.transparent, 0.3, AnimationTimingFunction.LINEAR);
    this.anim_icon_color = new ColorAnimation(this.anim_icon_color.getCurrentColor(), Theme.transparent, 0.3, AnimationTimingFunction.LINEAR);
  }
}
