import Color from "./Color";
import UiPanel from "./UiPanel";
import Vector2 from "./Vector2";

export default class Element {
  constructor(public panel: UiPanel) {}

  drawCircle(x: f64, y: f64, radius: f64, color: Color): void {
    let center = new Vector2(x, y);
    let last_spoke = new Vector2(radius + x, y);
    let delta: f64 = Math.PI / 16.0;
    let limit: f64 = Math.PI * 2.0 + delta;
    for (let theta = delta; theta < limit; theta += delta) {
      let new_spoke = new Vector2(
        Math.cos(theta) * radius,
        Math.sin(theta) * radius);
      new_spoke.add(center);

      this.panel.drawTriangle(
        x, y,
        last_spoke.x, last_spoke.y,
        new_spoke.x, new_spoke.y,
        color.r, color.g, color.b, color.a);

      last_spoke = new_spoke;
    }
  }

  drawCircleOutline(x: f64, y: f64, radius: f64, thickness: f64, color: Color): void {
    let center = new Vector2(x, y);
    let last_spoke = new Vector2(radius + x, y);
    let delta: f64 = Math.PI / 64.0;
    let limit: f64 = Math.PI * 2.0 + delta;

    let last_theta: f64 = 0;
    for (let theta = delta; theta < limit; theta += delta) {
      let new_spoke = new Vector2(
        Math.cos(theta) * radius,
        Math.sin(theta) * radius);

      let new_spoke2 = new Vector2(
        Math.cos(theta) * (radius + thickness),
        Math.sin(theta) * (radius + thickness));

      let last_spoke2 = new Vector2(
        Math.cos(last_theta) * (radius + thickness),
        Math.sin(last_theta) * (radius + thickness));

      new_spoke.add(center);
      new_spoke2.add(center);
      last_spoke2.add(center);

      this.panel.drawTriangle(
        new_spoke2.x, new_spoke2.y,
        last_spoke.x, last_spoke.y,
        new_spoke.x, new_spoke.y,
        color.r, color.g, color.b, color.a);

      this.panel.drawTriangle(
        new_spoke2.x, new_spoke2.y,
        last_spoke2.x, last_spoke2.y,
        last_spoke.x, last_spoke.y,
        color.r, color.g, color.b, color.a);

      last_spoke = new_spoke;
      last_theta = theta;
    }
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
