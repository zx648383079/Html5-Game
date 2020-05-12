interface IBoomRange {
    boom: createjs.Shape,
    rotation: number
}

class GameScene extends Scene {

    /**
     * 第几关
     */
    private levelBox!: createjs.Container;
    /**
     * 飞镖剩余数量
     */
    private amountBox!: createjs.Container;
    /**
     * 分数
     */
    private scoreBox!: createjs.Container;

    private targetBox!: createjs.Container;

    private targetBooms: IBoomRange[] = [];

    private boom!: createjs.Shape;

    /**
     * 旋转速度
     */
    private rotationSpeed: number = 1;

    private isShooting: boolean = false;

    private changeTime: number = 120;

    private _level: number = 1;

    public get level() : number {
        return this._level;
    }
    

    public set level(v : number) {
        this._level = v;
        this.trigger(EVENT_LEVEL);
    }
    
    private _amount: number = 9;

    public get amount() : number {
        return this._amount;
    }
    
    public set amount(v : number) {
        this._amount = v;
        this.trigger(EVENT_AMOUNT);
    }
    

    private _score: number = 0;

    public get score() : number {
        return this._score;
    }
    
    public set score(v : number) {
        this._score = v;
        this.trigger(EVENT_SCORE);
    }
    
    /**
     * 触发事件
     */
    private events: any = {};

    protected init(): void {
        super.init();
        this.createAmount();
        this.createLevel();
        this.createScore();
        this.createBoom();
        this.createTarget();
        this.setFPS();
    }

    public update() {
        this.targetBox.rotation += this.rotationSpeed;
        this.randomSpeed();
        super.update();
    }

    /**
     * 随机调整方向 
     */
    private randomSpeed() {
        this.changeTime --;
        if (this.changeTime > 0) {
            return;
        }
        this.changeTime = Math.max(200 - this.level * 5, 30) + Math.floor(Math.random() * 50);
        if (this.level < 3) {
            return;
        }
        this.rotationSpeed *= -1;
    }

    /**
     * 过关动画
     */
    private passLevel() {

        this.nextLevel();
    }

    /**
     * 下一关
     */
    private nextLevel() {
        this.level ++;
        this.amount = Math.max(1, 9 + Math.floor(this.level / 10 - 1));
        this.rotationSpeed = this.level % 3 === 0 && Math.random() < 0.1 ? this.rotationSpeed * -1 : this.rotationSpeed;
        for (const item of this.targetBooms) {
            this.targetBox.removeChild(item.boom);
        }
        this.targetBooms = [];
        const random = Math.floor(Math.random() * this.level)
        if (random >= this.level / 2) {
            this.amount -= Math.floor(Math.random() * this.level / 2 + 1)
        }
        for (let i = 1; i < random; i++) {
            let r = Math.floor(Math.random() * 180)
            r = Math.random() < .5 ? r * -1 : r
            this.trigger(EVENT_BOOM_HIT, r);
        }
        this.trigger(EVENT_BOOM_RESET);
    }

    /**
     * 射击
     */
    private shoot() {
        if (this.isShooting || this.amount < 1) {
            return;
        }
        this.isShooting = true;
        this.amount --;
        createjs.Tween.get(this.boom)
            .to({
                y: 350
            }, 150, createjs.Ease.cubicIn)
            .call(() => {
                let rotation = this.targetBox.rotation % 360;
                if (rotation < 0) {
                    rotation = 360 + rotation;
                }
                if (this.hasBoom(rotation)) {
                    this.flickBoom();
                    return;
                }
                this.woodBits();
                const x = this.targetBox.x
                const y = this.targetBox.y
                createjs.Tween.get(this.targetBox)
                    .to({ x: x - 6, y: y - 7 }, 20, createjs.Ease.bounceInOut)
                    .to({ x, y}, 20, createjs.Ease.bounceInOut)
                    .call(() => {
                        if (this.amount < 1) {
                            // 下一关
                            this.passLevel();
                            return;
                        }
                        this.trigger(EVENT_BOOM_RESET);
                    })
                this.boom.alpha = 0;
                this.trigger(EVENT_BOOM_HIT, rotation);
                this.score ++;
            });
    }

    /**
     * 击飞飞镖
     */
    private flickBoom() {
        createjs.Tween.get(this.boom)
            .to({ x: Configs.width + 100, y: Configs.height + 100, rotation: 720 }, 700, createjs.Ease.bounceOut)
            .call(() => {
                this.navigate(new EndScene(), this.score);
            });
    }

    /**
     * 判断这个角度是否有飞镖
     * @param rotation 
     */
    private hasBoom(rotation: number): boolean {
        for (const item of this.targetBooms) {
            const diff = Math.abs(rotation - item.rotation);
            if (diff < 10 || diff > 350) {
                return true;
            }
        }
        return false;
    }

    /**
     * 木屑
     */
    private woodBits() {
        const img = Resources.getImage(BITS_OF_WOOD_IMG);
        const bit = new createjs.Shape(new createjs.Graphics().beginBitmapFill(img).drawRect(0, 0, img.width, img.height));
        const scale = 5 / img.width;
        bit.scaleX = bit.scaleY = scale;
        const maxWidth = Configs.width;
        const maxHeight = Configs.height;
        bit.x = maxWidth / 2 - 1;
        bit.y = 250;
        for (let i = 0; i < 4; i++) {
            const bitNew = bit.clone();
            this.addChild(bitNew)
            let random = Math.floor(Math.random() * maxWidth * 2)
            random = Math.random() < .5 ? random * -1 : random
            createjs.Tween.get(bitNew)
                .to({ x: random, y: maxHeight }, 500, createjs.Ease.sineOut)
                .call(() => {
                    this.removeChild(bitNew)
                })
        }
    }

