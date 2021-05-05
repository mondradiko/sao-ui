import Container from "../types/Container";
import Element from "../types/Element";
import NotchedBox from "../elements/NotchedBox";
import RoundButton from "../elements/RoundButton";
import Theme from "../types/Theme";
import UiPanel from "../../codegen/ui/UiPanel";

export default class MenuList extends Element {
  buttons: Container<RoundButton>;
  boxes: Container<NotchedBox>;
  character_button: RoundButton;

  constructor(panel: UiPanel) {
    super(panel);

    let x = -0.25;
    let top = 0.25;
    let space = -0.1;
    let count = 5;
    let radius = 0.03;
    let color = Theme.primary;

    let buttons = new Array<RoundButton>(count);

    for (let i = 0; i < count; i++) {
      let y = i * space + top;
      let button = new RoundButton(this.panel, x, y, radius, color);
      buttons[i] = button;
    }

    this.buttons = new Container(panel);
    this.boxes = new Container(panel);
    this.character_button = buttons[0];

    for (let i = 0; i < buttons.length; i++) {
      this.buttons.addElement(buttons[i]);
    }
  }

  update(dt: f64): void {
    this.buttons.update(dt);
    this.boxes.update(dt);

    if (this.character_button.signalled) {
      this.character_button.signalled = false;
      this.openCharacterBox();
    }
  }

  onSelect(x: f64, y: f64): void {
    this.buttons.onSelect(x, y);
    this.boxes.onSelect(x, y);
  }

  openCharacterBox(): void {
    let x = this.character_button.x;
    let y = this.character_button.y;
    let w = 0.5;
    let h = 0.8;

    x -= w;

    let character_box = new NotchedBox(this.panel, x, y, w, h, Theme.white);
    this.boxes.addElement(character_box);
  }
}
