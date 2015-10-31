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
				
		public init(): void {
			super.init();
						
			this._drawSky();
			this._drawShip();
			this._drawScore();
			this.setFPS(30);
			this.addKeyEvent(this._keyDown.bind(this));
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
		
		protected update(): void {
			
			super.update();
			
			if(this._shap.point.y <= 0 || this._shap.x >= Configs.width - 64) {
				this.navigate( new EndScene(), this._score.text);
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
		
	}
	
	export class Shape extends createjs.Shape {
		private _width: number;
		
		private _height: number;
		
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
			{src:"img/pumpkin_l.png" , id:"pumpkin_l"},
			{src:"img/shape.png" , id:"shape"},
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
