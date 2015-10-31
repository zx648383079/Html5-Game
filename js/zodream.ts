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
		
		private _fileLoad(): void {
			this._setSchedule( this._index ++ );
		}
		
		private _complete(): void {
			for (var i = 0, len = Configs.resources.length; i < len; i++) {
				var image = Configs.resources[i];
				Resources.setImage( image.id , this._loader.getResult(image.id) );
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
			var img = Resources.getImage('start'),
				btn = new createjs.Shape(new createjs.Graphics().beginBitmapFill(img).drawRect(0, 0, img.width, img.height));
			btn.x = (Configs.width - img.width) / 2 ;
			btn.y = (Configs.height - img.height) / 2;
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
		
		private _shapes: Array<Sprite | Shape>;
		
		private _total: number;
		private _time: number;
				
		public init(): void {
			super.init();	
			this._time = 200;	
			this._total = 100;
			this._shapes = Array();	
			this._drawShip();
			this._drawScore();
			this.setFPS(30);
			this.addKeyEvent(this._keyDown.bind(this));
		}
		
		private _draw() {
			var tem = Math.random(),
				x = Math.random() * (Configs.width - 100),
				speed = Math.ceil(Math.random() * 10);
			if(tem < 0.2) {
				this._drawGhost(x, speed);
			}else if(tem < 0.5){
				this._drawCandy(x, speed);
			}else{
				this._drawPumpkin(x, speed, tem > 0.8);
			}
		}
		
		private _drawScore(): void {
			this._score = new createjs.Text( (0).toString() , 'bold 30px Courier New', '#ff0000');
			this._score.y = 50;
			this._score.x = 100
			this.addChild(this._score);
		}
		
		private _keyDown(event: any): void{
			switch (event.keyCode) {
				case 39:
					this._shap.animation("nright");
					break;
				case 37:
					this._shap.animation("nleft");
					break;
				default:
					break;
			}
		}
		
		private _drawCandy(x: number = 0, speed: number = 1): void {
			var img = Resources.getImage( "candy" ),			
				shape = new Shape(new createjs.Graphics().beginBitmapFill(img).drawRect(0, 0, img.width, img.height));
			shape.setBound(x, -img.height, img.width, img.height);
			shape.name = "candy";
			shape.value = 30;
			shape.speed = speed;
			this.addChild(shape);
			this._shapes.push(shape);
		}
		
		private _drawPumpkin(x: number = 0, speed: number = 1, big = false): void {
			var img = Resources.getImage( big ? "pumpkinl" : "pumpkin" );
			var shape = new Shape(new createjs.Graphics().beginBitmapFill(img).drawRect(0, 0, img.width, img.height));
			shape.setBound(x, -img.height, img.width, img.height);
			shape.speed = speed;
			shape.name = "pumpkin";
			shape.value = big ? 100 : 50;
			this.addChild(shape);
			this._shapes.push(shape);
		}
		
		private _drawGhost(x: number = 0, speed: number = 1): void {
			var ghostSpriteSheet = new createjs.SpriteSheet({
				"images": [ Resources.getImage("ghost") ],
				"frames": {"regX": 0, "height": 70, "count": 5,"regY": 0, "width": 70},
				"animations": {
					"run": {
						frames: [ 4, 3, 2, 1, 0 ],
						next: true,
						speed: 0.2,
					}
				}
			});
			var ghost = new Sprite(ghostSpriteSheet , "run");
			ghost.name = "ghost";
			ghost.value = -200;
			ghost.speed = speed;
			ghost.setBound(x, -70, 70, 70);
			this.addChild(ghost);
			this._shapes.push(ghost);
		}
		
		private _drawShip(): void {
			var manSpriteSheet = new createjs.SpriteSheet({
				"images": [ Resources.getImage("shap") ],
				"frames": {"regX": 0, "height": 161, "count": 16,"regY": 0, "width": 147},
				"animations": {
					"nleft": {
						frames: [ 0, 1, 2, 3 ],
						next: true,
						speed: 0.2,
					}, 
					"nright": {
						frames: [ 4, 5, 6, 7 ],
						next: true,
						speed: 0.2,
					}, 
					"left": {
						frames: [ 8, 9, 10, 11 ],
						next: true,
						speed: 0.2,
					}, 
					"right": {
						frames: [ 12, 13, 14, 15 ],
						next: true,
						speed: 0.2,
					}, 
				}
			});
			this._shap = new Person(manSpriteSheet , "nleft");
			this._shap.setBound(Configs.width / 2, Configs.height - 200, 147, 161);
			this.addChild(this._shap);
		}
		
		protected update(): void {
			var bound = this._shap.getBound();
			bound.y += 40;
			bound.height -= 40;
			this._shapes.forEach( (shape, i) => {
				shape.y += shape.speed;
				if(this._rectCollide(shape.getBound(), bound)) {
					this._total --;
					this._score.text = (parseInt(this._score.text, 10) + shape.value).toString();
					this._shapes.splice(i, 1);
					this.removeChild(shape);	
				}else if(shape.y > Configs.height) {
					this._shapes.splice(i, 1);
					this.removeChild(shape);
				}
			});
			super.update();
			if(this._total <= 0) {
				this.navigate(new EndScene(), this._score.text);
			}
			
			this._time --;
			if(this._time <= 0) {
				this._draw();
				this._time = Math.random() * 60;	
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
			var img = Resources.getImage('restart'),
				btn = new createjs.Shape(new createjs.Graphics().beginBitmapFill(img).drawRect(0, 0, img.width, img.height));
			btn.x = (Configs.width - img.width) / 2 ;
			btn.y = (Configs.height - img.height) / 2;
			btn.addEventListener("click", this._click.bind(this));
			this.addChild(btn);
		}
		
		private _click(): void {
			this.navigate( new GameScene() );
		}
	}
	
	export class Sprite extends createjs.Sprite {
		protected _width: number;
		
		protected _height: number;
		
		public value: number;
		
		public speed: number;
		
		public setBound(x: number | Bound, y?: number, width?: number, height?: number) {
			if(x instanceof Bound) {
				this.x = x.x;
				this.y = x.y; 
				this._width = x.width;
				this._height = x.height;
			}else {
				this.x = <number>x;
				this.y = y; 
				this._width = width;
				this._height = height;
			}
		}
		
		public getBound(): Bound {
			return new Bound(this.x, this.y, this._width, this._height);
		}
	}
	
	export class Person extends Sprite {
		public animation(arg: string): void {
			if(arg != this.currentAnimation) {
				this.gotoAndPlay(arg);
			}else {
				switch (arg) {
					case "nleft":
					case "left":
						if(this.x > 10) {
							this.x -= 10;							
						}
						break;
					case "nright":
					case "right":
						if(this.x < Configs.width - this._width) {
							this.x += 10;						
						}
						break;
					default:
						break;
				}
			}
		}
	}
	
	export class Shape extends createjs.Shape {
		private _width: number;
		
		private _height: number;
		
		public value: number;
		public speed: number;
		
		
		public setBound(x: number | Bound, y?: number, width?: number, height?: number) {
			if(x instanceof Bound) {
				this.x = x.x;
				this.y = x.y; 
				this._width = x.width;
				this._height = x.height;
			}else {
				this.x = <number>x;
				this.y = y; 
				this._width = width;
				this._height = height;
			}
		}
		
		public getBound(): Bound {
			return new Bound(this.x, this.y, this._width, this._height);
		}
	}
	
	export class Configs {
		public static resources: any[] = [
			{src:"img/candy.png" , id:"candy"},
			{src:"img/ghost.png" , id:"ghost"},
			{src:"img/pumpkin.png" , id:"pumpkin"},
			{src:"img/pumpkin_l.png" , id:"pumpkinl"},
			{src:"img/shap.png" , id:"shap"},
			{src:"img/start.png" , id:"start"},
			{src:"img/restart.png" , id:"restart"},
		];
		public static width: number = window.innerWidth;
		public static height: number = window.innerHeight;		
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
	export class Bound {
		constructor(
			public x?: number,
			public y?: number,
			public width?: number,
			public height?: number
		) {
		}
	}
}
