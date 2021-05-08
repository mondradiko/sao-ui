import Color from "../types/Color";
import Element from "../types/Element";
import DynamicElement from "../types/DynamicElement";
import Theme from "../types/Theme";
import UiPanel from "../../codegen/ui/UiPanel";

/**
   * 0 = Entering
   * 1 = Disabled
   * 2 = Deselected
   * 3 = Active
   */
const RING_COLORS = [Theme.white, Theme.disabled_button, Theme.disabled_button, Theme.primary];
const CIRCLE_COLORS = [Theme.white, Theme.disabled_button, Theme.disabled_button, Theme.primary];
const ICON_COLORS = [Theme.secondary, Theme.secondary, Theme.secondary, Theme.white];

export default class RoundButton extends Element implements DynamicElement {
  public is_selected: bool = false;

  fade_duration: f64 = 0.2;
  fade_duration_ring: f64 = 0.45;
  fade_step: f64 = this.fade_duration;
  playing_clicked_animation: bool = false;

  is_visible: bool = false;

  playing_animate_in: bool = false;
  animate_in_length: f64 = 0.6;
  public animate_in_distance: f64 = 0.25;

  
  private anim_previous_ring_color: Color = Theme.white
  private anim_previous_circle_color: Color = Theme.white
  private anim_previous_icon_color: Color = Theme.white
  private anim_button_status: i8 = 0;
  private anim_button_time: f64 = 0;
  anim_change_duration: f64 = 0.15;
  anim_ring_color: Color = Theme.white
  anim_circle_color: Color = Theme.white
  anim_icon_color: Color = Theme.white

  constructor(panel: UiPanel,
              public x: f64, public y: f64,
              public radius: f64) {
    super(panel);
  }

  update(dt: f64): bool {
    this.fade_step += dt;

    this.recalculateColor(dt);

    if (!this.is_visible) return true;

    if (this.playing_animate_in) {
      this.drawAnimateIn()
    } else if (this.playing_clicked_animation) {
      this.drawClicked()
    } else {
      this.drawCircle(this.x, this.y, this.radius, this.anim_circle_color);
      this.drawCircleOutline(this.x, this.y, this.radius + 0.005, 0.001, this.anim_ring_color);
    }

    return true;
  }

  private recalculateColor(dt: f64): void {
    let is_animating: bool = this.anim_button_time < this.anim_change_duration;
    this.anim_button_time += dt;
    if (is_animating) {
      let d = this.anim_button_time / this.anim_change_duration;
      let target_ring_color = RING_COLORS[this.anim_button_status];
      let target_circle_color = CIRCLE_COLORS[this.anim_button_status];
      let target_icon_color = ICON_COLORS[this.anim_button_status];
      if (d >= 1) {
        this.anim_ring_color = target_ring_color;
        this.anim_circle_color = target_circle_color;
        this.anim_icon_color = target_icon_color;
      } else {
        this.anim_ring_color = Color.lerp(this.anim_previous_ring_color, target_ring_color, d);
        this.anim_circle_color = Color.lerp(this.anim_previous_circle_color, target_circle_color, d);
        this.anim_icon_color = Color.lerp(this.anim_previous_icon_color, target_icon_color, d);
      }
    }
  }

  drawAnimateIn(): void {
    let d = this.fade_step / this.animate_in_length; //from 0.0-1.0
    let color = Theme.white;
    if (d >= 1) {
      d = 1;
      this.playing_animate_in = false;
    }

    let ease_func = this.easeOutExpo(d);
    this.drawCircle(this.x, this.y + this.animate_in_distance * (1 - ease_func), this.radius, this.anim_circle_color);
    this.drawCircleOutline(this.x, this.y + this.animate_in_distance * (1 - ease_func), this.radius + 0.005, 0.001, this.anim_ring_color);
  }

  /**
   * 0 = Entering
   * 1 = Disabled
   * 2 = Deselected
   * 3 = Active
   */
  setVisualStatus(status: i8): void {
    this.anim_button_status = status;
    this.anim_button_time = 0;
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
    let color_circle = Color.lerp(this.anim_circle_color, Theme.white, d);
    let target_ring_color = Theme.white.clone();
    target_ring_color.a = 1 - Math.sqrt(d_ring);
    let color_ring = Color.lerp(this.anim_ring_color, target_ring_color, d);

    let shrink = (d - d * d) * 4.0;
    let shrink_ring = (d_ring - d_ring * d_ring) * 4.0;
    let outer_radius = this.radius - 0.005 * shrink;
    let ring_radius = this.radius + 0.005 + (0.005 * shrink_ring);

    this.drawCircle(this.x, this.y, outer_radius, color_circle);
    this.drawCircleOutline(this.x, this.y, ring_radius, 0.001, color_ring);
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
    this.playing_animate_in = true;
    this.fade_step = 0;
    //TODO
  }
}
