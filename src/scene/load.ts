class LoadScene extends Scene {
    private _lable!: createjs.Text;
    private _rect!: createjs.Shape;
    private _index!: number;
    private _loader!: createjs.LoadQueue;
    
    protected init(): void {
        super.init();
        this._index = 0;
        this._images();
        this.setFPS(10);
    }
    
    private _setSchedule(num: number = 0): void {
        if(this._lable === undefined) {
            this._lable = new createjs.Text(num.toString(), 'bold 14px Courier New', '#000000');
            this._lable.y = 10;
            this._rect = new createjs.Shape(new createjs.Graphics().beginFill('#ffffff').drawRect(0, 0, 400, 30));
            this.addChild( this._rect, this._lable );
        }
        
        this._lable.text = this._index.toString();
        this._rect.graphics.beginFill('#ff0000').drawRect(0, 0 , this._index * 10 , 30);
    }
    
    private _images(): void {
        this._loader = new createjs.LoadQueue(true);
        this._loader.addEventListener('complete' , this._complete.bind(this));
        this._loader.addEventListener('fileload', this._fileLoad.bind(this));
        this._loader.loadManifest(Configs.resources);
        this._loader.getResult()
    }

    private _sounds(): void {
        createjs.Sound.alternateExtensions = ["mp3"];
        var preload = new createjs.LoadQueue(true);
        preload.installPlugin( createjs.Sound );
        preload.loadManifest( Configs.sounds );
    }
    
    private _fileLoad(): void {
        this._setSchedule( this._index ++ );
    }
    
    private _complete(): void {
        for (var i = 0, len = Configs.resources.length; i < len; i++) {
            var image = Configs.resources[i];
            if(image.id == "model") {
                Resources.models = <any[]>this._loader.getResult(image.id);
            }else{
                Resources.setImage( image.id , this._loader.getResult(image.id) );					
            }
        }
        
        this.navigate(new MainScene());
    }
}