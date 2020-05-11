class MainScene extends Scene {
    public init(): void{
        super.init();
        this._drawBtn();
        this.setFPS(10);
    }
    
    private _drawBtn(): void {
        const img = Resources.getImage(PLAY_IMG);
        if (!img) {
            throw 'img load failure';
        }
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