    /**
     * 创建靶子
     */
    private createTarget() {
        const bgImg = Resources.getImage(TARGET_IMG);
        const img = Resources.getImage(BOOMERANG_IMG);
        const bg = new createjs.Shape(new createjs.Graphics().beginBitmapFill(bgImg).drawRect(0, 0, bgImg.width, bgImg.height));
        const height = 200, scale = height / bgImg.height;
        const boomOut = 50; // 飞镖露出部分
        //const boomIn = 50; // 飞镖插入部分
        bg.y = bg.x = boomOut;
        bg.scaleX = bg.scaleY = scale;
        this.targetBox = new createjs.Container();
        this.targetBox.addChild(bg);
        this.targetBox.y = 250;
        this.targetBox.regX = 150;
        this.targetBox.regY = 150;
        this.targetBox.x = Configs.width / 2;
        this.addChild(this.targetBox);
        this.targetBox.setChildIndex(bg, 100);

        const boomHeight = 100, boomScale = boomHeight / img.height;
        const minWidth = boomScale * img.width;
        const boom = new createjs.Shape(new createjs.Graphics().beginBitmapFill(img).drawRect(0, 0, img.width, img.height));
        boom.scaleX = boom.scaleY = boomScale;
        boom.regY = 0;
        boom.regX = minWidth + 5;
        boom.y = 200;
        boom.x = 150;
        this.on(EVENT_BOOM_HIT, (rotation: number) => {
            const boomNew = boom.clone();
            const deg = -rotation * Math.PI / 180;
            boomNew.x = 150 - 50 * Math.sin(deg);
            boomNew.y = 150 + 50 * Math.cos(deg);
            boomNew.rotation = -rotation;
            this.targetBox.addChild(boomNew)
            this.targetBooms.push({boom: boomNew, rotation});
            this.targetBox.setChildIndex(boomNew, 0);
        });
    }

    /**
     * 创建飞镖
     */
    private createBoom() {
        const img = Resources.getImage(BOOMERANG_IMG);
        this.boom = new createjs.Shape(new createjs.Graphics().beginBitmapFill(img).drawRect(0, 0, img.width, img.height));
        const height = 100, scale = height / img.height;
        this.boom.scaleY = this.boom.scaleX = scale;
        const x = (Configs.width - img.width * scale) / 2;
        const y = Configs.height - 100 - height;
        this.boom.x = x;
        this.boom.y = y;
        this.addChild(this.boom);
        this.boom.addEventListener('click', this.shoot.bind(this));
        this.on(EVENT_BOOM_RESET, () => {
            this.boom.x = x;
            this.boom.y = y;
            this.boom.rotation = 0;
            this.boom.alpha = 1;
            this.isShooting = false;
        });
    }

    /**
     * 创建分数
     */
    private createScore() {
        const text = new createjs.Text('得分', "20px Arial", '#fff');
        const score = new createjs.Text(this.score.toString(), "20px Arial", '#fff');
        const bg = new createjs.Shape(new createjs.Graphics().beginFill('gray').drawRect(0, 0, 80, 60));
        text.y = 5;
        score.x = text.x = 40;
        score.y = 30;
        score.textAlign = text.textAlign = 'center';
        this.scoreBox = new createjs.Container();
        this.scoreBox.addChild(bg, text, score);
        this.scoreBox.y = 20;
        this.scoreBox.x = Configs.width / 2 - 40;
        this.addChild(this.scoreBox);
        this.on(EVENT_SCORE, () => {
            score.text = this.score.toString();
        });
    }

    /**
     * 创建第几关
     */
    private createLevel() {
        const label = () => '第 ' + this.level + ' 关';
        const text = new createjs.Text(label(), "20px Arial", '#fff');
        const bg = new createjs.Shape(new createjs.Graphics().beginFill('gray').drawRect(0, 0, 100, 30));
        text.y = 5;
        text.x = 50;
        text.textAlign = 'center';
        this.levelBox = new createjs.Container();
        this.levelBox.addChild(bg, text);
        this.levelBox.y = 20;
        this.addChild(this.levelBox);
        this.on(EVENT_LEVEL, () => {
            text.text = label();
        });
    }

    /**
     * 创建剩余飞镖
     */
    private createAmount() {
        const label = () => 'x' + this.amount;
        const text = new createjs.Text(label(), "20px Arial", "#000");
        const img = Resources.getImage(BOOMERANG_IMG);
        const boom = new createjs.Shape(new createjs.Graphics().beginBitmapFill(img).drawRect(0, 0, img.width, img.height));
        const height = 50, scale = height / img.height;
        boom.scaleY = boom.scaleX = scale;
        text.x = img.width * scale + 10;
        text.y = height / 2 - 5;
        this.amountBox = new createjs.Container();
        this.amountBox.addChild(text, boom);
        this.amountBox.x = 20;
        this.amountBox.y = Configs.height - 100 - height;
        this.addChild(this.amountBox);
        this.on(EVENT_AMOUNT, () => {
            text.text = label();
        });
    }

    public close(): void {
        this.events = [];
        this.boom.removeAllEventListeners();
        super.close();
    }

    public on(event: string, callback: Function): this {
        this.events[event] = callback;
        return this;
    }

    public hasEvent(event: string): boolean {
        return this.events.hasOwnProperty(event);
    }

    public trigger(event: string, ... args: any[]) {
        if (!this.hasEvent(event)) {
            return;
        }
        return this.events[event].call(this, ...args);
    }
}

