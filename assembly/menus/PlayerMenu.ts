import NotchedBox from "../elements/NotchedBox";
import RoundButton from "../elements/RoundButton";
import Element from "../types/Element";
import Theme from "../types/Theme";
import BoxList from "./BoxList";
import UiPanel from "../../codegen/ui/UiPanel";

export default class PlayerMenu extends Element {
  boxes: BoxList;

  state: string = "closed";

  constructor(panel: UiPanel, public character_button: RoundButton) {
    super(panel);
    this.boxes = new BoxList(panel);
  }

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

    let x = this.character_button.x + this.character_button.radius * 2.0;
    let y = this.character_button.y;

    let w = 0.2;
    let h = 0.05;

    y -= h / 2.0;

    let space = h * 1.25;

    let ns = this.character_button.radius * 0.5;  // Notch size
    let nx = x - ns;  // Notch X
    let ny = this.character_button.y;

    for (let i = -1; i < 2; i++) {
      let player_menu = new NotchedBox(this.panel, x, y + i * space, w, h, nx, ny, ns, Theme.primary);
      this.boxes.addElement(player_menu);
    }
  }

  close(): void {
    if (this.state == "closed") return;
    this.state = "closing";

    for (let i = 0; i < this.boxes.elements.length; i++) {
      this.boxes.elements[i].close();
    }
  }
}
