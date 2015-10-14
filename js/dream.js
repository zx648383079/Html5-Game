var zodream = function( canvas) {
	return new zodream.fn(canvas, arguments[1] || {});
};

zodream.fn = function( canvas, option) {
	this.settings = this.extend(this.default, option);
	this.init(canvas);
};

zodream.fn.prototype = {
	default: {
		images: [
			{
				id: "bg",
				src: "img/bg.png"
			},
			{
				id: "mo",
				src: "img/mo.png"
			}
		],
		size: {
			width: window.innerWidth,
			height: window.innerHeight
		}
	},
	init: function(canvas) {
		this.stage = new createjs.Stage(canvas);
		createjs.Touch.enable(this.stage);
		this.stage.canvas.width = this.settings.size.width;
		this.stage.canvas.height = this.settings.size.height;
		this.assets = Array();
		this.loadAsset();
	},
	loadSound: function() {
		createjs.Sound.alternateExtensions = ["mp3"];
		var preload = new createjs.LoadQueue(true);
		preload.installPlugin(createjs.Sound);
		preload.loadManifest();
		createjs.Sound.play("id");
	},
	loadAsset: function() {
		var preload = new createjs.LoadQueue(true);
		preload.addEventListener("fileload", this.loadAssetComplete.bind(this));
		//preload.loadFile();
		preload.loadManifest(this.settings.images);
	},
	loadScence: function() {
		this.scence = new createjs.Shape();
		this.scence.graphics.beginBitmapFill(this.assets[0], "no-repeat")
			.drawRect(0, -this.assets[0].height, 
			 this.settings.size.width, this.settings.size.height + this.assets[0].height);
		this.stage.addChild(this.scence);
	},
	loadShip: function() {
		this.ship = new createjs.Bitmap(this.assets[1]);
		this.ship.x = 0;
		this.ship.y = 0;
		this.stage.addChild(this.ship);			
	},
	loadText: function() {
		new createjs.Text('0', 'bold 14px Courier New', '#FFFFFF');
		new createjs.Container();
		addChid();	
	},
	loadAssetComplete: function(event) {
		this.assets.push(event.result);
		if(this.assets.length == this.settings.images.length) {
			this.start();
		}
	},
	addEvent: function() {
		this.stage.on('mousedown', function (evt) {
			this.ship.y -= 2;
		}.bind(this));	
	},
	start: function() {
		this.loadScence();
		this.loadShip();
		this.addEvent();
		console.log(this.stage);
		createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED; //createjs.Ticker.RAF
		createjs.Ticker.setFPS(60);
		createjs.Ticker.addEventListener('tick', this.update.bind(this));
		//createjs.Tween.get(target).wait(500).to({alpha:0, visible:false}, 1000).call(handleComplete);	
	},
	move: function() {
		for (var i = 0, len = arguments.length; i < len; i++) {
			var arg = arguments[i];
			if(arg.power.x > 0)
			{
				arg.x -= arg.speed.x;
				arg.power.x -= arg.speed.x;
			}
			if(arg.power.y > 0)
			{
				arg.y -= arg.speed.y;
				arg.power.y -= arg.speed.y;
			}
		};
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
	update: function() {
		
		this.stage.update();
	}
};