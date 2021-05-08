export default class Animation {

    private elapsed_time: f64 = 0.0;
    constructor(public initialValue: f64, public targetValue: f64, public duration: f64, public timingFunc: AnimationTimingFunction) {}

    public update(dt: f64): f64 {
        if (this.isFinished()) return this.targetValue;
        this.elapsed_time += dt;
        let percent = Math.min(this.elapsed_time / this.duration, 1);
        if (this.timingFunc == AnimationTimingFunction.EASE_IN) {
            percent = this.easeInExpo(percent);
        } else if (this.timingFunc == AnimationTimingFunction.EASE_OUT) {
            percent = this.easeOutExpo(percent);
        }

        let delta = this.targetValue - this.initialValue;
        return (percent * delta) + this.initialValue;
    }

    public isFinished(): bool {
        return this.elapsed_time >= this.duration;
    }

    private easeOutExpo(x: f64): f64 {
        return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
    }

    private easeInExpo(x: f64): f64 {
        return x === 0 ? 0 : Math.pow(2, 10 * x - 10);
    }

}

export enum AnimationTimingFunction {
    LINEAR, EASE_IN, EASE_OUT
}