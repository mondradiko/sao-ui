export default class TimerCallback<T> {

    protected elapsed_time: f64 = 0.0;
    protected has_called: bool = false;

    constructor(public duration: f64, public param: T, public callBack: (something: T) => void) { }

    public update(dt: f64): void {
        this.elapsed_time += dt;

        if (!this.has_called && this.elapsed_time >= this.duration) {
            this.callBack(this.param);
            this.has_called = true;
        }
    }

    public isFinished(): bool {
        return this.elapsed_time >= this.duration;
    }

}