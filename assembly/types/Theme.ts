import Color from "./Color";

export default class Theme {
  static readonly transparent: Color = new Color(1, 1, 1, 0);
  static readonly white: Color = new Color(1.0, 1.0, 1.0, 1.0);
  static readonly primary: Color = new Color(0.922, 0.651, 0.004, 1.0);
  static readonly secondary: Color = new Color(0.371, 0.371, 0.371, 1.0);
  static readonly disabled_button: Color = new Color(1, 1, 1, 0.3);

  /**
   * 0 = Entering
   * 1 = Disabled
   * 2 = Deselected
   * 3 = Active
   */
  static readonly RING_COLORS: Color[] = [Theme.white, Theme.disabled_button, Theme.disabled_button, Theme.primary];
  static readonly CIRCLE_COLORS: Color[] = [Theme.white, Theme.disabled_button, Theme.disabled_button, Theme.primary];
  static readonly ICON_COLORS: Color[] = [Theme.secondary, Theme.secondary, Theme.secondary, Theme.white];
}
