class EndScene extends Scene {
    protected init(...args: any[]): void {
        super.init();
        this._drawScore.call(this, ...args);
        this._drawBtn();
        this.setFPS(10);
    }
    
    private _drawScore(arg: number = 0, success: boolean = false, ..._args: any[]): void {
        let text: string,
            color: string;
        if (success) {
            text  = '恭喜您，在经历' + arg + '步后终于围住了那只神经猫！';
            color = '#f00';
        } else {
            text  = '经过' + arg + '步后还是被那只神经猫逃脱了，再接再厉吧！';
            color = '#000';
        }
        const lable = new createjs.Text( text, 'bold 30px Courier New',  color);
        lable.y = Configs.height / 2 - 170;
        lable.x = Configs.width / 2 - 300;
        this.addChild(lable);
    }
    
    private _drawBtn(): void {
        const img = Resources.getImage(PLAY_IMG);
        const btn = new createjs.Shape(new createjs.Graphics().beginBitmapFill(img).drawRect(0, 0, img.width, img.height));
        btn.x = (Configs.width - img.width) / 2 ;
        btn.y = (Configs.height - img.height) / 2;
        btn.addEventListener('click', this._click.bind(this));
        this.addChild(btn);
    }
    
    private _click(): void {
        this.navigate(new GameScene());
    }
}