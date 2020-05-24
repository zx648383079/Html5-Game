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
        lable.y = this.height / 2 - 170;
        lable.x = this.width / 2;
        lable.textAlign = 'center';
        this.addChild(lable);
    }
    
    private _drawBtn(): void {
        const btn = new createjs.Text('AGAIN', 'bold 30px Courier New',  '#000');
        btn.x = (this.width - 30) / 2 ;
        btn.y = (this.height - 60) / 2;
        btn.textAlign = 'center';
        btn.addEventListener('click', this._click.bind(this));
        this.addChild(btn);
    }
    
    private _click(): void {
        this.navigate(new GameScene());
    }
}