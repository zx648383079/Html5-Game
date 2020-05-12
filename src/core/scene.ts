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

    /**
     * 场景切换之前
     * @param _before 
     * @param _param 
     */
    public navigating(_before?: Scene, ..._param: any[]) {}

    /**
     * 场景切换完成之后
     * @param _before 
     * @param _param 
     */
    public navigated(_before?: Scene, ..._param: any[]) {}
    
    public setStage(arg: createjs.Stage  | Program, ...param: any[]): void {
        if (arg instanceof Program) {
            this.stage = arg.getStage();
        }
        this.stage = arg instanceof Program ? arg.getStage() : arg;
        this.init(...param);
    }
    
    /**
     * 添加事件监听
     * @param name 
     * @param func 
     */
    protected addEvent(name: string, func: (eventObj: Object) => void ): void {
        this.stage.addEventListener(name, func);
    }
    /**
     * 添加键盘输入
     * @param func 
     */
    protected addKeyEvent(func: (eventObj: Object) => any): any {
        return window.addEventListener('keydown', func);
    }
    
    /**
     * 添加物体到场景
     * @param arg 
     */
    protected addChild(...arg: any[]): void {
        this.stage.addChild(...arg);	
    }
    /**
     * 移除物体
     * @param arg 
     */
    protected removeChild(...arg: any[]): void {
        this.stage.removeChild(...arg);
    }
    /**
     * 设置刷新频率
     * @param fps 
     * @param mode 
     */
    protected setFPS(
        fps: number = 60,
        mode: string = createjs.Ticker.RAF_SYNCHED): void {
        createjs.Ticker.timingMode = mode;
        createjs.Ticker.framerate = fps;
        createjs.Ticker.addEventListener('tick', this.update.bind(this));
    }
    /**
     * 更新
     */
    public update(): void {
        this.stage.update();
    }
    
    /**
     * 关闭清理场景
     */
    public close(): void {
        // createjs.Ticker.reset();
        // createjs.Tween._inited = undefined;
        this.stage.removeAllChildren();
    }
    /**
     * 跳转到场景
     * @param arg 
     * @param param 
     */
    public navigate(arg: Scene, ...param: any[]) {
        if (this.application) {
            this.application.navigate(arg, this, ...param);
            return;
        }
        this.close();
        arg.setStage(this.stage, ...param);
    }
}