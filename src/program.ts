class Program {
    private stage: createjs.Stage;
    private scene!: Scene;
    
    constructor(arg: string | HTMLCanvasElement) {
        this.stage = new createjs.Stage(arg);
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
    
    public setSize(width: number, height: number): void {
        (<HTMLCanvasElement>this.stage.canvas).width = width;
        (<HTMLCanvasElement>this.stage.canvas).height = height;
    }
    
    public init(): void {
        this.navigate(new LoadScene());
    }

    public navigate(page: Scene, before?: Scene, ...param: any[]): this {
        page.navigating(before, ...param);
        if (before) {
            before.close();
        }
        page.setStage(this, ...param);
        this.scene = page;
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