declare function UiPanel_getWidth(self: UiPanel): f32
declare function UiPanel_getHeight(self: UiPanel): f32
declare function UiPanel_setSize(self: UiPanel, width: f32, height: f32): void
declare function UiPanel_setColor(self: UiPanel, r: f32, g: f32, b: f32, a: f32): void
declare function UiPanel_drawTriangle(self: UiPanel, x1: f32, y1: f32, x2: f32, y2: f32, x3: f32, y3: f32, r: f32, g: f32, b: f32, a: f32): void

@unmanaged class UiPanel {
	getWidth(): f32 {
		return UiPanel_getWidth(this);
	}

	getHeight(): f32 {
		return UiPanel_getHeight(this);
	}

	setSize(width: f32, height: f32): void {
		UiPanel_setSize(this, width, height);
	}

	setColor(r: f32, g: f32, b: f32, a: f32): void {
		UiPanel_setColor(this, r, g, b, a);
	}

	drawTriangle(x1: f64, y1: f64,
							 x2: f64, y2: f64,
							 x3: f64, y3: f64,
							 r: f64, g: f64, b: f64, a: f64): void {
	  UiPanel_drawTriangle(this, x1 as f32, y1 as f32,
												 x2 as f32, y2 as f32,
												 x3 as f32, y3 as f32,
												 r as f32, g as f32, b as f32, a as f32);
  }
}

export default UiPanel;

