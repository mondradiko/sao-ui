import Container from "../types/Container";
import Element from "../types/Element";
import NotchedBox from "../elements/NotchedBox";
import RoundButton from "../elements/RoundButton";
import Theme from "../types/Theme";
import UiPanel from "../../codegen/ui/UiPanel";
import CharacterInfo from "./CharacterInfo";
import PlayerMenu from "./PlayerMenu";

export default class MenuList extends Element {
  buttons: Container<RoundButton>;
  boxes: Container<NotchedBox>;
  character_button: RoundButton;

  character_info: CharacterInfo;
  player_menu: PlayerMenu;

  entering: bool = false;
  showing: bool = false;
  showing_count: i32 = 0;
  inter_button_entry_delay: f64 = 0.05;
  cumulative_entering_time: f64 = 0;
  inter_button_space: f64 = -0.1;

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

    for (let i = 0; i < buttons.length; i++) {
      this.buttons.addElement(buttons[i]);
    }
  }

  update(dt: f64): void {
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

      this.character_info.update(dt);
      this.player_menu.update(dt);
    }
  }

  onSelect(x: f64, y: f64): void {
    if (!this.showing && !this.entering) {
      this.show();
      for (let i = 0; i < this.buttons.elements.length; i++) {
        this.buttons.elements[i].is_selected = false;
      }
      this.character_button.is_selected = true;
    } else {
      let was_selected = this.character_button.is_selected;
      if (this.buttons.onSelect(x, y)) {
        for (let i = 0; i < this.buttons.elements.length; i++) {
          let button = this.buttons.elements[i];
          if (!button.isInBounds(x, y)) {
            button.markDeselected();
          }
        }
      }
      this.boxes.onSelect(x, y);

      if (this.character_button.is_selected != was_selected) {
        if (this.character_button.is_selected) {
          this.character_info.open();
          this.player_menu.open();
        } else {
          this.character_info.close();
          this.player_menu.close();
        }
      }
    }
  }

  show(): void {
    this.entering = true;
    this.showing = true;
    this.showing_count = 0;
    this.cumulative_entering_time = 0;
  }
}
