// To compile:
// $ asc -b ui_script.wasm -O3 --exportRuntime ui_script.ts

import Element from "./types/Element";
import NotchedBox from "./elements/NotchedBox";
import Label from "./elements/Label";
import Container from "./types/Container";
import RoundButton from "./elements/RoundButton";
import Theme from "./types/Theme";
import UiPanel from "./types/UiPanel";

import MenuList from "./menus/MenuList";

let main_panel: PanelImpl;

export class PanelImpl extends Element {
  menu_list: MenuList;
  is_showing_menu: bool

  constructor(panel: UiPanel) {
    super(panel);

    this.menu_list = new MenuList(panel);

    panel.setColor(0, 0, 0, 0);
    // this.elements = new Container(panel);

    // this.elements.addElement(new Label(this.panel, "example text", 0.0, -0.2, Theme.primary));

    // this.elements.addElement(new NotchedBox(this.panel, -0.94, -0.4, 0.5, 0.8, Theme.white));

    // this.elements.addElement(new MenuList(panel));
  }

  onHover(x: f64, y: f64): void {}

  mouse_down_x: f64 = -1;
  mouse_down_y: f64 = -1;
  mouse_down_time: f64 = 0;

  scrolling_y: bool = false;

  onSelect(x: f64, y: f64): void {
    this.mouse_down_x = x;
    this.mouse_down_y = y;
    this.mouse_down_time = 0;
  }

  onDrag(x: f64, y: f64): void {
    if (!this.scrolling_y && Math.abs(this.mouse_down_y - y) > 0.02 && this.mouse_down_time > 0.1) {
      this.menu_list.onStartScrollY(this.mouse_down_x, this.mouse_down_y);
      this.menu_list.onScrollY(this.mouse_down_x, this.mouse_down_y);
      this.scrolling_y = true;
    }
    if (this.scrolling_y) {
      this.menu_list.onScrollY(x, y);
    }
    if (this.mouse_down_x - x > 0.2 && this.mouse_down_time < 0.5) {
      this.menu_list.close();
    }
  }

  onDeselect(x: f64, y: f64): void {
    if (this.mouse_down_time < 0.2 &&
      Math.abs(this.mouse_down_x - x) < 0.05 &&
      Math.abs(this.mouse_down_y - y) < 0.05 ) {
      this.menu_list.onSelect(x, y);
    }
    if (this.scrolling_y) {
      this.scrolling_y = false;
      this.menu_list.onStopScrollY();
    }
  }

  update(dt: f64): void {
    this.mouse_down_time += dt;
    // this.elements.update(dt);
    this.menu_list.update(dt);

    // this.drawCircleOutline(-0.25, 0, 0.115, 0.003, this.primary);
	  // this.drawCircle(-0.25, 0, 0.1, this.primary);

	  // this.panel.drawTriangle(-0.12, 0, -0.06, 0.035, -0.06, -0.035, Theme.primary.r, Theme.primary.g, Theme.primary.b, Theme.primary.a);
	  // this.drawRect(-0.06, -0.06, 0.5, 0.12, Theme.primary);

	  // this.drawRect(-0.94, -0.4, 0.5, 0.8, this.white);
	  // this.panel.drawTriangle(-0.38, 0, -0.44, 0.035, -0.44, -0.035, this.white.r, this.white.g, this.white.b, this.white.a);
  }
}

export function bind_panel(panel: UiPanel): PanelImpl {
  return new PanelImpl(panel);
}
