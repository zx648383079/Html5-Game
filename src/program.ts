interface ISize {
    width: number,
    height: number
}

class Program {
    private stage: createjs.Stage;
    private scene!: Scene;
    
    constructor(arg: string | HTMLCanvasElement) {
        this.stage = new createjs.Stage(arg);
    }

    
    public get width() : number {
        return (<HTMLCanvasElement>this.stage.canvas).width;
    }
    
    
    public get height() : number {
        return (<HTMLCanvasElement>this.stage.canvas).height;
    }
    
    
    public get size() : ISize {
        return {width: this.width, height: this.height};
    }
    
    
    public setTouch(): void {
        createjs.Touch.enable(this.stage);
    }

    /**
     * stage
     */
    public getStage() {
        return this.stage;
    }
    /**
     * 设置场景尺寸
     * @param width 
     * @param height 
     */
    public setSize(width: number, height: number): void {
        (<HTMLCanvasElement>this.stage.canvas).width = width;
        (<HTMLCanvasElement>this.stage.canvas).height = height;
        if (this.scene) {
            this.scene.resize();
            this.scene.trigger(EVENT_RESIZE, width, height);
        }
    }
    
    public init(): void {
        this.navigate(new LoadScene());
    }

    /**
     * 切换场景
     * @param page 
     * @param before 
     * @param param 
     */
    public navigate(page: Scene, before?: Scene, ...param: any[]): this {
        page.navigating(before, ...param);
        if (before) {
            before.close();
        }
        this.scene = page;
        page.setStage(this, ...param);
		page.navigated(before, ...param);
		return this;
    }
    
    /**
     * update
     */
    public update() {
        this.scene.update();
    }
}