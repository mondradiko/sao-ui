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

  constructor(panel: UiPanel, public character_button: RoundButton) {
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

    if (!this.boxes.update(dt)) {
      this.state = "closed";
    }

    if (this.state != "closed" && this.selected_button_index == -1) {
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
    } else if (this.selected_button_index != -1) {
      let notch_x = this.character_button.x + this.character_button.radius * (2.5 - 0.75);
      let notch_x2 = this.character_button.x + this.character_button.radius * 2.5 + 0.005;
      this.panel.drawTriangle(notch_x, this.notch_y, notch_x2, this.notch_y + 0.01, notch_x2, this.notch_y - 0.01,
        Theme.primary.r, Theme.primary.g, Theme.primary.b, animation_val);
    }

    if (!this.is_scrolling && this.scroll_velocity != 0) {
      for (let i = 0; i < this.boxes.elements.length; i++) {
        let btn = this.boxes.elements[i];
        btn.immediateMoveToY(btn.y + this.scroll_velocity);
      }
      this.scroll_velocity /= 1.01;
      if (Math.abs(this.scroll_velocity) < 0.03 || Math.abs(this.findNearestButton().y - this.notch_y) > this.space * 2) {
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
    let total_height = this.space * this.boxes.elements.length;
    let top_y = this.notch_y + (this.selected_button_index == -1 ?
      (this.space * this.boxes.elements.length / 2) :
      ((this.boxes.elements.length - this.selected_button_index - 1) * this.space + 0.5 * this.space));
    let box_x = this.character_button.x + this.character_button.radius * 2.5;
    return x >= box_x && x < (box_x + this.w) && y < top_y && y > (top_y - total_height);
  }

  onSelect(x: f64, y: f64): bool {
    if (this.boxes.onSelect(x, y)) {
      let last_selected_index = this.selected_button_index;
      for (let i = 0; i < this.boxes.elements.length; i++) {
        let button = this.boxes.elements[i];
        if (!button.isInBounds(x, y)) {
          button.markDeselected();
        } else {
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

    y -= this.h / 2.0;

    let ns = this.character_button.radius * 0.75;  // Notch size
    let nx = x - ns;  // Notch X
    let ny = this.character_button.y;

    let button_labels: string[] = ["Hi", "Yo", "Sup", "Test", "T2", "X1", "Y2", "Z5", "Logout"];
    let num_buttons = 9;

    let button_index = num_buttons < 3 ? -1 : 0 - Math.floor(num_buttons / 2);
    for (let i = num_buttons - 1; i >= 0; i--) {
      let player_menu = new BoxButton(this.panel, x + 0.005, y + button_index * this.space, this.w, this.h, button_labels[i]);
      this.timers.push(new TimerCallback(i * 0.06, player_menu, (player_menu) => {
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

    this.left_bar_animation = new Animation(1, 0, 0.15, AnimationTimingFunction.LINEAR);
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
    if (!this.is_scrolling) {
      this.scrolling_y = y;
      this.is_scrolling = true;
    }
    let delta = y - this.scrolling_y;
    this.scroll_velocity = delta;
    this.scrolling_y = y;
    for (let i = 0; i < this.boxes.elements.length; i++) {
      let btn = this.boxes.elements[i];
      btn.immediateMoveToY(btn.y + delta);
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
        btn.setVisualStatus(3);
        this.selected_button_index = i;
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
}
