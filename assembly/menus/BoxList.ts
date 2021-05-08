import Container from "../types/Container";
import UiPanel from "../../codegen/ui/UiPanel";
import BoxButton from "../elements/BoxButton";

export default class BoxList extends Container<BoxButton> {
  constructor(panel: UiPanel) { super(panel); }

  /*update(dt: f64): bool {
    return super.update(dt);
  }*/

  /*onSelect(x: f64, y: f64): void {
    super.onSelect(x, y);
  }*/
}
