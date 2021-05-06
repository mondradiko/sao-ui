import Container from "../types/Container";
import NotchedBox from "../elements/NotchedBox";
import Theme from "../types/Theme";
import UiPanel from "../../codegen/ui/UiPanel";

export default class BoxList extends Container<NotchedBox> {
  constructor(panel: UiPanel) { super(panel); }

  /*update(dt: f64): bool {
    return super.update(dt);
  }*/

  /*onSelect(x: f64, y: f64): void {
    super.onSelect(x, y);
  }*/
}
