import NotchedBox from "../elements/NotchedBox";
import RoundButton from "../elements/RoundButton";
import Element from "../types/Element";
import Theme from "../types/Theme";
import BoxList from "./BoxList";
import UiPanel from "../../codegen/ui/UiPanel";
import BoxButton from "../elements/BoxButton";
import DynamicElement from "../types/DynamicElement";

export default class PlayerMenu extends Element implements DynamicElement {
  boxes: BoxList;

  state: string = "closed";
  selected_button_index: i32 = -1;

  constructor(panel: UiPanel, public character_button: RoundButton) {
    super(panel);
    this.boxes = new BoxList(panel);
  }

  update(dt: f64): bool {
    if (!this.boxes.update(dt)) {
      this.state = "closed";
    }
    return true;
  }

  animateIn(): void {
    this.open();
  }
  isInBounds(x: number, y: number): bool {
    return this.boxes.isInBounds(x, y);
  }

  onSelect(x: f64, y: f64): bool {
    if (this.boxes.onSelect(x, y)) {
      for (let i = 0; i < this.boxes.elements.length; i++) {
        let button = this.boxes.elements[i];
        if (!button.isInBounds(x, y)) {
          button.markDeselected();
        } else {
          this.selected_button_index = i;
        }
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
    let h = 0.05;

    y -= h / 2.0;

    let space = h + 0.01;

    let ns = this.character_button.radius * 0.75;  // Notch size
    let nx = x - ns;  // Notch X
    let ny = this.character_button.y;

    for (let i = -1; i < 2; i++) {
      let player_menu = new BoxButton(this.panel, x, y + i * space, w, h);
      this.boxes.addElement(player_menu);
    }
    
    this.boxes.animateIn();
  }

  close(): void {
    if (this.state == "closed") return;
    this.state = "closing";

    for (let i = 0; i < this.boxes.elements.length; i++) {
      this.boxes.elements[i].animateOut();
    }
  }
}
