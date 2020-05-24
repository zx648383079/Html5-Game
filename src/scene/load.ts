class LoadScene extends Scene {
    
    protected init(): void {
        super.init();
        this.createSchedule();
        this.loadImages();
        this.setFPS(10);
    }
    /**
     * 进度显示
     */
    private createSchedule() {
        const bar = new createjs.Container();
        const outline = new createjs.Shape(new createjs.Graphics().beginFill('#cccccc').drawRect(0, 0, 300, 10));
        const inline = new createjs.Shape();
        const tip = new createjs.Text('0', 'bold 14px Courier New', '#333');
        tip.textAlign = 'center';
        tip.x = 150;
        tip.y = 20;
        bar.addChild(outline, inline, tip);
        bar.x = this.width / 2 - 150;
        bar.y = this.height * .8;
        this.addChild(bar);
        this.on(EVENT_PROGRESS, (progress: number, label: string) => {
            inline.graphics.clear();
            if (progress > 0) {
                inline.graphics.beginFill('#0172d5').drawRect(0, 0, progress * 300, 10);
            }
            tip.text = label + ': ' + Math.floor(progress * 100) + '%';
        });
    }
    /**
     * 预载图片
     */
    private loadImages() {
        const items = Configs.resources;
        const preload = new createjs.LoadQueue(true);
        preload.on('complete' , () => {
            for (const item of items) {
                Resources.setImage(item.id , preload.getResult(item.id));	
            }
            this.loadSounds();
        });
        preload.on('progress', (e: any) => {
            this.trigger(EVENT_PROGRESS, e.progress, '加载图片');
        });
        preload.loadManifest(Configs.resources);
        preload.getResult();
    }

    /**
     * 预载音频
     */
    private loadSounds() {
        if (!Configs.sounds || Configs.sounds.length < 1) {
            this.complete();
            return;
        }
        createjs.Sound.alternateExtensions = ['mp3'];
        const preload = new createjs.LoadQueue(true);
        preload.installPlugin(createjs.Sound);
        preload.on('complete' , () => {
            this.complete();
        });
        preload.on('progress', (e: any) => {
            this.trigger(EVENT_PROGRESS, e.progress, '加载音频');
        });
        preload.loadManifest(Configs.sounds);
        preload.getResult();
    }

    private complete() {
        this.navigate(new MainScene);
    }
}