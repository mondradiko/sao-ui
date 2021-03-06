import Color from "../types/Color";
import Element from "../types/Element";
import DynamicElement from "../types/DynamicElement";
import GlyphStyle from "../../codegen/ui/GlyphStyle";
import UiPanel from "../../codegen/ui/UiPanel";

export default class Label extends Element implements DynamicElement {
  w: f64;
  h: f64;

  style: GlyphStyle;

  constructor(panel: UiPanel, public text: string,
              public x: f64, public y: f64,
              public color: Color) {
    super(panel);

    this.style = panel.createGlyphStyle();
    this.style.setText(text);
    this.style.setColor(0.0, 0.0, 0.0, 1.0);
    this.style.setOffset(this.x, this.y);

    this.w = text.length * 0.0375;
    this.h = 0.05;

    this.x -= 0.02;
    this.y -= this.h / 2.0;
  }

  update(dt: f64): bool {
    this.drawRect(this.x, this.y, this.w, this.h, this.color);
    return true;
  }

  onSelect(x: f64, y: f64): void {}
}
