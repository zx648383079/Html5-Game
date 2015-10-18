var zodream = function( canvas) {
	return new zodream.fn(canvas, arguments[1] || {});
};

zodream.fn = function( canvas, option) {
	this.settings = this.extend(this.default, option);
	this.init(canvas);
};

zodream.extend = function() {
	for (var i = 0, len = arguments.length; i < len; i++) {
		var arg = arguments[i];
		for (var key in arg) {
			if (arg.hasOwnProperty(key)) {
				this[key] = arg[key];
			};
		};
	};
};

zodream.point = function() {
	this.x = 0;
	this.y = 0;
	this.value = 0;
	this.kind = zodream.kind.CIRCLE;
	if(arguments[0] != undefined && arguments[1] != undefined) {
		this.x = arguments[0];
		this.y = arguments[1];
	}else if(arguments[0] != undefined && arguments[1] == undefined) {
		this.x = arguments[0] % 9;
		this.y = parseInt(arguments[0] / 9);
	}
};

zodream.point.prototype = {
	setPoint: function() {
		var point = this.getPoint();
		for (var i = 0, len = arguments.length; i < len; i++) {
			var element = arguments[i];
			element.x = point.x;
			element.y = point.y;
		}
	},
	getPoint: function() {
		var point = new Object;
		point.x = this.y % 2 * 29 + this.x * 58;	
		point.y = this.y * 50 ;			
		if(this.kind == zodream.kind.CAT) {
			point.y -= 66;
		}
		return point;
	}
};

zodream.extend({
	status: {
		NONE : 0,
		SELECTED: 1,
		USED: 2	
	},
	game: {
		NONE: 0,
		SURROUND: 1,
		END: 2	
	},
	kind: {
		CIRCLE: 0,
		CAT: 1	
	},
	colors: [
		"#999",
		"#f00",
		"#fff"
	],
	direction: {
		LEFT: 0,
		LEFTTOP: 1,
		RIGHTTOP: 2,
		RIGHT: 3,
		RIGHTBOTTOM: 4,
		LEFTBOTTOM: 5
	}
});

