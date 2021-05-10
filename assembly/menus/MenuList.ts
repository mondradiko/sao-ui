import Container from "../types/Container";
import Element from "../types/Element";
import NotchedBox from "../elements/NotchedBox";
import RoundButton from "../elements/RoundButton";
import Theme from "../types/Theme";
import UiPanel from "../../codegen/ui/UiPanel";
import CharacterInfo from "./CharacterInfo";
import PlayerMenu from "./PlayerMenu";
import TimerCallback from "../types/TimerCallback";
import DynamicElement from "../types/DynamicElement";

export default class MenuList extends Element {
  buttons: Container<RoundButton>;
  boxes: Container<DynamicElement>;
  character_button: RoundButton;

  character_info: CharacterInfo;
  player_menu: PlayerMenu;

  timers: TimerCallback<Element>[] = [];

  entering: bool = false;
  showing: bool = false;
  showing_count: i32 = 0;
  inter_button_entry_delay: f64 = 0.05;
  cumulative_entering_time: f64 = 0;
  inter_button_space: f64 = -0.1;

  selected_button_index: i32 = 0;

  constructor(panel: UiPanel) {
    super(panel);

    let x = -0.25;
    let top = 0.25;
    let space = this.inter_button_space;
    let count = 5;
    let radius = 0.03;

    let buttons = new Array<RoundButton>(count);

    for (let i = 0; i < count; i++) {
      let y = i * space + top;
      let button = new RoundButton(this.panel, x, y, radius);
      buttons[i] = button;
    }

    this.buttons = new Container(panel);
    this.boxes = new Container(panel);
    this.character_button = buttons[0];

    this.character_info = new CharacterInfo(this.panel, this.character_button);
    this.player_menu = new PlayerMenu(this.panel, this.character_button);
    this.boxes.addElement(this.character_info);
    this.boxes.addElement(this.player_menu);

    for (let i = 0; i < buttons.length; i++) {
      this.buttons.addElement(buttons[i]);
    }
  }

  update(dt: f64): void {
    let inProgressTimers: TimerCallback<Element>[] = [];
    for (let timerId = 0; timerId < this.timers.length; timerId++) {
      this.timers[timerId].update(dt);
      if (!this.timers[timerId].isFinished()) {
        inProgressTimers.push(this.timers[timerId]);
      }
    }
    this.timers = inProgressTimers;

    if (this.entering) {
      let time_elapsed = this.cumulative_entering_time + dt;
      this.cumulative_entering_time = time_elapsed;
      let num_to_be_showing = time_elapsed / this.inter_button_entry_delay;
      let num_buttons = this.buttons.elements.length;
      if (num_to_be_showing > this.showing_count) {
        if (this.showing_count == num_buttons) {
          if (this.cumulative_entering_time >= 0.6) {
            this.entering = false;
            this.character_info.open();
            this.player_menu.open();
            for (let i = 0; i < this.buttons.elements.length; i++) {
              this.buttons.elements[i].setVisualStatus(2);
            }
            this.character_button.setVisualStatus(3);
          }
        } else {
          this.buttons.elements[num_buttons - this.showing_count - 1].animate_in_distance = 0.25 + (this.inter_button_space * (num_buttons - this.showing_count)) * -1
          this.buttons.elements[num_buttons - this.showing_count - 1].animateIn();
          this.showing_count++;
        }
      }
    }
    if (this.showing) {
      this.buttons.update(dt);
      this.boxes.update(dt);
    }
  }

  onSelect(x: f64, y: f64): void {
    if (this.showing) {
      if (this.buttons.onSelect(x, y)) {
        let changed_selection = 0;
        for (let i = 0; i < this.buttons.elements.length; i++) {
          let button = this.buttons.elements[i];
          if (!button.isInBounds(x, y)) {
            button.markDeselected();
          } else {
            changed_selection = this.selected_button_index - i;
            this.selected_button_index = i;
          }
        }
        if (changed_selection != 0) {
          for (let i = 0; i < this.buttons.elements.length; i++) {
            let button = this.buttons.elements[i];
            button.moveToY(button.y + changed_selection * this.inter_button_space);
          }
          if (this.character_button.is_selected) {
            this.timers.push(new TimerCallback(0.3, this.character_info, (character_info) => {
              (character_info as CharacterInfo).open();
            }));
            this.timers.push(new TimerCallback(0.3, this.player_menu, (player_menu) => {
              (player_menu as PlayerMenu).open();
            }));
          } else {
            this.character_info.close();
            this.player_menu.close();
          }
        }
      }
      this.boxes.onSelect(x, y);
    }
  }

  displacement_y: f64 = 0;
  scrolling_player_menu: bool = false;
  onScrollY(x: f64, y: f64): void {
    if (!this.showing) {
      if (!this.scrolling_player_menu) {
        this.scrolling_player_menu = true;
        this.displacement_y = y;
      } else {
        let scroll_distance = y - this.displacement_y;
        if (scroll_distance < -0.2) {
          this.scrolling_player_menu = false;
          this.show();
          for (let i = 0; i < this.buttons.elements.length; i++) {
            this.buttons.elements[i].is_selected = false;
          }
          this.character_button.is_selected = true;
        }
      }
    } else {
      if (this.player_menu.isInBounds(x, y)) {
        this.scrolling_player_menu = true;
      }
      if (this.scrolling_player_menu) {
        this.player_menu.onScroll(y);
      }
    }
  }

  onStopScrollY(): void {
    if (this.scrolling_player_menu) {
      this.scrolling_player_menu = false;
      this.player_menu.onStopScroll();
    }
  }

  show(): void {
    this.entering = true;
    this.showing = true;
    this.showing_count = 0;
    this.cumulative_entering_time = 0;
  }
}
