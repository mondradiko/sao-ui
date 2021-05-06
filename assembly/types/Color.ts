export default class Color {
  constructor(
    public r: f64,
    public g: f64,
    public b: f64, public a: f64 = 1.0) {}

  static lerp(primary: Color, secondary: Color, x: f64): Color {
    if (x > 1.0) {
      x = 1.0;
    } else if (x < 0.0) {
      x = 0.0;
    }

    let y = 1.0 - x;
    let r = primary.r * y + secondary.r * x;
    let g = primary.g * y + secondary.g * x;
    let b = primary.b * y + secondary.b * x;
    let a = primary.a * y + secondary.a * x;
    return new Color(r, g, b, a);
  }

  clone(): Color {
    return new Color(this.r, this.g, this.b, this.a);
  }
}
