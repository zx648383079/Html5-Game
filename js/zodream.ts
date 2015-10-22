///<reference path="createjs/createjs.d.ts"/>

module Zodream {
	export class App {
		public static main (arg : string | HTMLCanvasElement) {
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
		
		public setTouch() {
			createjs.Touch.enable(this.stage);
		}
		
		public setSize(width: number, height: number) {
			this.stage.canvas.width = width;
			this.stage.canvas.height = height;
		}
		
		public init() {
			return new LoadScene(this.stage);
		}
	}
	
	export class Scene {
		protected stage: createjs.Stage;
		
		constructor(arg: createjs.Stage) {
			this.stage = arg;
			this.init();
		}
		
		protected init() {
			
		}
		
		protected setFPS(
			fps: number = 60,
			mode: string = createjs.Ticker.RAF_SYNCHED) {
			createjs.Ticker.timingMode = mode;
			createjs.Ticker.setFPS(fps);
			createjs.Ticker.addEventListener('tick', this.update.bind(this));
		}
		
		protected update() {
			this.stage.update();
		}
		
		protected close() {
			this.stage.removeAllChildren();
		}
	}
	
	export class LoadScene extends Scene {
		private _lable: createjs.Text;
		private _rect: createjs.Shape;
		private _index: number;
		private _loader: createjs.LoadQueue;
		
		protected init() {
			super.init();
			this._index = 0;
			this.images();
			this.setFPS(10);
		}
		
		private setSchedule(num: number = 0) {
			if(this._lable === undefined) {
				this._lable = new createjs.Text(num.toString(), 'bold 14px Courier New', '#000000');
				this._lable.y = 10;
				this._rect = new createjs.Shape(new createjs.Graphics().beginFill("#ffffff").drawRect(0, 0, 400, 30));
				this.stage.addChild(this._rect, this._lable);
				
			}
			
			this._lable.text = this._index.toString();
			this._rect.graphics.beginFill("#ff0000").drawRect(0, 0 , this._index * 10 , 30);
		}
		
		private images() {
			this._loader = new createjs.LoadQueue(true);
			this._loader.addEventListener("complete" , this.complete.bind(this));
			this._loader.addEventListener("fileload", this.fileLoad.bind(this));
			this._loader.loadManifest(Configs.images);
			this._loader.getResult()
		}
		private sounds() {
			createjs.Sound.alternateExtensions = ["mp3"];
			var preload = new createjs.LoadQueue(true);
			preload.installPlugin( createjs.Sound );
			preload.loadManifest( Configs.sounds );
		}
		
		private fileLoad() {
			this.setSchedule( this._index ++ );
		}
		
		private complete() {
			this.close();
			for (var i = 0, len = Configs.images.length; i < len; i++) {
				var image = Configs.images[i];
				Resources.images[image.id] = this._loader.getResult(image.id);
			}
			new MainScene(this.stage);
		}
	}
	
	export class MainScene extends Scene {
		public init() {
			super.init();
			var btn = new createjs.Shape(new createjs.Graphics().beginFill("#ff0000").drawRect(0, 0, 100, 50));
			btn.x = Configs.width / 2;
			btn.y = Configs.height / 2;
			btn.addEventListener("click", this._click.bind(this));
			this.stage.addChild(btn);
		}
		
		private _click() {
			this.close();
			new GameScene(this.stage);
		}
	}
	
	export class GameScene extends Scene {
		public init() {
			super.init();
			this._drawSky();
			
		}
		
		private _drawSky() {
			var sky = new createjs.Shape(),
				bg = Resources.images["bg"];
			sky.graphics.beginBitmapFill(bg).drawRect(0, 0, Configs.width, Configs.height);
			sky.setTransform(0, 0, 1 , Configs.height / bg.height);
			console.log(bg);
			this.stage.addChild(sky);
		}
	}
	
	export class EndScene extends Scene {
		
	}
	
	export class Configs {
		public static images = [
			{src:"img/man.png" , id:"man"},
			{src:"img/ground.png" , id:"ground"},
			{src:"img/bg.png" , id:"bg"},
			{src:"img/high.jpg" , id:"high"},
			{src:"img/coins.png" , id:"coin"}
		];
		
		public static sounds = {
			
		}
		
		public static width = window.innerWidth;
		
		public static height = window.innerHeight;
		
	}
	
	export class Resources {
		public static images = new Object();
		
		public static sounds(id: string) {
			createjs.Sound.play(id);
		}
		
		
	}
	
	export class Point {
		constructor (
			x?: number,
			y?: number
		) {
			this.x = x;
			this.y = y;
		}
		public x: number;
		public y: number;
	}
}

module Models {
	interface Base {
		
	}
}