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

      for (let i: f64 = 0.0; i < 100.0; i+=1) {
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
    return true;
  }

  protected easeInExpo(x: f64): f64 {
    return x === 0 ? 0 : Math.pow(1.6, 10 * x - 10);
}

  animateIn(): void {
    this.open();
  }
  isInBounds(x: number, y: number): bool {
    return this.boxes.isInBounds(x, y);
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
      let move_y = (this.selected_button_index - last_selected_index) * this.space;
      if (last_selected_index == -1) {
        move_y = (this.selected_button_index - Math.floor(this.boxes.elements.length / 2)) * this.space;
      }
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

    let w = 0.2;

    y -= this.h / 2.0;

    let ns = this.character_button.radius * 0.75;  // Notch size
    let nx = x - ns;  // Notch X
    let ny = this.character_button.y;

    let button_labels: string[] = ["Hi", "Yo", "Sup", "Test", "T2", "X1", "Y2", "Z5", "Logout"];
    let num_buttons = 9;

    let button_index = num_buttons < 3 ? -1 : 0 - Math.floor(num_buttons / 2);
    for (let i = num_buttons - 1; i >= 0; i--) {
      let player_menu = new BoxButton(this.panel, x + 0.005, y + button_index * this.space, w, this.h, button_labels[i]);
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
}
