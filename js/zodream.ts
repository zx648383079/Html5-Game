///<reference path="createjs/createjs.d.ts"/>

module Zodream {
	export class App {
		public static main (arg : string | HTMLCanvasElement): Program {
			var app = new Zodream.Program(arg);
			app.setTouch();
			app.setSize(Configs.width, Configs.height);
			app.init();
			return app;
		} 
	}
	
	export class Program {
		private stage: createjs.Stage;
		
		constructor(arg: string | HTMLCanvasElement) {
			this.stage = new createjs.Stage(arg);
		}
		
		public setTouch(): void {
			createjs.Touch.enable(this.stage);
		}
		
		public setSize(width: number, height: number): void {
			(<HTMLCanvasElement>this.stage.canvas).width = width;
			(<HTMLCanvasElement>this.stage.canvas).height = height;
		}
		
		public init(): void {
			new LoadScene(this.stage);
		}
	}
	
	export class Scene {
		protected stage: createjs.Stage;
		
		constructor(stage?: createjs.Stage , ...arg: any[]) {
			if(stage != undefined ) {
				this.stage = stage;		
				this.init(...arg);		
			}
		}
		
		protected init(...arg: any[]): void {
			
		}
		
		public setStage(arg: createjs.Stage, ...param: any[]): void {
			this.stage = arg;
			this.init(...param);
		}
		
		protected addEvent(name: string, func: (eventObj: Object) => void ): void {
			this.stage.addEventListener( name , func );
		}
		
		protected addKeyEvent(func: (eventObj: Object) => any): any {
			return window.addEventListener("keydown" , func);
		}
		
		protected addChild(...arg: any[]): void {
			this.stage.addChild(...arg);	
		}
		
		protected removeChild(...arg: any[]): void {
			this.stage.removeChild(...arg);
		}
		
		protected setFPS(
			fps: number = 60,
			mode: string = createjs.Ticker.RAF_SYNCHED): void {
			createjs.Ticker.timingMode = mode;
			createjs.Ticker.setFPS(fps);
			createjs.Ticker.addEventListener('tick', this.update.bind(this));
		}
		
		protected update(): void {
			this.stage.update();
		}
		
		protected close(): void {
			createjs.Ticker.removeAllEventListeners();
			this.stage.removeAllChildren();
		}
		
		public navigate(arg: Scene, ...param: any[]) {
			this.close();
			arg.setStage(this.stage, ...param);
		}
	}
	
	export class LoadScene extends Scene {
		private _lable: createjs.Text;
		private _rect: createjs.Shape;
		private _index: number;
		private _loader: createjs.LoadQueue;
		
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
				this._rect = new createjs.Shape(new createjs.Graphics().beginFill("#ffffff").drawRect(0, 0, 400, 30));
				this.addChild( this._rect, this._lable );
			}
			
