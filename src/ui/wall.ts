class ImgFill {
    constructor(
        private img: HTMLImageElement,
        private x: number,
        private y: number,
        private width: number,
        private height: number
    ) {

    }

    public exec(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.drawImage(this.img, 0, 0, this.img.width, this.img.height, this.x, this.y, this.width, this.height);
        ctx.restore();
    }
}

class Wall extends createjs.Shape {

    public level = 1;

    private _items: number[] = [1, 1, 1];

    private _stoneImgs: HTMLImageElement[] = [];

    public height: number = 0;

    private _stoneWidth = 80;
    /**
     * 最大可以移动宽度，
     */
    private _maxWidth = 0;
    private _maxCount = 0;

    public get stoneWidth(): number {
        return this._stoneWidth;
    }

    public init(width: number, height: number) {
        this.height = height;
        this._stoneImgs = [
            Resources.getImage(LOW_STONE_IMG),
            Resources.getImage(HIGHT_STONE_IMG)
        ];
        this._stoneWidth = Math.min(...this._stoneImgs.map(i => i.width).filter(i => i > 0));
        this._maxCount = Math.ceil(width / this._stoneWidth);
        this._maxWidth = this._maxCount * this._stoneWidth;
        const count = this._maxCount * 2;
        this._items = [];
        for (let i = 0; i < count; i++) {
            if (i < 5) {
                this._items.push(0);
                continue;
            }
            this.generateNext();
        }
        this.update();
    }

    public update() {
        this.graphics.clear();
        for (let i = 0; i < this._items.length; i++) {
            const item = this._items[i];
            if (item < 0) {
                continue;
            }
            const stone = this._stoneImgs[item];
            this.graphics.append(new ImgFill(stone, i * this._stoneWidth, this.height - stone.height, this._stoneWidth, stone.height));
            // this.graphics.beginBitmapFill(stone, 'no-repeat').drawRect(i * this._stoneWidth, this.height - stone.height, this._stoneWidth, stone.height);
        }
    }

    public generateNext() {
        const last = this._items[this._items.length - 1];
        const rnd = Math.random() * 100;
        if (last >= 0 && rnd < 10 * this.level) {
            this._items.push(-1);
            // 先判断空出现
            return;
        }
        let items = [];
        if (last < 0) {
            let sond = this._items[this._items.length - 2];
            for (; sond >= 0; sond --) {
                items.push(sond);
            }
        } else {
            items.push(last);
            items.push(last - 1);
            items.push(last + 1);
        }
        items = items.filter(i => i >= 0 && i < this._stoneImgs.length);
        if (items.length === 1) {
            this._items.push(items[0]);
            return;
        }
        this._items.push(items[Math.floor(rnd / 100 * items.length)]);
    }

    public move(diff: number) {
        this.x -= diff;
        if (this.x > - this._maxWidth) {
            return;
        }
        this._items.splice(0, this._maxCount);
        for (let i = 0; i < this._maxCount; i++) {
            this.generateNext();
        }
        this.x += this._maxWidth;
        this.update();
    }

    /**
     * 返回墙上可放金币的位置
     * @param x 
     */
    public getCoinPoint(x: number): Point {
        const i = Math.ceil((x - this.x) / this._stoneWidth) - 1;
        return new Point(
            i * this._stoneWidth + this.x,
            this.height - (this._items[i] < 0 ? this._stoneImgs[this._items[i - 1]].height : this._stoneImgs[this._items[i]].height)
        );
    }

    public getSpacePoint(x: number): Point {
        const i = Math.ceil((x - this.x) / this._stoneWidth) - 1;
        return new Point(
            i * this._stoneWidth + this.x,
            this.height - (this._items[i] < 0 ? 0 : this._stoneImgs[this._items[i]].height)
        );
    }

    public getStoneBound(x: number): Bound {
        const i = Math.ceil((x - this.x) / this._stoneWidth) - 1;
        const height = this._items[i] < 0 || !this._stoneImgs[this._items[i]] ? 0 : this._stoneImgs[this._items[i]].height;
        return new Bound(
            i * this._stoneWidth + this.x,
            this.height - height,
            this._stoneWidth,
            height
        );
    }
}