zodream.fn.prototype = {
	default: {
		cat: {
			framerate: 15,
			images: [
				"img/cat.png"
			],
			frames: {
				regX: 0, 
				height: 93, 
				count: 16, 
				regY: 0, 
				width: 61
			},
			animations: {
				run: [0, 15, "run", 1],
			}
		},
		cated: {
			framerate: 15,
			images: [
				"img/cated.png"
			],
			frames: {
				regX: 0, 
				height: 91, 
				count: 15, 
				regY: 0, 
				width: 64
			},
			animations: {
				run: [0, 14, "run", 1],
			}
		}
	},
	init: function(canvas) {
		this.stage = new createjs.Stage(canvas);
		createjs.Touch.enable(this.stage);
		this.loadScence();
		this.loadCat();
		this.status = zodream.game.NONE;
		createjs.Ticker.setFPS(30);
		createjs.Ticker.addEventListener('tick', this.stage );
	},
	loadScence: function() {
		this.container = new createjs.Container();
		this.container.x = 30;
		this.container.y = 70;
		this.circle = Array();
		for (var i = 0; i < 9; i++) {
			this.circle[i] = Array();
			for (var j = 0; j < 9; j++) {
				this.container.addChild( this.circle[i][j] = this.drawCircle( i , j ) );
				if(Math.random() < 0.1) {
					this.circle[i][j].setStatus(zodream.status.SELECTED);
				}
			}		
		}
		this.stage.addChild(this.container);
	},
	drawCircle: function() {
		var cirtle = new createjs.Shape();
		this.setPoint.call( cirtle, arguments[0] , arguments[1]);
		cirtle.setStatus = function() {
			this.status = arguments[0] || zodream.status.NONE;
			this.graphics.beginFill(zodream.colors[this.status]).drawCircle( 29, 25 , 25).endFill();
		};
		cirtle.setStatus(arguments[2] || zodream.status.NONE);
		cirtle.addEventListener("click", this.clickEvent.bind(this));
		
		return cirtle;
	},
	clickEvent: function(event) {
		if(event.target.status != zodream.status.NONE) {
			return;
		};
		if(this.cat.point.x == 8 || this.cat.point.x == 0 || this.cat.point.y == 0 || this.cat.point.y == 8) {
			alert("你输了！");
			return;
		}
		event.target.setStatus(zodream.status.SELECTED);
		var point = this.findPath();
		if(point) {
			this.moveCat(point);
		}
	},
	loadCat: function() {
		var spriteSheet = new createjs.SpriteSheet(this.default.cat);
		this.cat = new createjs.Sprite(spriteSheet, "run");
		var point = undefined;
		while (true) {
			 point = new zodream.point( Math.floor(Math.random() * 4) + 2, Math.floor(Math.random() * 4) + 2 );
			 if(this.circle[point.x][point.y].status == zodream.status.NONE) {
				break;
			}
		}
		this.cat.point = point;
		this.cat.setPoint = function() {
			this.point.setPoint(this);
		};
		this.cat.point.kind = zodream.kind.CAT;
		this.cat.setPoint();
		this.circle[this.cat.point.x][this.cat.point.y].setStatus(zodream.status.USED);
		this.container.addChild(this.cat);			
	},
	findPath: function() {
		console.log("=====开始检测=====");		
		
		var points = Array(),   //已经看过的点；
			start = Array();
		
		for (var i = 0; i < 9; i++) {
			if(this.circle[0][i].status != zodream.status.SELECTED) {
				start.push(new zodream.point(0,i));				
				points.push(new zodream.point(0,i));				
			}
			if(this.circle[8][i].status != zodream.status.SELECTED) {
				start.push(new zodream.point(8,i));				
				points.push(new zodream.point(8,i));				
			}
		}
		for (var i = 1; i < 8; i++) {
			if(this.circle[i][0].status != zodream.status.SELECTED) {
				start.push(new zodream.point(i,0));				
				points.push(new zodream.point(i,0));				
			}
			if(this.circle[i][8].status != zodream.status.SELECTED) {
				start.push(new zodream.point(i,8));				
				points.push(new zodream.point(i,8));				
			}
		}
		
		while (this.status == zodream.game.NONE) {                              //从外面向里面检测是否有逃生点；
			var nexts = Array();
			for (var i = 0; i < start.length; i++) {
				var p = start[i];
				for (var j = 0; j < 6; j++) {
					var tem = this.getNextPoint(p, j);
					if(tem.x > 8 || tem.x < 0 || tem.y < 0 || tem.y > 8) {
						continue;
					}
					if(this.circle[tem.x][tem.y].status == zodream.status.USED) {
						return p;
					}
					if(this.circle[tem.x][tem.y].status == zodream.status.SELECTED) {
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
					}
					points.push(tem);
					nexts.push(tem);
				}
			}
			
			start = nexts;
			if(start.length <= 0) {
				this.status = zodream.game.SURROUND;
				var spriteSheet = new createjs.SpriteSheet(this.default.cated);				
				this.cat.spriteSheet = spriteSheet;
				break;
			}
		}
		
		console.log("=====围住=====");
		
		points = Array();
		start = Array();
		for (var i = 0; i < 6; i++) {
			var tem = this.getNextPoint(this.cat.point, i);
			if(tem.x > 8 || tem.x < 0 || tem.y < 0 || tem.y > 8) {
				continue;
			};
			if(this.circle[tem.x][tem.y].status == zodream.status.SELECTED) {
				continue;
			}
			tem.startPoint = tem;
			start.push(tem);
			points.push(tem);
		}
		
		if(start.length <= 0) {
			this.status = zodream.game.END;
			alert("游戏结束！");
			return;
		}
		
		while (this.status == zodream.game.SURROUND) {
			var nexts = Array();
			for (var i = 0; i < start.length; i++) {
				var p = start[i];
				for (var j = 0; j < 6; j++) {
					var tem = this.getNextPoint(p, j);
					if(tem.x > 8 || tem.x < 0 || tem.y < 0 || tem.y > 8) {
						continue;
					};
					if(this.circle[tem.x][tem.y].status == zodream.status.USED) {
						continue;
					};
					if(this.circle[tem.x][tem.y].status == zodream.status.SELECTED) {
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
	},
	inArray: function(obj, arr) {
		for (var i = 0, len = arr.length; i < len; i++) {
			if(arr[i] === obj) {
				return true;
			}
		}
		return false;
	},
	setPoint: function(x, y) {
		this.point = new zodream.point(x, y);
		this.point.setPoint(this);
	},
	moveCat: function(point) {
		this.circle[this.cat.point.x][this.cat.point.y].setStatus(zodream.status.NONE);		
		this.cat.point.x = point.x;
		this.cat.point.y = point.y;
		this.cat.setPoint();
		this.circle[this.cat.point.x][this.cat.point.y].setStatus(zodream.status.USED);			
	},
	getNextPoint: function(p) {
		var point = new zodream.point(p.x, p.y);
		point.kind = p.kind;
		switch (arguments[1] || zodream.direction.LEFT) {
			case zodream.direction.LEFT:
				point.x --;
				break;
			case zodream.direction.LEFTTOP:
				if(point.y % 2 == 0) {
					point.x --;										
				}
				point.y --;
				break;
			case zodream.direction.RIGHTTOP:
				if(point.y % 2 == 1) {
					point.x ++;										
				}
				point.y --;
				break;
			case zodream.direction.RIGHT:
				point.y ++;
				break;
			case zodream.direction.RIGHTBOTTOM:
				if(point.y % 2 == 1) {
					point.x ++;										
				}
				point.y ++;
				break;
			case zodream.direction.LEFTBOTTOM:
				if(point.y % 2 == 0) {
					point.x --;										
				}
				point.y ++;
				break;
			default:
				break;
		}
		return point;	
	},
	loadText: function() {
		
	},
	extend: function( obj ) {
		for (var i = 1, len = arguments.length; i < len; i++) {
			var arg = arguments[i];
			for (var key in arg) {
				if (arg.hasOwnProperty(key)) {
					obj[key] = arg[key];
				};
			};
		};
		return obj;
	},
};