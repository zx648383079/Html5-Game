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
            text  = '恭喜您，获得' + arg + '分！';
            color = '#f00';
        } else {
            text  = '您的得分为' + arg + '，再接再厉吧！';
            color = '#000';
        }
        const lable = new createjs.Text( text, 'bold 30px Courier New',  color);
        lable.y = Configs.height / 2 - 170;
        lable.x = Configs.width / 2 - 300;
        this.addChild(lable);
    }
    
    private _drawBtn(): void {
        const btn = new createjs.Text('START GAME', 'bold 30px Courier New',  '#000');
        btn.x = (Configs.width - 30) / 2 ;
        btn.y = (Configs.height - 60) / 2;
        btn.addEventListener('click', this._click.bind(this));
        this.addChild(btn);
    }
    
    private _click(): void {
        this.navigate(new GameScene());
    }
}