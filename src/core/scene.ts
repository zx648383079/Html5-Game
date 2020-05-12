abstract class Scene {
    protected stage!: createjs.Stage;
    protected application!: Program;
    
    constructor(stage?: createjs.Stage | Program, ...arg: any[]) {
        if (stage == undefined ) {
            return;
        }
        this.setStage(stage);
        this.init(...arg);	
    }
    
    protected init(..._arg: any[]): void {
    }

    public navigating(_before?: Scene, ..._param: any[]) {}

    public navigated(_before?: Scene, ..._param: any[]) {}
    
    public setStage(arg: createjs.Stage  | Program, ...param: any[]): void {
        if (arg instanceof Program) {
            this.stage = arg.getStage();
        }
        this.stage = arg instanceof Program ? arg.getStage() : arg;
        this.init(...param);
    }
    
    protected addEvent(name: string, func: (eventObj: Object) => void ): void {
        this.stage.addEventListener( name , func );
    }
    
    protected addKeyEvent(func: (eventObj: Object) => any): any {
        return window.addEventListener('keydown' , func);
    }
    
    protected addChild(...arg: any[]): void {
        this.stage.addChild(...arg);	
    }
    
    protected removeChild(...arg: any[]): void {
        this.stage.removeChild(...arg);
    }
    
    protected setFPS(
        fps: number = 60,
        mode: string = createjs.Ticker.RAF_SYNCHED): void {
        createjs.Ticker.timingMode = mode;
        createjs.Ticker.framerate = fps;
        createjs.Ticker.addEventListener('tick', this.update.bind(this));
    }
    
    public update(): void {
        this.stage.update();
    }
    
    public close(): void {
        createjs.Ticker.reset();
        this.stage.removeAllChildren();
    }
    
    public navigate(arg: Scene, ...param: any[]) {
        if (this.application) {
            this.application.navigate(arg, this, ...param);
            return;
        }
        this.close();
        arg.setStage(this.stage, ...param);
    }
}