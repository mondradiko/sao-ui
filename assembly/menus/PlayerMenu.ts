import NotchedBox from "../elements/NotchedBox";
import RoundButton from "../elements/RoundButton";
import Element from "../types/Element";
import Theme from "../types/Theme";
import BoxList from "./BoxList";
import UiPanel from "../../codegen/ui/UiPanel";
import BoxButton from "../elements/BoxButton";
import DynamicElement from "../types/DynamicElement";
import TimerCallback from "../types/TimerCallback";
import Animation from "../types/Animation";
import { AnimationTimingFunction } from "../types/Animation";

export default class PlayerMenu extends Element implements DynamicElement {
  boxes: BoxList;
  timers: TimerCallback<Element>[] = [];

  w: f64 = 0.2;
  h: f64 = 0.05;
  space: f64 = this.h + 0.004;
  state: string = "closed";
  selected_button_index: i32 = -1;

  left_bar_animation: Animation = new Animation(0, 0, 0, AnimationTimingFunction.LINEAR);
  notch_y: f64;

  constructor(panel: UiPanel, public character_button: RoundButton, public buttons: string[]) {
    super(panel);
    this.boxes = new BoxList(panel);
    this.notch_y = this.character_button.y;
  }

  update(dt: f64): bool {

    let animation_val = this.left_bar_animation.update(dt);
    let inProgressTimers: TimerCallback<Element>[] = [];
    for (let timerId = 0; timerId < this.timers.length; timerId++) {
      this.timers[timerId].update(dt);
      if (!this.timers[timerId].isFinished()) {
        inProgressTimers.push(this.timers[timerId]);
      }
    }
    this.timers = inProgressTimers;

    this.wrapAroundBoxes();
    let dissapear_tightness = this.boxes.elements.length < 7 && this.boxes.elements.length > 3 ? 20 : 10;
    for (let i = 0; i < this.boxes.elements.length; i++) {
      let btn = this.boxes.elements[i];
      let distance = btn.display_y - this.notch_y;
      if (distance > this.space) {
        let off_by = distance - this.space;
        btn.opacity = Math.max(0, 1 - (off_by * dissapear_tightness));
      } else if (0 - distance > (this.space * 2)) {
        let off_by = 0 - distance - this.space * 2;
        btn.opacity = Math.max(0, 1 - (off_by * dissapear_tightness));
      } else {
        btn.opacity = 1;
      }
    }

    if (!this.boxes.update(dt)) {
      this.state = "closed";
    }

    if (animation_val > 0) {
      let notch_x = this.character_button.x + this.character_button.radius * (2.5 - 0.75);
      let notch_x2 = this.character_button.x + this.character_button.radius * 2.5;
      this.panel.drawTriangle(notch_x, this.notch_y, notch_x2, this.notch_y + 0.01, notch_x2, this.notch_y - 0.01, 1, 1, 1, animation_val);

      for (let i: f64 = 0.0; i < 100.0; i += 1) {
        let col = Theme.white.clone();
        col.a = (100 - i) / 100.0 * animation_val;
        let y_from_center = (i * animation_val) / 100.0;
        let next_y_from_center = ((i + 1) * animation_val) / 100.0;
        this.drawRect(notch_x2, this.notch_y + (y_from_center * this.space * 1.5), 0.003, y_from_center - next_y_from_center, col);
        this.drawRect(notch_x2, this.notch_y - (y_from_center * this.space * 1.5), 0.003, y_from_center - next_y_from_center, col);
      }
    } else if (this.state == "opening" && this.selected_button_index != -1) {
      let notch_x = this.character_button.x + this.character_button.radius * (2.5 - 0.75);
      let notch_x2 = this.character_button.x + this.character_button.radius * 2.5 + 0.005;
      this.panel.drawTriangle(notch_x, this.notch_y, notch_x2, this.notch_y + 0.01, notch_x2, this.notch_y - 0.01,
        Theme.primary.r, Theme.primary.g, Theme.primary.b, 1);
    }

    if (!this.is_scrolling && this.scroll_velocity != 0) {
      for (let i = 0; i < this.boxes.elements.length; i++) {
        let btn = this.boxes.elements[i];
        btn.immediateMoveToY(btn.y + this.scroll_velocity);
      }
      this.wrapAroundBoxes();
      for (let i = 0; i < this.boxes.elements.length; i++) {
        let btn = this.boxes.elements[i];
        btn.setVisualStatus(2);
      }
      this.scroll_velocity /= 1.02;
      if (Math.abs(this.scroll_velocity) < 0.0003 || Math.abs(this.findNearestButton().y - this.notch_y) > this.space * 2) {
        this.selectClosest();
        this.scroll_velocity = 0;
      }
    }

    return true;
  }

  protected easeInExpo(x: f64): f64 {
    return x === 0 ? 0 : Math.pow(1.6, 10 * x - 10);
  }

  animateIn(): void {
    this.open();
  }
  isInBounds(x: number, y: number): bool {
    let total_height = this.space * 7;
    let top_y = this.notch_y + this.space * 3.5;
    let box_x = this.character_button.x + this.character_button.radius * 2.5;
    return x >= box_x && x < (box_x + this.w) && y < top_y && y > (top_y - total_height);
  }

  onSelect(x: f64, y: f64): bool {
    if (this.boxes.onSelect(x, y)) {
      for (let i = 0; i < this.boxes.elements.length; i++) {
        let button = this.boxes.elements[i];
        if (!button.isInBounds(x, y)) {
          button.markDeselected();
        } else {
          this.left_bar_animation = new Animation(this.left_bar_animation.getValue(), 0, 0.15, AnimationTimingFunction.LINEAR);
          this.selected_button_index = i;
        }
      }
      let move_y = this.boxes.elements[this.selected_button_index].y - this.notch_y + this.space / 2;
      for (let i = 0; i < this.boxes.elements.length; i++) {
        let button = this.boxes.elements[i];
        button.moveToY(button.y - move_y);
      }
      return true;
    }
    return false;
  }

