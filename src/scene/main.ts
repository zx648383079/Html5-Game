class MainScene extends Scene {
    public init(): void{
        super.init();
        this._drawBtn();
        this.setFPS(10);
    }
    
    private _drawBtn(): void {
        const btn = new createjs.Text('START GAME', 'bold 30px Courier New',  '#000');
        btn.x = (this.width - 30) / 2 ;
        btn.y = (this.height - 60) / 2;
        btn.textAlign = 'center';
        btn.addEventListener('click', this._click.bind(this));
        this.addChild(btn);
        this.on(EVENT_RESIZE, (width: number, height: number) => {
            btn.x = (width - 30) / 2 ;
            btn.y = (height - 60) / 2;
        });
    }
    
    private _click(): void {
        this.navigate(new GameScene());
    }
}