import GlyphStyle from "../../codegen/ui/GlyphStyle";
import DynamicElement from "../types/DynamicElement";
import UiPanel from "../../codegen/ui/UiPanel";

class QueuedMessage implements DynamicElement {
  lifespan: f64 = 5.0;
  fade_duration: f64 = 0.25;

  max_height: f64 = 0.05;
  height: f64 = this.max_height;

  constructor(public text: string, public style: GlyphStyle, public offset_x: f64, offset_y: f64) {
    this.style.setColor(1.0, 1.0, 1.0, 1.0);
    this.style.setText(this.text);
    this.setOffset(offset_y);
  }

  update(dt: f64): bool {
    this.lifespan -= dt;

    if (this.lifespan < this.fade_duration) {
      let alpha: f64 = this.lifespan / this.fade_duration;
      this.style.setColor(1.0, 1.0, 1.0, alpha);
      this.height = this.lifespan * this.max_height / this.fade_duration;
    }

    return this.lifespan > 0.0;
  }

  onSelect(x: f64, y: f64): bool {
    return false;
  }

  isInBounds(x: f64, y: f64): bool {
    return false;
  }

  setOffset(offset_y: f64): void {
    this.style.setOffset(this.offset_x, offset_y);
  }

  animateIn(): void {
    //TODO
  }
}

export default class Console {
  style_pool: Array<GlyphStyle> = [];
  log_bottom: f64 = -0.45;
  last_message: f64 = 0.0;
  elements: Array<QueuedMessage> = [];

  constructor(public panel: UiPanel) {}

  update(dt: f64): bool {
    this.last_message -= dt;
    this.log_bottom = -0.45;
    
    let i: i32 = 0;

    while (i < this.elements.length) {
      let message = this.elements[i];

      if (message.update(dt)) {
        this.log_bottom += message.height;
        message.setOffset(this.log_bottom);
        i++;
      } else {
        message.style.setText("");
        this.style_pool.push(message.style);
        this.elements.splice(i, 1);
      }
    }

    return i > 0;
  }

  print(message: string): void {
    let style: GlyphStyle;

    if (this.style_pool.length > 0) {
      style = this.style_pool.pop();
    } else {
      style = this.panel.createGlyphStyle();
    }

    let offset_x = -0.45 * this.panel.getWidth();

    let new_message = new QueuedMessage(message, style, offset_x, this.log_bottom);
    this.elements.push(new_message);
    this.log_bottom += new_message.height;

    this.last_message += 0.5;
    if (this.last_message > 0.0) {
      if (this.last_message > 5.0) {
        this.last_message = 5.0;
      }

      new_message.lifespan += this.last_message;
    }
  }
}
