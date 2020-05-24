class GameScene extends Scene {

    private _man!: Person;
    
    private _score: number = 0;										//记录分数
    
    private _wall!: Wall;                             				//台阶数组
    
    private _coins!: Coin[];       										//金币数组
    
    private _level: number = 1;
    
    /**
     * 当前已跑了多远
     */
    private _distance: number = 0;

    private _coinTime = 0;

    /**
     * 是否处于跳跃中，处于几段跳
     */
    private _jumping = 0;

    private _vy = -12; // 垂直方向的速度，负代表向上
    private _gravity = .5; // 重力加速度
    private _hx = 0; // 加速度
    private _resistance = .3; // 阻力
    /**
     * 当前运动速度
     */
    private _speed: number = 1;
    
    public get stoneHeight() : number {
        return Math.floor(this.height / 4)
    }

    public set score(arg: number) {
        this._score = arg;
        this.trigger(EVENT_SCORE, arg);
        this.level = Math.ceil(arg / 200);
    }

    
    public get score(): number {
        return this._score;
    }

    
    public get level() : number {
        return this._level;
    }

    
    public set level(v : number) {
        this._level = v;
        this.trigger(EVENT_LEVEL, v);
        this._wall.level = v;
        this._speed = Math.ceil(this.level / 10);
    }
    
    
    public init(): void {
        super.init();
        this._coins = [];
        this._distance = 0;
        
        this._drawSky();
        this._drawWall();
        this._drawScore();
        this._drawMan();
        this.setFPS();
        this.addKeyEvent(this._keyDown.bind(this));
    }
    
    private _drawScore(): void {
        const box = new createjs.Text('', 'bold 30px Courier New', '#ff0000');
        box.y = 20;
        box.x = this.width - 100;
        box.textAlign = 'center';
        this.addChild(box);
        this.on(EVENT_SCORE, () => {
            box.text = this._score.toString();
        });
    }
    
    private _keyDown(event: KeyboardEvent): void{
        event.preventDefault();
        switch (event.key) {
            case 'D':
            case 'd':
            case 'ArrowRight':
                this.runRightMan();
                break;
            case 'A':
            case 'a':
            case 'ArrowLeft':
                    this.runLeftMan();
                    break;
            case ' ':
                this.dumpMan();
                break;
            default:
                break;
        }
    }

    private runLeftMan() {
        this._man.animation('run');
        this._hx = -5;
        // if (this._jumping > 0) {
        //     this._vy = 3;
        // }
    }

    private runRightMan() {
        this._man.animation('run');
        this._hx = 5;
        // if (this._jumping > 0) {
        //     this._vy = 3;
        // }
    }

    private dumpMan() {
        if (this._jumping > 1) {
            return;
        }
        this._jumping ++;
        this._man.animation('jump');
        this._vy = -12;
    }

    private _drawWall() {
        this._wall = new Wall();
        this._wall.init(this.width, this.height);
        this.addChild(this._wall);
    }
    
    private _drawSky(arg: HTMLImageElement = Resources.getImage(BG_IMG)): void {
        const sky = new createjs.Shape();
        sky.graphics.beginBitmapFill(arg);
        const scale = this.height / arg.height;
        const width = scale * arg.width;
        const count = Math.ceil(width / this.width) + 1;
        for (let i = count - 1; i >= 0; i--) {
            sky.graphics.drawRect(i * arg.width, 0, arg.width, arg.height);
        }
        sky.scaleX = sky.scaleY = scale;
        this.addChild(sky);
        this.on(EVENT_BG_MOVE, (diff: number) => {
            sky.x -= diff;
            if (sky.x < -width) {
                sky.x += width;
            }
        });
    }
    
    private _drawMan(): void {
        const manSpriteSheet = new createjs.SpriteSheet({
            'images': [ Resources.getImage(MAN_IMG) ],
            'frames': {'regX': 0, 'height': 64, 'count': 66,'regY': 1, 'width': 64},
            'animations': {
                'stop': {
                    frames: [65],
                    next: 'stop',
                    speed: 0.2,
                },
                'run': {
                    frames: [ 21, 20, 19, 18, 17, 16, 15, 14, 13, 12 ],
                    next: 'run',
                    speed: 0.2,
                }, 
                'jump': {
                    frames: [ 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43 ],
                    next: 'stop',
                    speed: 0.2,
                },
                'die': {
                    frames: [8, 7, 6, 5, 4, 3, 2, 1, 0 ],
                    next: 'die',
                    speed: 0.3,
                }
            }
        });
        this._man = new Person(manSpriteSheet , 'stop');
        this._man.framerate = 13;
        const point = this._wall.getSpacePoint(200);
        this._man.setBound(point.x, 0, 64, 62);
        this._vy = 0;			
        //this._shap.setTransform( 60, 60, 1.5, 1.5);
        this.addChild(this._man);
    }
    
    private _drawCoin(point: Point, arg: HTMLImageElement = Resources.getImage(COIN_IMG)): void {
        const coin = new Coin();
        coin.graphics.beginBitmapFill(arg).drawRect(0, 0, arg.width, arg.height);
        point.y -= arg.height;
        point.x += (this._wall.stoneWidth - arg.width) / 2;
        coin.setBound(point, arg.width, arg.height);
        this.addChild(coin);
        this._coins.push(coin);		
    }

    private mapCoin(cb: (coin: Coin, i: number) => any) {
        for (let i = this._coins.length - 1; i >= 0; i--) {
            const res = cb(this._coins[i], i);
            if (typeof res === 'undefined') {
                continue;
            }
            if (typeof res === 'boolean' && !res) {
                break;
            }
            if (typeof res === 'number' && res === -1) {
                this.removeChild(this._coins[i]);
                this._coins.splice(i, 1);
            }
        }
    }

    private moveCoin(diff: number) {
        this.mapCoin(coin => {
            if( coin.x + coin.getBound().width < 0) {
                return -1;
            }
            coin.x -= diff;
            if (this._collide(coin.getBall(), this._man.getRealBound())) {
                this.score += 1;
                return -1;
            }
        });
    }

    /**
     * 随机生成金币
     */
    private generateCoin() {
        this._coinTime -= 1;
        if (this._coinTime > 0) {
            return;
        }
        let x = this.width;
        if (this._coins.length > 0) {
            x = this._coins[this._coins.length - 1].rightOffest;
            if (x > this.width) {
                return;
            }
        }
        const rnd = this._coinTime = Math.floor(Math.random() * 1000);
        // if (rnd < 90) {
        //     return;
        // }
        x = Math.max(x, this.width);
        const point = this._wall.getCoinPoint(x);
        if (rnd > 500) {
            point.y -= 80;
        }
        this._drawCoin(point);
    }

    private moveMan(diff: number) {
        const manBound = this._man.getRealBound();
        let y = manBound.y;
        if (this._jumping > 0) {
            this._vy += this._gravity;
            y += this._vy;
        }
        let x = manBound.x - diff;
        
        if (this._hx > 0) {
            this._hx -= this._resistance;
            x += this._hx;
            if (this._hx <= 0) {
                this._man.animation('stop');
                this._hx = 0;
            }
        } else if (this._hx < 0) {
            this._hx += this._resistance;
            x += this._hx;
            if (this._hx >= 0) {
                this._man.animation('stop');
                this._hx = 0;
            }
            const prev = this._wall.getStoneBound(x);
            if (prev.x + prev.width >= x && prev.y < y + manBound.height) {
                x = prev.x + prev.width;
                this._man.animation('stop');
                this._hx = 0;
            }
        }
        const bound = this._wall.getStoneBound(x);
        const next = this._wall.getStoneBound(x + manBound.width);
        if (this._jumping > 0) {
            // 下坠落地检测
            if (y + manBound.height >= bound.y && bound.y < this.height) {
                this._jumping = 0;
                this._hx = 0;
                this._man.animation('stop');
                y = bound.y - manBound.height;
            }
            if (next.y < bound.y && y + manBound.height >= next.y) {
                this._jumping = 0;
                this._hx = 0;
                this._man.animation('stop');
                y = next.y - manBound.height;
            }
        } else {
            // 下坠检测
            if (y + manBound.height < bound.y) {
                this._jumping = 2;
                this._vy = 0;
            }
        }
        // 撞墙检测
        if (next.y < y + manBound.height) {
            x = next.x - manBound.width;
            this._man.animation('stop');
        }
        if (x + manBound.width >= this.width) {
            x = this.width - manBound.width;
            this._man.animation('stop');
        }
        this._man.setRealPoint(x, y);
        if (x + manBound.width < 0
            || y + manBound.height >= this.height - 10) {
            this.navigate(new EndScene, this.score);
            return;
        }
    }

    /**
     * 移动整张地图
     * @param diff 
     */
    private moveMap(diff: number) {
        this._distance += diff;
        this.trigger(EVENT_BG_MOVE, diff);
        this._wall.move(diff);
        this.moveMan(diff);
        this.moveCoin(diff);
        this.generateCoin();
    }
    
    public update(): void {
        this.moveMap(this._speed);
    }
    /**
     * 矩形与圆的碰撞检测
     * 来源：http://bbs.9ria.com/thread-137642-1-1.html
     */
    private _collide(ball: Ball, rect: Bound ): boolean {
        var rx = ball.x - (rect.x + rect.width / 2),
            ry = ball.y - (rect.y + rect.height / 2),
            dx = Math.min( rx, rect.width / 2),
            dx1 = Math.max( dx, -rect.width / 2),
            dy = Math.min( ry, rect.height / 2),
            dy1 = Math.max( dy, -rect.height / 2);
        return Math.pow(dx1 - rx, 2) + Math.pow( dy1 - ry , 2) <= Math.pow(ball.radius, 2);
    }
    
    /**
     * 矩形与圆的碰撞检测
     * 
     */
    private _ballCollideRect(ball: Ball, rect: Bound): boolean {
        if(ball.x < rect.x && ball.y < rect.y) {
            return Math.pow(ball.x - rect.x, 2) + Math.pow(ball.y - rect.y, 2) < 
                    Math.pow(ball.radius, 2);
        }else if(ball.x < rect.x && ball.y > rect.y + rect.height) {
            return Math.pow(ball.x - rect.x, 2) + Math.pow(ball.y - rect.y - rect.height, 2) < 
                    Math.pow(ball.radius, 2);
        }else if(ball.x > rect.x + rect.width && ball.y < rect.y) {
            return Math.pow(ball.x - rect.x - rect.width, 2) + Math.pow(ball.y - rect.y, 2) < 
                    Math.pow(ball.radius, 2);
        }else if(ball.x > rect.x + rect.width && ball.y > rect.y + rect.height) {
            return Math.pow(ball.x - rect.x - rect.width, 2) + Math.pow(ball.y - rect.y - rect.height, 2) < 
                    Math.pow(ball.radius, 2);
        }else{
            return (Math.abs( ball.x - rect.x - rect.width / 2 ) < ball.radius + rect.width / 2) && 
                    (Math.abs( ball.y - rect.y - rect.height / 2) < ball.radius + rect.height / 2);
        }
    }
    
    /**
     * 矩形之间的碰撞检测
     * 
     */
    private _rectCollide(rect1: Bound, rect2: Bound): boolean {
        return rect1.x + rect1.width > rect2.x && 
                rect1.x < rect2.x + rect2.width &&
                rect1.y + rect1.height > rect2.y &&
                rect1.y < rect2.y + rect2.height;
    }
    
    /**
     * 圆之间的碰撞检测
     * 
     */
    private _ballCollide(ball1: Ball, ball2: Ball): boolean {
        return Math.pow(ball1.x - ball2.x , 2) + 
                Math.pow(ball1.y - ball2.y, 2) < 
                Math.pow(ball1.radius + ball2.radius, 2);
    }

    public close(): void {
        super.close();
    }
}

