import Color from "../types/Color";
import Element from "../types/Element";
import DynamicElement from "../types/DynamicElement";
import UiPanel from "../../codegen/ui/UiPanel";
import ColorAnimation from "../types/ColorAnimation";
import Theme from "../types/Theme";
import Animation from "../types/Animation";
import { AnimationTimingFunction } from "../types/Animation";
import TimerCallback from "../types/TimerCallback";

export default class BoxButton extends Element implements DynamicElement {

    timers: TimerCallback<Element>[] = [];
    public is_selected: bool = false;
    public is_visible: bool = false;
    private anim_button_status: i8 = 0;
    anim_change_duration: f64 = 0.15;
    anim_circle_color: ColorAnimation = new ColorAnimation(Theme.white, Theme.white, 0, AnimationTimingFunction.LINEAR);
    anim_icon_color: ColorAnimation = new ColorAnimation(Theme.white, Theme.white, 0, AnimationTimingFunction.LINEAR);
    opacity: f64 = 1;

    anim_x: Animation;
    anim_y: Animation;
    display_y: f64 = 0;

    temp_potential_colors: Color[] = [new Color(1, 0, 0, 1), new Color(1, 1, 0, 1), new Color(1, 0, 1, 1), new Color(0, 1, 0, 1), new Color(0, 1, 1, 1), new Color(0, 0, 1, 1)];

    constructor(panel: UiPanel,
        public x: f64, public y: f64,
        public w: f64, public h: f64,
        public label: string) {
        super(panel);
        this.anim_x = new Animation(x, x, 0, AnimationTimingFunction.LINEAR);
        this.anim_y = new Animation(y, y, 0, AnimationTimingFunction.LINEAR);
    }

    update(dt: f64): bool {
        this.anim_circle_color.update(dt);
        this.anim_icon_color.update(dt);

        let inProgressTimers: TimerCallback<Element>[] = [];
        for (let timerId = 0; timerId < this.timers.length; timerId++) {
            this.timers[timerId].update(dt);
            if (!this.timers[timerId].isFinished()) {
                inProgressTimers.push(this.timers[timerId]);
            }
        }
        this.timers = inProgressTimers;

        if (this.is_visible) {
            let box_color = this.anim_circle_color.getCurrentColor();
            box_color.a *= this.opacity;
            this.display_y = this.anim_y.update(dt);
            this.drawRect(this.anim_x.update(dt), this.display_y, this.w, this.h, box_color);

            let icon_opacity = this.anim_icon_color.getCurrentColor().a * this.opacity;

            //Temporarily while fonts are being worked on

            let q = this.h / 3;
            let x = this.anim_x.getValue() + q;
            let y = this.anim_y.getValue() + q;
            for (let i = 0; i < this.label.length; i++) {
                this.drawPretendLetter(this.label.charCodeAt(i), x, y, q, icon_opacity);
                x += this.h / 2;
            }
        }

        if (this.anim_circle_color.getCurrentColor().isEqual(Theme.transparent)) {
            this.is_visible = false;
            return false;
        }

        return true;
    }

    drawPretendLetter(charCode: i32, x: f64, y: f64, q: f64, alpha: f64): void {
        let col1: Color = this.temp_potential_colors[charCode % this.temp_potential_colors.length];
        let col2: Color = this.temp_potential_colors[(charCode + 1) % this.temp_potential_colors.length];
        this.panel.drawTriangle(x, y, x + q, y + q, x, y + q, col1.r, col1.g, col1.b, alpha);
        this.panel.drawTriangle(x, y, x + q, y + q, x + q, y, col2.r, col2.g, col2.b, alpha);
    }

    moveToY(target_y: f64): void {
        this.y = target_y;
        this.anim_y = new Animation(this.anim_y.getValue(), target_y, 0.3, AnimationTimingFunction.EASE_IN_OUT);
    }

    immediateMoveToY(target_y: f64): void {
        this.y = target_y;
        this.display_y = target_y;
        this.anim_y = new Animation(target_y, target_y, 0, AnimationTimingFunction.LINEAR);
    }

    immediatelyMoveToYPreservingAnimation(position_y: f64): void {
        let relative_y = position_y - this.y;
        this.y = position_y;
        this.display_y += relative_y;
        this.anim_y.targetValue = this.anim_y.targetValue + relative_y;
        this.anim_y.initialValue = this.anim_y.initialValue + relative_y;
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
        this.setVisualStatus(2);
    }

    isInBounds(x: f64, y: f64): bool {
        return x > this.x && x < (this.x + this.w) && y > this.y && y < (this.y + this.h);
    }

    animateIn(): void {
        this.anim_circle_color = new ColorAnimation(Theme.transparent, this.anim_circle_color.getCurrentColor(), this.anim_change_duration, AnimationTimingFunction.LINEAR);
        this.anim_icon_color = new ColorAnimation(Theme.transparent, this.anim_icon_color.getCurrentColor(), this.anim_change_duration, AnimationTimingFunction.LINEAR);
        this.anim_y = new Animation(this.y - 0.03, this.y, this.anim_change_duration, AnimationTimingFunction.EASE_OUT);
        this.is_visible = true;
    }

    animateOut(): void {
        let x = this.anim_x.getValue();
        this.anim_x = new Animation(x, x - 0.02, this.anim_change_duration, AnimationTimingFunction.LINEAR);
        this.anim_circle_color = new ColorAnimation(this.anim_circle_color.getCurrentColor(), Theme.transparent, this.anim_change_duration, AnimationTimingFunction.LINEAR);
        this.anim_icon_color = new ColorAnimation(this.anim_icon_color.getCurrentColor(), Theme.transparent, this.anim_change_duration, AnimationTimingFunction.LINEAR);
    }
}
