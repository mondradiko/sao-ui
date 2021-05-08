import Container from "../types/Container";
import NotchedBox from "../elements/NotchedBox";
import RoundButton from "../elements/RoundButton";
import Theme from "../types/Theme";
import UiPanel from "../../codegen/ui/UiPanel";

export default class CharacterInfo {
  state: string = "closed";
  boxes: Container<NotchedBox> = new Container(this.panel);

  constructor(public panel: UiPanel, public character_button: RoundButton) {}

  update(dt: f64): void {
    if (!this.boxes.update(dt)) {
      this.state = "closed";
    }
  }

  onSelect(x: f64, y: f64): void {
    this.boxes.onSelect(x, y);
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

    let x = this.character_button.x - this.character_button.radius * 2.5;
    let y = this.character_button.y;
    let w = 0.2;
    let h = 0.3;

    x -= w;
    y -= h * 0.5;

    let ns = this.character_button.radius * 0.75;
    let nx = x + w + ns;
    let ny = this.character_button.y;

    let character_box = new NotchedBox(this.panel, x, y, w, h, nx, ny, ns, Theme.white);
    character_box.animateIn();
    this.boxes.addElement(character_box);
  }

  close(): void {
    if (this.state == "closed") return;
    this.state = "closing";

    for (let i = 0; i < this.boxes.elements.length; i++) {
      this.boxes.elements[i].close();
    }
  }
}
