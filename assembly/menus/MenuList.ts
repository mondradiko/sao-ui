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

  constructor(panel: UiPanel) {
    super(panel);

    let x = -0.25;
    let top = 0.25;
    let space = -0.1;
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
          this.entering = false;
        } else {
          this.buttons.elements[num_buttons - this.showing_count - 1].animateIn();
          this.showing_count++;
        }
      }
    }
    if (this.showing) {
      this.buttons.update(dt);
      this.boxes.update(dt);

      if (this.character_button.signalled) {
        this.character_button.signalled = false;
        this.character_info.toggle();
        this.player_menu.toggle();
      }

      this.character_info.update(dt);
      this.player_menu.update(dt);
    }
  }

  onSelect(x: f64, y: f64): void {
    if (!this.showing && !this.entering) {
      this.show();
    } else {
      this.buttons.onSelect(x, y);
      this.boxes.onSelect(x, y);
    }
  }

  show(): void {
    this.entering = true;
    this.showing = true;
    this.showing_count = 0;
    this.cumulative_entering_time = 0;
  }
}
