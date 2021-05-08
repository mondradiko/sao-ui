export default class Animation {

    protected elapsed_time: f64 = 0.0;
    constructor(public initialValue: f64, public targetValue: f64, public duration: f64, public timingFunc: AnimationTimingFunction) { }

    public update(dt: f64): f64 {
        if (this.isFinished()) return this.targetValue;
        this.elapsed_time += dt;
        let percent = Math.min(this.elapsed_time / this.duration, 1);
        if (this.timingFunc == AnimationTimingFunction.EASE_IN) {
            percent = this.easeInExpo(percent);
        } else if (this.timingFunc == AnimationTimingFunction.EASE_OUT) {
            percent = this.easeOutExpo(percent);
        } else if (this.timingFunc == AnimationTimingFunction.EASE_IN_OUT) {
            percent = this.easeInOutExpo(percent);
        }

        let delta = this.targetValue - this.initialValue;
        return (percent * delta) + this.initialValue;
    }

    public getValue(): f64 {
        let percent = Math.min(this.elapsed_time / this.duration, 1);
        if (this.timingFunc == AnimationTimingFunction.EASE_IN) {
            percent = this.easeInExpo(percent);
        } else if (this.timingFunc == AnimationTimingFunction.EASE_OUT) {
            percent = this.easeOutExpo(percent);
        } else if (this.timingFunc == AnimationTimingFunction.EASE_IN_OUT) {
            percent = this.easeInOutExpo(percent);
        }

        let delta = this.targetValue - this.initialValue;
        return (percent * delta) + this.initialValue;
    }

    public isFinished(): bool {
        return this.elapsed_time >= this.duration;
    }

    protected easeOutExpo(x: f64): f64 {
        return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
    }

    protected easeInExpo(x: f64): f64 {
        return x === 0 ? 0 : Math.pow(2, 10 * x - 10);
    }

    protected easeInOutExpo(x: f64): f64 {
        return x === 0
            ? 0
            : x === 1
                ? 1
                : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2
                    : (2 - Math.pow(2, -20 * x + 10)) / 2;

    }

}

export enum AnimationTimingFunction {
    LINEAR, EASE_IN, EASE_OUT, EASE_IN_OUT
}