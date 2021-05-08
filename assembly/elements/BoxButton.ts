import Color from "../types/Color";
import Element from "../types/Element";
import DynamicElement from "../types/DynamicElement";
import UiPanel from "../../codegen/ui/UiPanel";
import ColorAnimation from "../types/ColorAnimation";
import Theme from "../types/Theme";
import Animation from "../types/Animation";
import { AnimationTimingFunction } from "../types/Animation";

export default class BoxButton extends Element implements DynamicElement {

    public is_selected: bool = false;
    public is_visible: bool = false;
    private anim_button_status: i8 = 0;
    anim_change_duration: f64 = 0.15;
    anim_circle_color: ColorAnimation = new ColorAnimation(Theme.white, Theme.white, 0, AnimationTimingFunction.LINEAR);
    anim_icon_color: ColorAnimation = new ColorAnimation(Theme.white, Theme.white, 0, AnimationTimingFunction.LINEAR);

    anim_x: Animation;
    anim_y: Animation;

    constructor(panel: UiPanel,
        public x: f64, public y: f64,
        public w: f64, public h: f64) {
        super(panel);
        this.anim_x = new Animation(x, x, 0, AnimationTimingFunction.LINEAR);
        this.anim_y = new Animation(y, y, 0, AnimationTimingFunction.LINEAR);
    }

    update(dt: f64): bool {
        if (!this.is_visible) {
            return false;
        }
        this.anim_circle_color.update(dt);
        this.anim_icon_color.update(dt);

        let box_color = this.anim_circle_color.getCurrentColor();

        this.drawRect(this.anim_x.update(dt), this.anim_y.update(dt), this.w, this.h, box_color);

        if (this.anim_circle_color.getCurrentColor().isEqual(Theme.transparent)) {
            this.is_visible = false;
            return false;
        }

        return true;
    }

    /**
     * 0 = Entering
     * 1 = Disabled
     * 2 = Deselected
     * 3 = Active
     */
    setVisualStatus(status: i8): void {
        this.anim_button_status = status;

        let currentCircleColor: Color = this.anim_circle_color.getCurrentColor();
        let currentIconColor: Color = this.anim_icon_color.getCurrentColor();

        this.anim_circle_color = new ColorAnimation(currentCircleColor, Theme.CIRCLE_COLORS[status], this.anim_change_duration, AnimationTimingFunction.LINEAR);
        this.anim_icon_color = new ColorAnimation(currentIconColor, Theme.ICON_COLORS[status], this.anim_change_duration, AnimationTimingFunction.LINEAR);
    }

    onSelect(x: f64, y: f64): bool {
        if (!this.isInBounds(x, y)) return false;
        this.is_selected = true;
        this.setVisualStatus(3);
        return true;
    }

    markDeselected(): void {
        this.is_selected = false;
        if (this.anim_button_status == 3) {
            this.setVisualStatus(2);
        }
    }

    isInBounds(x: f64, y: f64): bool {
        return x > this.x && x < (this.x + this.w) && y > this.y && y < (this.y + this.h);
    }

    animateIn(): void {
        this.is_visible = true;
    }

    animateOut(): void {
        let x = this.anim_x.getValue();
        this.anim_x = new Animation(x, x - 0.02, this.anim_change_duration, AnimationTimingFunction.LINEAR);
        this.anim_circle_color = new ColorAnimation(this.anim_circle_color.getCurrentColor(), Theme.transparent, this.anim_change_duration, AnimationTimingFunction.LINEAR);
        this.anim_icon_color = new ColorAnimation(this.anim_icon_color.getCurrentColor(), Theme.transparent, this.anim_change_duration, AnimationTimingFunction.LINEAR);
    }
}
