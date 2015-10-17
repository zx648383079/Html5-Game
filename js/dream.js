var zodream = function( canvas) {
	return new zodream.fn(canvas, arguments[1] || {});
};

zodream.fn = function( canvas, option) {
	this.settings = this.extend(this.default, option);
	this.init(canvas);
};

zodream.fn.prototype = {
	default: {
		cat: "",
	},
	init: function(canvas) {
		this.stage = new createjs.Stage(canvas);
		createjs.Touch.enable(this.stage);
		this.loadAsset();
	},
	loadAsset: function() {
		
	},
	loadScence: function() {
		
	},
	loadShip: function() {
		this.ship = new createjs.Bitmap(this.assets[1]);
		this.ship.x = 0;
		this,ship.y = 0;
		this.stage.addChild(this.ship);			
	},
	loadText: function() {
		
	},
	start: function() {
		this.loadScence();
		createjs.Ticker.setFPS(30);
		createjs.Ticker.addEventListener('tick', this.stage );
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