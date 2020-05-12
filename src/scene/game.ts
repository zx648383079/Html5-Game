class GameScene extends Scene {

    private _shap!: Person;
    
    private _score!: createjs.Text;										//记录分数
    
    private _stones!: Shape[];                             				//台阶数组
    
    private _coins!: Coin[];       										//金币数组
    
    private _index!: number;        										//下一个台阶的数据
    
    private _count: number = Math.ceil(Configs.width / 80) + 1;         //一屏台阶的数目
    
    private _distance!: number;

    private events: any = {};
    
    public init(): void {
        super.init();
        this._stones = new Array();	
        this._coins = new Array();
        this._index = 0;
        this._distance = 0;
        
        this._drawSky();
        this._drawShip();
        this._drawScore();
        
        for (var i = 0; i < this._count ; i++) {
            this._draw();
        }
        
        this.setFPS(30);
        this.addKeyEvent(this._keyDown.bind(this));
    }
    
    private _drawScore(): void {
        this._score = new createjs.Text( (0).toString() , 'bold 30px Courier New', '#ff0000');
        this._score.y = 50;
        this._score.x = 100
        this.addChild(this._score);
    }
    
    private _draw() {
        var x = this._index * 80 - this._distance;
        switch (Resources.models[0][this._index]) {
            case 3:
                this._drawCoin( new Point( x + 15,  Configs.stoneHeight + 100 ) );
            case 0:
                break;
            case 4:
                this._drawCoin(new Point( x + 15, Configs.stoneHeight + 100 ) );
            case 1:
                this._drawStone( new Point( x , Configs.stoneHeight ) );
                break;
            case 5:
                this._drawCoin(new Point( x + 15, Configs.stoneHeight + 150 ) );
            case 2:
                this._drawStone( new Point( x , Configs.stoneHeight + 50 ), Resources.getImage( "high" ) );
                break;
            default:
                break;
        }
        this._index ++ ;
    }
    
    private _keyDown(event: any): void{
        switch (event.keyCode) {
            case 39:
                this._shap.animation("run");
                this._shap.energy = 60;
                break;
            case 32:
                this._shap.animation("jump");
                this._shap.lift = 50;
                break;
            default:
                break;
        }
    }
    
    private _drawSky(arg: HTMLImageElement = Resources.getImage("bg")): void {
        var sky = new createjs.Shape();
        sky.graphics.beginBitmapFill( arg ).drawRect(0, 0, arg.width, arg.height);
        sky.setTransform(0, 0, Configs.width / arg.width , Configs.height / arg.height);
        this.addChild(sky);
    }
    
    private _drawShip(): void {
        var manSpriteSheet = new createjs.SpriteSheet({
            "images": [ Resources.getImage("man") ],
            "frames": {"regX": 0, "height": 64, "count": 66,"regY": 1, "width": 64},
            "animations": {
                "stop": {
                    frames: [65],
                    next: "stop",
                    speed: 0.2,
                },
                "run": {
                    frames: [ 21, 20, 19, 18, 17, 16, 15, 14, 13, 12 ],
                    next: "run",
                    speed: 0.4,
                }, 
                "jump": {
                    frames: [ 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43 ],
                    next: "stop",
                    speed: 0.1,
                },
                "die": {
                    frames: [8, 7, 6, 5, 4, 3, 2, 1, 0 ],
                    next: "die",
                    speed: 0.3,
                }
            }
        });
        this._shap = new Person(manSpriteSheet , "run");
        this._shap.framerate = 13;
        this._shap.setBound( 0, Configs.height , 64, 64);
        this._shap.energy = 100;			
        //this._shap.setTransform( 60, 60, 1.5, 1.5);
        this.addChild(this._shap);
    }
    
    private _drawCoin(point: Point, arg: HTMLImageElement = Resources.getImage("coin")): void {
        var coin = new Coin();
        coin.graphics.beginBitmapFill( arg ).drawRect(0, 0, 50 , 50);
        coin.setBound( point , 50 , 50 );
        this.addChild(coin);
        this._coins.push(coin);		
    }
    
    private _drawStone(point: Point, arg: HTMLImageElement = Resources.getImage("ground")): void {
        var stone = new Shape();
        stone.graphics.beginBitmapFill( arg ).drawRect(0, 0, 80 , arg.height);
        stone.setBound( point , 80 , point.y );
        stone.scaleY = stone.point.y / arg.height;
        this.addChild(stone);
        this._stones.push(stone);		
    }
    
    public update(): void {
        const bound = this._shap.getBound();
        let distance = 0 ;
        if (this._shap.x - Configs.width / 2 > 0 && this._index <= Resources.models[0].length) {
            distance = 2;
        }
        this._distance += distance;
        bound.x += 20;
        bound.width -= 40;
        this._stones.forEach( (stone) => {
            if(bound.x + bound.width == stone.x && stone.y < bound.y + bound.height - 1) {
                this._shap.energy = 0;
            }
            var right = stone.x + stone.getBound().width;
            if( ( (bound.x > stone.x && 
                bound.x < right ) || 
                (bound.x + bound.width > stone.x && 
                bound.x + bound.width < right) ) && 
                bound.y + bound.height >= stone.y ) {
                this._shap.canDown = false;
                this._shap.isSuspeed = false;
            }
            if(right <= 0) {
                this.removeChild( this._stones.shift() );
            }else {
                stone.x -= distance;					
            }
        });
        if( this._distance > 0 && this._distance % 80 == 0) {
            this._draw();		
        }
        
        this._coins.forEach( (coin, i) => {
            if(coin.x <= 20 && coin.y <= 20) {
                this._score.text = (parseInt(this._score.text) + 50 ).toString();
                this.removeChild(coin);
                this._coins.splice(i, 1);
            }
            if(this._ballCollideRect(coin.getBall() , bound )) {
                coin.move();
            }
            if( coin.x + coin.getBound().width < 0) {
                this.removeChild( coin );
                this._coins.splice( i, 1 );
            }else {
                coin.x -= distance;
            }
        });
        this._shap.x -= distance;
        this._shap.move();
                
        super.update();
        
        if(this._shap.point.y <= 0 || this._shap.x >= Configs.width - 64) {
            this.navigate( new EndScene(), this._score.text);
        }
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
        this.events = [];
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

