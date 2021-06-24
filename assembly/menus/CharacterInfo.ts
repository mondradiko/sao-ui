import Container from "../types/Container";
import NotchedBox from "../elements/NotchedBox";
import RoundButton from "../elements/RoundButton";
import Theme from "../types/Theme";
import UiPanel from "../types/UiPanel";
import Element from "../types/Element";
import DynamicElement from "../types/DynamicElement";

export default class CharacterInfo extends Element implements DynamicElement {
  state: string = "closed";
  boxes: Container<NotchedBox> = new Container(this.panel);

  w: f64 = 0.2;

  constructor(panel: UiPanel, public character_button: RoundButton) {
    super(panel);
  }

  update(dt: f64): bool {
    if (!this.boxes.update(dt)) {
      this.state = "closed";
    }
    return true;
  }

  onSelect(x: f64, y: f64): bool {
    return this.boxes.onSelect(x, y);
  }

  animateIn(): void {
    this.open();
  }
  isInBounds(x: number, y: number): bool {
    return this.boxes.isInBounds(x, y);
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
    let h = 0.3;

    x -= this.w;
    y -= h * 0.5;

    let ns = this.character_button.radius * 0.75;
    let nx = x + this.w + ns;
    let ny = this.character_button.y;

    let character_box = new NotchedBox(this.panel, x, y, this.w, h, nx, ny, ns, Theme.white);
    this.boxes.addElement(character_box);
    character_box.animateIn();
  }

  close(): void {
    if (this.state == "closed") return;
    this.state = "closing";

    for (let i = 0; i < this.boxes.elements.length; i++) {
      this.boxes.elements[i].close();
    }
  }
}