  toggle(): void {
    if (this.state == "closed") {
      this.open();
    } else {
      this.close();
    }
  }

  open(): void {
    if (this.state != "closed") return;
    this.state = "opening";
    let x = this.character_button.x + this.character_button.radius * 2.5;
    let y = this.character_button.y;
    this.notch_y = y;

    y -= this.h / 2.0;

    let ns = this.character_button.radius * 0.75;  // Notch size
    let nx = x - ns;  // Notch X
    let ny = this.character_button.y;

    let num_buttons = this.buttons.length;

    let button_index = num_buttons < 3 ? -1 : 0 - Math.floor(num_buttons / 2);
    let animate_in_theshold = (num_buttons / 2 - 2)
    for (let i = num_buttons - 1; i >= 0; i--) {
      let player_menu = new BoxButton(this.panel, x + 0.005, y + button_index * this.space, this.w, this.h, this.buttons[i]);
      let delay = Math.min((i - animate_in_theshold) * 0.06, 1);
      this.timers.push(new TimerCallback(delay, player_menu, (player_menu) => {
        (player_menu as BoxButton).animateIn();
      }));
      this.boxes.addElement(player_menu);
      button_index++;
    }
    this.left_bar_animation = new Animation(0, 1, 0.15, AnimationTimingFunction.LINEAR);
  }

  close(): void {
    if (this.state == "closed") return;
    this.state = "closing";
    this.selected_button_index = -1;

    this.left_bar_animation = new Animation(this.left_bar_animation.getValue(), 0, 0.15, AnimationTimingFunction.LINEAR);
    for (let i = 0; i < this.boxes.elements.length; i++) {
      this.timers.push(new TimerCallback(0.15, this.boxes.elements[i], (player_menu) => {
        (player_menu as BoxButton).animateOut();
      }));
    }
  }

  is_scrolling: bool = false;
  scrolling_y: f64 = 0;
  scroll_velocity: f64 = 0;

  onScroll(y: f64): void {
    if (this.state == "closing") return;
    if (this.boxes.elements.length < 4) return;
    if (!this.is_scrolling) {
      this.scrolling_y = y;
      this.is_scrolling = true;

      this.selected_button_index = -1;
      this.left_bar_animation = new Animation(0, 1, 0.15, AnimationTimingFunction.LINEAR);
    }
    let delta = y - this.scrolling_y;
    this.scroll_velocity = delta;
    this.scrolling_y = y;
    for (let i = 0; i < this.boxes.elements.length; i++) {
      let btn = this.boxes.elements[i];
      btn.immediateMoveToY(btn.y + delta);
    }
    this.wrapAroundBoxes();
    let closest = this.findNearestButton();
    for (let i = 0; i < this.boxes.elements.length; i++) {
      let btn = this.boxes.elements[i];
      if (btn == closest) {
        btn.setVisualStatus(0);
      } else if (i != this.selected_button_index) {
        btn.setVisualStatus(2);
      } else {
        btn.setVisualStatus(3);
      }
    }
  }

  onStopScroll(): void {
    this.is_scrolling = false;
    if (this.scroll_velocity == 0) {
      this.selectClosest();
    }
  }

  selectClosest(): void {
    let closest = this.findNearestButton();
    let delta = closest.y - this.notch_y + this.space / 2;
    for (let i = 0; i < this.boxes.elements.length; i++) {
      let btn = this.boxes.elements[i];
      btn.moveToY(btn.y - delta);
      if (btn !== closest) {
        btn.markDeselected();
      } else {
        btn.is_selected = true;
        btn.setVisualStatus(3);
        this.selected_button_index = i;
        this.left_bar_animation = new Animation(this.left_bar_animation.getValue(), 0, 0.15, AnimationTimingFunction.LINEAR);
      }
    }
  }

  findNearestButton(): BoxButton {
    let closest: BoxButton = this.boxes.elements[0];
    let closest_distance: f64 = -1;
    for (let i = 0; i < this.boxes.elements.length; i++) {
      let btn = this.boxes.elements[i];
      if (closest_distance < 0 || Math.abs(btn.y + this.h - this.notch_y) < closest_distance) {
        closest = btn;
        closest_distance = Math.abs(btn.y - this.notch_y);
      }
    }
    return closest;
  }

  findLowestButton(): BoxButton {
    let lowest: BoxButton = this.boxes.elements[0];
    for (let i = 0; i < this.boxes.elements.length; i++) {
      let btn = this.boxes.elements[i];
      if (lowest.y > btn.y) {
        lowest = btn;
      }
    }
    return lowest;
  }

  findHighestButton(): BoxButton {
    let highest: BoxButton = this.boxes.elements[0];
    for (let i = 0; i < this.boxes.elements.length; i++) {
      let btn = this.boxes.elements[i];
      if (highest.y < btn.y) {
        highest = btn;
      }
    }
    return highest;
  }

  wrapAroundBoxes(): void {
    if (this.boxes.elements.length >= 5) {
      let min_number_either_side = this.boxes.elements.length >= 7 ? 2 : 1;
      let lowest = this.findLowestButton();
      let highest = this.findHighestButton();
      if (this.notch_y - lowest.y < this.space * (min_number_either_side + 1)) {
        highest.immediatelyMoveToYPreservingAnimation(lowest.y - this.space);
      }
      if (highest.y - this.notch_y < this.space * min_number_either_side) {
        lowest.immediatelyMoveToYPreservingAnimation(highest.y + this.space);
      }
    }
  }
}
