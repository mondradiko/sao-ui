export default class Color {
  constructor(
    public r: f64,
    public g: f64,
    public b: f64, public a: f64 = 1.0) {}

  clone(): Color {
    return new Color(this.r, this.g, this.b, this.a);
  }
}
