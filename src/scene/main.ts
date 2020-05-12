class MainScene extends Scene {
    public init(): void{
        super.init();
        this._drawBtn();
        this.setFPS(10);
    }
    
    private _drawBtn(): void {
        const btn = new createjs.Text('START GAME', 'bold 30px Courier New',  '#000');
        btn.x = (Configs.width - 30) / 2 ;
        btn.y = (Configs.height - 60) / 2;
        btn.addEventListener('click', this._click.bind(this));
        this.addChild(btn);
    }
    
    private _click(): void {
        this.navigate(new MainScene());
    }
}