import Color from "./Color";

export default class Theme {
  static readonly white: Color = new Color(1.0, 1.0, 1.0, 1.0);
  static readonly primary: Color = new Color(1.0, 0.45, 0.0, 1.0);
  static readonly secondary: Color = new Color(0.371, 0.371, 0.371, 1.0);
  static readonly disabled_button: Color = new Color(0.371, 0.371, 0.371, 0.5);
}
