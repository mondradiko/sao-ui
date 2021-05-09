import Color from "./Color";
import UiPanel from "../../codegen/ui/UiPanel";

export default class Element {
  constructor(public panel: UiPanel) {}

  drawCircle(x: f64, y: f64, radius: f64, color: Color): void {
    this.panel.drawCircle(x, y, radius, color.r, color.g, color.b, color.a);
    return;
  }

  drawCircleOutline(x: f64, y: f64, radius: f64, thickness: f64, color: Color): void {
    let half_thickness = thickness / 2.0;
    let inner_radius = radius - half_thickness;
    let outer_radius = radius + half_thickness;
    this.panel.drawRing(x, y, inner_radius, outer_radius, color.r, color.g, color.b, color.a);
    return;
  }

  drawRect(x: f64, y: f64, w: f64, h: f64, color: Color): void {
     let l = x;
     let t = y;
     let r = l + w;
     let b = t + h;
     let c = color;

     this.panel.drawTriangle(l, t, l, b, r, t, c.r, c.g, c.b, c.a);
     this.panel.drawTriangle(r, t, l, b, r, b, c.r, c.g, c.b, c.a);
  }
}