			this._lable.text = this._index.toString();
			this._rect.graphics.beginFill("#ff0000").drawRect(0, 0 , this._index * 10 , 30);
		}
		
		private _images(): void {
			this._loader = new createjs.LoadQueue(true);
			this._loader.addEventListener("complete" , this._complete.bind(this));
			this._loader.addEventListener("fileload", this._fileLoad.bind(this));
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
	
	export class MainScene extends Scene {
		public init(): void{
			super.init();
			this._drawBtn();
			this.setFPS(10);
		}
		
		private _drawBtn(): void {
			var btn = new createjs.Shape(new createjs.Graphics().beginFill("#ff0000").drawRect(0, 0, 100, 50));
			btn.x = Configs.width / 2;
			btn.y = Configs.height / 2;
			btn.addEventListener("click", this._click.bind(this));
			this.addChild(btn);
		}
		
		private _click(): void {
			this.navigate( new GameScene() );
		}
	}
	
	export class GameScene extends Scene {
		private _shap: Person;
		
		private _score: createjs.Text;										//记录分数
		
		private _stones: Shape[];                             				//台阶数组
		
		private _coins: Coin[];       										//金币数组
		
		private _index: number;        										//下一个台阶的数据
		
		private _count: number = Math.ceil(Configs.width / 80) + 1;         //一屏台阶的数目
		
		private _distance: number;
		
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
			this._shap.setBounds( 0, Configs.height , 64, 64);
			this._shap.energy = 100;			
			//this._shap.setTransform( 60, 60, 1.5, 1.5);
			this.addChild(this._shap);
		}
		
		private _drawCoin(point: Point, arg: HTMLImageElement = Resources.getImage("coin")): void {
			var coin = new Coin();
			coin.graphics.beginBitmapFill( arg ).drawRect(0, 0, 50 , 50);
			coin.setBounds( point , 50 , 50 );
			this.addChild(coin);
			this._coins.push(coin);		
		}
		
		private _drawStone(point: Point, arg: HTMLImageElement = Resources.getImage("ground")): void {
			var stone = new Shape();
			stone.graphics.beginBitmapFill( arg ).drawRect(0, 0, 80 , arg.height);
			stone.setBounds( point , 80 , point.y );
			stone.scaleY = stone.point.y / arg.height;
			this.addChild(stone);
			this._stones.push(stone);		
		}
		
		protected update(): void {
			var bound = this._shap.getBounds(),
				distance = this._shap.x - Configs.width / 2 ;
			if(distance < 0 || this._index > Resources.models[0].length) {
				distance = 0;
			}
			this._distance += distance;
			bound.x += 20;
			bound.width -= 40;
			this._stones.forEach( (stone, i) => {
				if(bound.x + bound.width == stone.x && stone.y < bound.y + bound.height) {
					this._shap.energy = 0;
				}
				var right = stone.x + stone.getBounds().width;
				if( ( (bound.x > stone.x && 
					bound.x < right ) || 
					(bound.x + bound.width > stone.x && 
					bound.x + bound.width < right) ) && 
					bound.y + bound.height >= stone.y ) {
					this._shap.canDown = false;
					this._shap.isSuspeed = false;
				}
				if( right <= 0 ) {
					this.removeChild( stone );
					this._stones.splice( i, 1 );
					this._draw();					
				}else {
					stone.x -= distance;									
				}
			});
			
			this._coins.forEach( (coin, i) => {
				if(coin.x <= 20 && coin.y <= 20) {
					this._score.text = (parseInt(this._score.text) + 50 ).toString();
					this.removeChild(coin);
					this._coins.splice(i, 1);
				}
				if(this._collide( bound , coin.getBounds())) {
					coin.move();
				}
				if( coin.x + coin.getBounds().width < 0) {
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
		private _collide( rect: any, ball: any): boolean {
			var centerX = ball.x + ball.width / 2,
				centerY = ball.y + ball.height / 2,
				radius = Math.min( ball.width, ball.height ) / 2,
				rx = centerX - (rect.x + rect.width / 2),
                ry = centerY - (rect.y + rect.height / 2),
				dx = Math.min( rx, rect.width / 2),
                dx1 = Math.max( dx, -rect.width / 2),
                dy = Math.min( ry, rect.height / 2),
                dy1 = Math.max( dy, -rect.height / 2);
            return (dx1 - rx) * ( dx1 - rx ) + ( dy1 - ry ) * ( dy1 - ry ) <= radius * radius;
		}
	}
	
	export class EndScene extends Scene {
		protected init(arg: any): void {
			super.init();
			this._drawScore(arg);
			this._drawBtn();
			this.setFPS(10);
		}
		
		private _drawScore(arg: string): void {
			var lable = new createjs.Text( arg, 'bold 30px Courier New', '#ff0000');
			lable.y = Configs.height / 2 - 50;
			lable.x = Configs.width / 2 + 30;
			this.addChild(lable);
		}
		
		private _drawBtn(): void {
			var btn = new Shape(new createjs.Graphics().beginFill("#ff0000").drawRect(0, 0, 100, 50));
			btn.x = Configs.width / 2;
			btn.y = Configs.height / 2;
			btn.addEventListener("click", this._click.bind(this));
			this.addChild(btn);
		}
		
		private _click(): void {
			this.navigate( new GameScene() );
		}
	}
	
	export class Person extends createjs.Sprite {
		private _point: Point;
		
		set point(arg: Point) {
			this._point = arg;
			var val: any = arg.getWorld();
			this.x = val.x;
			this.y = val.y;
		}
		
		get point(): Point {
			this._point.setWorld(this.x, this.y);
			return this._point;
		}
		
		private _size: Size;
		
		set size(arg: Size) {
			this._size = arg;
		}
		
		get size(): Size {
			return this._size;
		}
		
		public setBounds(x: number | Point, y: number | Size, width?: number | Size, height?: number) {
			if(x instanceof Point) {
				this.point = <Point>x;
				if(y instanceof Size) {
					this.size = y;
				}else{
					this.size = new Size( <number>y, <number>width);
				}
			}else {
				this.point = new Point( <number>x , <number>y);
				if(width instanceof Size) {
					this.size = width;
				}else{
					this.size = new Size( <number>width, <number>height);
				}
			}
		}
		
		public getBounds(): any {
			return {
				x: this.x,
				y: this.y,
				width: this.size.width,
				height: this.size.height
			};
		}
		
		public speed: number = 2;
		
		private _energy: number = 0;
		
		get energy(): number {
			return this._energy;
		}
		
		set energy(arg: number) {
			if(this._energy >= 0 && arg > 0 ) {
				this._energy += arg;
			}else if( (this._energy > 0 && arg <= 0) || (this._energy < 0 && arg >= 0) ) {
				this._energy = arg;
			}else if(this._energy <= 0 && arg < 0 ) {
				this._energy += arg;
			}
		}
		
		public gravity: number = 2;    // 重力
		
		private _lift: number = 0;     //升力
		
		public isSuspeed: boolean = true;      //判断是否是悬浮状态
		
		get lift(): number {
			return this._lift;
		}
		
		set lift(arg: number) {
			if(!this.isSuspeed) {
				this._lift += arg;
				this.isSuspeed = true;
			}
		}
		
		public canDown: boolean = true;
		
		public animation(arg: string): void {
			if(arg != this.currentAnimation) {
				this.gotoAndPlay(arg);
			}
		}
		
		public move() {
			if(this._lift > 0) {
				this.animation("jump");
				this.y -= this.gravity;
				this._lift -= this.gravity;
				if(this._lift <= 0) {
					this._lift = 0;
					this.animation("stop");
				}
			}
			if(this._energy > 0) {
				if(this.currentAnimation == "stop") {
					this.animation("run");
				}
				this.x += this.speed;
				this._energy -= this.speed;
				if(this._energy < 0) {
					this._energy = 0;
				} 
			}else if(this._energy < 0) {
				this.x -= this.speed;
				this._energy += this.speed;
				if(this._energy > 0) {
					this._energy = 0;
				}
			}
			
			if(this._energy == 0) {
				this.animation("stop");
			} 
			
			if(this.canDown && this._lift == 0) {
				this.y += this.gravity;
			}
			this.canDown = true;
			
		}
	}
	
	export class Shape extends createjs.Shape {
		private _point: Point;
		
		set point(arg: Point) {
			this._point = arg;
			var val: any = arg.getWorld();
			this.x = val.x;
			this.y = val.y;
		}
		
		get point(): Point {
			this._point.setWorld(this.x, this.y);			
			return this._point;
		}
		
		private _size: Size;
		
		set size(arg: Size) {
			this._size = arg;
		}
		
		get size(): Size {
			return this._size;
		}
		
		public setBounds(x: number | Point, y: number | Size, width?: number | Size, height?: number) {
			if(x instanceof Point) {
				this.point = <Point>x;
				if(y instanceof Size) {
					this.size = y;
				}else{
					this.size = new Size( <number>y, <number>width);
				}
			}else {
				this.point = new Point( <number>x , <number>y);
				if(width instanceof Size) {
					this.size = width;
				}else{
					this.size = new Size( <number>width, <number>height);
				}
			}
		}
		
		public getBounds(): any {
			return {
				x: this.x,
				y: this.y,
				width: this.size.width,
				height: this.size.height
			};
		}
	}
	
	export class Coin extends Shape {
		public move( arg: Point = new Point( 20, Configs.height - 20 ) ) {
			createjs.Tween.get(this).to({x: arg.getWorld().x, y: arg.getWorld().y}, 2000);
		}
	}
	
	export class Configs {
		public static resources: any[] = [
			{src:"img/man.png" , id:"man"},
			{src:"img/ground.png" , id:"ground"},
			{src:"img/bg.png" , id:"bg"},
			{src:"img/high.jpg" , id:"high"},
			{src:"img/coin.png" , id:"coin"},
			{src:"js/game.json" , id:"model"}
		];
		
		public static sounds: Object[];
		
		public static width: number = window.innerWidth;
		
		public static height: number = window.innerHeight;
		
		public static stoneHeight: number = Math.floor(window.innerHeight / 4);
		
	}
	
	export class Resources {
		public static images: any = {};
		
		public static setImage(id: string, img: Object): void {
			this.images[id] = img;
		}
		
		public static getImage(id: string): HTMLImageElement {
			if(this.images[id] == undefined) return null;
			return <HTMLImageElement> this.images[id];
		}
		
		public static sounds(id: string) {
			createjs.Sound.play(id);
		}
		
		public static models: any[] = [];
		
	}
	
	export class Point {
		constructor (
			public x?: number,
			public y?: number
		) {
		}
		
		public setLocal(x: number, y: number): void {
			this.x = x;
			this.y = y;
		}
		
		public getLocal(): Point {
			return this;
		}
		
		public setWorld(x: number, y:number): void {
			this.x = x;
			this.y = Configs.height - y;
		}
		
		public getWorld(): any {
			return {
				x: this.x,
				y: Configs.height - this.y
			};
		}
	}
	
	export class Size {
		constructor(
			public width?: number,
			public height?: number
		){
		}
	}
}
