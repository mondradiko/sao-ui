@unmanaged declare class UiPanel {
	@external("", "UiPanel_getWidth")
	getWidth(): f32

	@external("", "UiPanel_getHeight")
	getHeight(): f32

	@external("", "UiPanel_setSize")
	setSize(width: f32, height: f32): void

	@external("", "UiPanel_setColor")
	setColor(r: f32, g: f32, b: f32, a: f32): void

	@external("", "UiPanel_drawTriangle")
	drawTriangle(x1: f32, y1: f32, x2: f32, y2: f32, x3: f32, y3: f32, r: f32, g: f32, b: f32, a: f32): void
}

export default UiPanel;

