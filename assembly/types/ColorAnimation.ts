import Animation from "./Animation";
import {AnimationTimingFunction} from "./Animation";
import Color from "./Color";

export default class ColorAnimation extends Animation {

    private initialColor: Color;
    private targetColor: Color;
    private currentPercent: f64;

    constructor(initialValue: Color, targetValue: Color, duration: f64, timingFunc: AnimationTimingFunction) {
        super(0, 1, duration, timingFunc);
        this.initialColor = initialValue;
        this.targetColor = targetValue;
    }

    public update(dt: f64): f64 {
        this.currentPercent = super.update(dt);
        return this.currentPercent;
    }

    public getCurrentColor(): Color {
        return Color.lerp(this.initialColor, this.targetColor, this.currentPercent);
    }

}