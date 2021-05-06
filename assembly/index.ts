// To compile:
// $ asc -b ui_script.wasm -O3 --exportRuntime ui_script.ts

import Element from "./types/Element";
import NotchedBox from "./elements/NotchedBox";
import Label from "./elements/Label";
import Container from "./types/Container";
import RoundButton from "./elements/RoundButton";
import Theme from "./types/Theme";
import Console from "./menus/Console";
import UiPanel from "../codegen/ui/UiPanel";

import MenuList from "./menus/MenuList";

let main_panel: PanelImpl;

export class PanelImpl extends Element {
  menu_list: MenuList;
  console: Console;

  constructor(panel: UiPanel) {
    super(panel);

    this.menu_list = new MenuList(panel);
    this.console = new Console(panel);

    // this.elements = new Container(panel);

    // this.elements.addElement(new Label(this.panel, "example text", 0.0, -0.2, Theme.primary));

    // this.elements.addElement(new NotchedBox(this.panel, -0.94, -0.4, 0.5, 0.8, Theme.white));

    // this.elements.addElement(new MenuList(panel));
  }

  onHover(x: f64, y: f64): void {}

  onSelect(x: f64, y: f64): void {
    this.menu_list.onSelect(x, y);
  }

  onDrag(x: f64, y: f64): void {}

  onDeselect(x: f64, y: f64): void {}

  handleMessage(message: string): void {
    this.console.print(message);
  }

  update(dt: f64): void {
    // this.elements.update(dt);
    this.menu_list.update(dt);
    this.console.update(dt);

    // this.drawCircleOutline(-0.25, 0, 0.115, 0.003, this.primary);
	  // this.drawCircle(-0.25, 0, 0.1, this.primary);

	  // this.panel.drawTriangle(-0.12, 0, -0.06, 0.035, -0.06, -0.035, Theme.primary.r, Theme.primary.g, Theme.primary.b, Theme.primary.a);
	  // this.drawRect(-0.06, -0.06, 0.5, 0.12, Theme.primary);

	  // this.drawRect(-0.94, -0.4, 0.5, 0.8, this.white);
	  // this.panel.drawTriangle(-0.38, 0, -0.44, 0.035, -0.44, -0.035, this.white.r, this.white.g, this.white.b, this.white.a);
  }
}

export function handleMessage(message: string): void {
  main_panel.handleMessage(message);
}
