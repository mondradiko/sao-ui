export default interface DynamicElement {
  update(dt: f64): bool;
  onSelect(x: f64, y: f64): bool;
  animateIn(): void;
  isInBounds(x: f64, y: f64): bool;
  // onDeselect(x: f64, y: f64): void;
  // onHover(x: f64, y: f64): void;
  // onDrag(x: f64, y: f64): void;
}
