/// <reference path="../typings/tsd.d.ts"/>
module Zodream {
	"use strict"
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
	
	export abstract class Scene {
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
			createjs.Ticker.reset();
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
			var img = Resources.getImage('play'),
				btn = new createjs.Shape(new createjs.Graphics().beginBitmapFill(img).drawRect(0, 0, img.width, img.height));
			btn.x = (Configs.width - img.width) / 2 ;
			btn.y = (Configs.height - img.height) / 2;
			btn.addEventListener("click", this._click.bind(this));
			this.addChild(btn);
		}
		
		private _click(): void {
			this.navigate(new GameScene());
		}
	}
	
	export class GameScene extends Scene {
		private _score: createjs.Text;										//记录步数
		
		private _cat: Sprite;
		
		private _container: createjs.Container;
		
		private _circles: Shape[][];
		
		private _status: Game;
				
		public init(): void {
			super.init();
			this._status = Game.NONE;
			this._drawScence();
			this._drawScore();
			this._drawCat();
			this.setFPS(30);
		}
		
		private _drawScence(): void {
			this._container = new createjs.Container();
			this._container.x = 30;
			this._container.y = 70;
			this._circles = new Array();
			for (var i = 0; i < 9; i++) {
				this._circles[i] = new Array();
				for (var j = 0; j < 9; j++) {
					this._container.addChild( this._circles[i][j] = this._drawCircle(i, j));
					if (Math.random() < 0.1) {
						this._circles[i][j].setStatus(Status.SELECTED);
					}
				}		
			}
			this.addChild(this._container);
		}
		
		private _drawCircle(x: number, y: number, arg: Status = Status.NONE) {
			var cirtle = new Shape(),
				point  = new Point(x, y);
			point.setPoint(cirtle);
			cirtle.setStatus(arg);
			cirtle.addEventListener("click", this._clickEvent.bind(this));
			return cirtle;
		}
		
		private _clickEvent(event) {
			if (event.target.status != Status.NONE) {
				return;
			};
			this._score.text = (parseInt(this._score.text) + 1).toString();
			if (this._cat.point.x == 8 || this._cat.point.x == 0 || this._cat.point.y == 0 || this._cat.point.y == 8) {
				this._close();
			}
			event.target.setStatus(Status.SELECTED);
			var point = this._findPath();
			if (point) {
				this._moveCat(point);
			}
		}
		
		private _drawScore(): void {
			this._score = new createjs.Text( (0).toString() , 'bold 30px Courier New', '#ff0000');
			this._score.y = 50;
			this._score.x = 100
			this.addChild(this._score);
		}
		
		private _drawCat(): void {
			var spriteSheet = new createjs.SpriteSheet({
				"images": [Resources.getImage("cat")],
				framerate: 15,
				frames: {
					regX: 0, 
					height: 93, 
					count: 16, 
					regY: 0, 
					width: 61
				},
				animations: {
					run: [0, 15, "run", 0.5],
				}
			});
			this._cat = new Sprite(spriteSheet, "run");
			var point = undefined;
			while (true) {
				point = new Point( Math.floor(Math.random() * 4) + 2, Math.floor(Math.random() * 4) + 2 );
				if (this._circles[point.x][point.y].status == Status.NONE) {
					break;
				}
			}
			this._cat.point = point;
			this._cat.point.kind = Kind.CAT;
			this._cat.setPoint();
			this._circles[this._cat.point.x][this._cat.point.y].setStatus(Status.USED);
			this._container.addChild(this._cat);	
		}
		
		private _findPath() {
			console.log("=====开始检测=====");		
			
			var points = Array(),   //已经看过的点；
				start = Array();
			for (var i = 0; i < 9; i++) {
				if(this._circles[0][i].status != Status.SELECTED) {
					start.push(new Point(0,i));				
					points.push(new Point(0,i));				
				}
				if(this._circles[8][i].status != Status.SELECTED) {
					start.push(new Point(8,i));				
					points.push(new Point(8,i));				
				}
			}
			for (var i = 0; i < 8; i++) {
				if(this._circles[i][0].status != Status.SELECTED) {
					start.push(new Point(i,0));				
					points.push(new Point(i,0));				
				}
				if(this._circles[i][8].status != Status.SELECTED) {
					start.push(new Point(i,8));				
					points.push(new Point(i,8));				
				}
			}
			
			while (this._status == Game.NONE) {                              //从外面向里面检测是否有逃生点；
				var nexts = Array();
				for (var i = 0, len = start.length; i < len; i++) {
					var p = start[i];
					for (var j = 0; j < 6; j ++) {
						var tem = this._getNextPoint(p, j);
						if(tem.x > 8 || tem.x < 0 || tem.y < 0 || tem.y > 8) {
							continue;
						}
						if(this._circles[tem.x][tem.y].status == Status.USED) {
							return p;
						}
						if(this._circles[tem.x][tem.y].status == Status.SELECTED) {
							continue;
						}
						var b = false;
						for (var m = 0, leng = points.length; m < leng; m++) {
							if(tem.x == points[m].x && tem.y == points[m].y) {
								b = true;								
								break;
							};
						};
						
						if(b) {
							continue;
						}
						points.push(tem);
						nexts.push(tem);
					}
				}
				
				
				start = nexts;
				if(start.length <= 0) {
					this._status = Game.SURROUND;
					var spriteSheet = new createjs.SpriteSheet({
						framerate: 15,
						images: [Resources.getImage("cated")],
						frames: {
							regX: 0, 
							height: 91, 
							count: 15, 
							regY: 0, 
							width: 64
						},
						animations: {
							run: [0, 14, "run", 0.5],
						}
					});				
					this._cat.spriteSheet = spriteSheet;
					break;
				}
			}
			
			console.log("=====围住=====");
			
			points = Array();
			start = Array();
			for (var i = 0; i < 6; i++) {
				var tem = this._getNextPoint(this._cat.point, i);
				if(tem.x > 8 || tem.x < 0 || tem.y < 0 || tem.y > 8) {
					continue;
				};
				if(this._circles[tem.x][tem.y].status == Status.SELECTED) {
					continue;
				}
				tem.startPoint = tem;
				start.push(tem);
				points.push(tem);
			}
			
			if(start.length <= 0) {
				this._status = Game.END;
				this._close(true);
			}
			
			while (this._status == Game.SURROUND) {
				var nexts = Array();
				for (var i = 0; i < start.length; i++) {
					var p = start[i];
					for (var j = 0; j < 6; j ++) {
						var tem = this._getNextPoint(p, j );
						if(tem.x > 8 || tem.x < 0 || tem.y < 0 || tem.y > 8) {
							continue;
						};
						if(this._circles[tem.x][tem.y].status == Status.USED) {
							continue;
						};
						if(this._circles[tem.x][tem.y].status == Status.SELECTED) {
							continue;
						}
						var b = false;
						for (var m = 0, len = points.length; m < len; m++) {
							if(tem.x == points[m].x && tem.y == points[m].y) {
								b = true;							
								break;
							};
						};
						if(b) {
							continue;
						};
						tem.startPoint = p.startPoint;					
						nexts.push(tem);
						points.push(tem);				
					}
				}
				
				if(nexts.length <= 0) {
					return start[0].startPoint;
				}
				start = nexts;
			}
		}
		
		private _moveCat(point: Point) {
			this._circles[this._cat.point.x][this._cat.point.y].setStatus(Status.NONE);		
			this._cat.point.x = point.x;
			this._cat.point.y = point.y;
			this._cat.setPoint();
			this._circles[this._cat.point.x][this._cat.point.y].setStatus(Status.USED);			
		}
		
		private _getNextPoint(p: Point, dire: Direction = Direction.LEFT) {
			var point = new Point(p.x, p.y);
			point.kind = p.kind;
			switch (dire) {
				case Direction.LEFT:
					point.x --;
					break;
				case Direction.LEFTTOP:
					if(point.y % 2 == 0) {
						point.x --;										
					}
					point.y --;
					break;
				case Direction.RIGHTTOP:
					if(point.y % 2 == 1) {
						point.x ++;										
					}
					point.y --;
					break;
				case Direction.RIGHT:
					point.x ++;
					break;
				case Direction.RIGHTBOTTOM:
					if(point.y % 2 == 0) {
						point.x --;										
					}
					point.y ++;
					break;
				case Direction.LEFTBOTTOM:
					if(point.y % 2 == 1) {
						point.x ++;										
					}
					point.y ++;
					break;
				default:
					break;
			}
			return point;	
		}
		
		private _close(arg: boolean = false) {
			this.navigate(new EndScene(), this._score.text, arg);
		}
	}
	
	export class EndScene extends Scene {
		protected init(...args: any[]): void {
			super.init();
			this._drawScore.call(this, ...args);
			this._drawBtn();
			this.setFPS(10);
		}
		
		private _drawScore(arg: string, success: boolean = false): void {
			var text: string,
				color: string;
			if (success) {
				text  = "恭喜您，在经历" + arg + "步后终于围住了那只神经猫！";
				color = "#f00";
			} else {
				text  = "经过" + arg + "步后还是被那只神经猫逃脱了，再接再厉吧！";
				color = "#000";
			}
			var lable = new createjs.Text( text, 'bold 30px Courier New',  color);
			lable.y = Configs.height / 2 - 170;
			lable.x = Configs.width / 2 - 300;
			this.addChild(lable);
		}
		
		private _drawBtn(): void {
			var img = Resources.getImage('play'),
				btn = new createjs.Shape(new createjs.Graphics().beginBitmapFill(img).drawRect(0, 0, img.width, img.height));
			btn.x = (Configs.width - img.width) / 2 ;
			btn.y = (Configs.height - img.height) / 2;
			btn.addEventListener("click", this._click.bind(this));
			this.addChild(btn);
		}
		
		private _click(): void {
			this.navigate(new GameScene());
		}
	}
	
	export class Sprite extends createjs.Sprite {
		public point: Point;
		
		public setPoint = function() {
			this.point.setPoint(this);
		}
	}
	
	export class Shape extends createjs.Shape {
		public status: Status;
		
		public setStatus(arg: Status = Status.NONE) {
			this.status = arg;
			this.graphics.beginFill(Colors[this.status]).drawCircle( 29, 25 , 25).endFill();
		}
	}
	
	export class Configs {
		public static resources: any[] = [
			{src: "img/play.png", id: "play"},
			{src: "img/cat.png", id: "cat"},
			{src: "img/cated.png", id: "cated"}	
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
	
	enum Status {
		NONE     = 0,
		SELECTED = 1,
		USED     = 2	
	}
	
	enum Game {
		NONE     = 0,
		SURROUND = 1,
		END      = 2	
	}
	
	enum Kind {
		CIRCLE = 0,
		CAT    = 1	
	}
	
	enum Colors {
		"#999" = 0,
		"#f00" = 1,
		"#fff" = 2
	}
	enum Direction {
		LEFT        = 0,
		LEFTTOP     = 1,
		RIGHTTOP    = 2,
		RIGHT       = 3,
		RIGHTBOTTOM = 4,
		LEFTBOTTOM  = 5
	}
	
	export class Point {
		constructor(x?: number, y?: number) {
			this.value = 0;
			this.kind = Kind.CIRCLE;
			if (x != undefined && y != undefined) {
				this.x = x;
				this.y = y;
			} else if (x != undefined && y == undefined) {
				this.x = x % 9;
				this.y = x / 9;
			} else {
				this.x = 0;
				this.y = 0;
			}
		}
		
		public x: number;
		
		public y: number;
		
		public value: number;
		
		public kind: Kind;
		
		public startPoint: Point;
		
		public setPoint(...args: any[]) {
			var x: number = this.y % 2 * 29 + this.x * 58,
				y: number = this.y * 50;
			if (this.kind == Kind.CAT) {
				y -= 66;
			}
			for (var i = 0, len = args.length; i < len; i++) {
				var element = args[i];
				element.x = x;
				element.y = y;
			}
		}
	}
}
