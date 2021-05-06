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

  onSelect(x: f64, y: f64): void {
    this.buttons.onSelect(x, y);
    this.boxes.onSelect(x, y);
  }
}
