///<reference path="createjs/createjs.d.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Zodream;
(function (Zodream) {
    var App = (function () {
        function App() {
        }
        App.main = function (arg) {
            var app = new Zodream.Program(arg);
            app.setTouch();
            app.setSize(Configs.width, Configs.height);
            app.init();
            return app;
        };
        return App;
    })();
    Zodream.App = App;
    var Program = (function () {
        function Program(arg) {
            this.stage = new createjs.Stage(arg);
        }
        Program.prototype.setTouch = function () {
            createjs.Touch.enable(this.stage);
        };
        Program.prototype.setSize = function (width, height) {
            this.stage.canvas.width = width;
            this.stage.canvas.height = height;
        };
        Program.prototype.init = function () {
            new LoadScene(this.stage);
        };
        return Program;
    })();
    Zodream.Program = Program;
    var Scene = (function () {
        function Scene(stage) {
            var arg = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                arg[_i - 1] = arguments[_i];
            }
            if (stage != undefined) {
                this.stage = stage;
                this.init.apply(this, arg);
            }
        }
        Scene.prototype.init = function () {
            var arg = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                arg[_i - 0] = arguments[_i];
            }
        };
        Scene.prototype.setStage = function (arg) {
            var param = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                param[_i - 1] = arguments[_i];
            }
            this.stage = arg;
            this.init.apply(this, param);
        };
        Scene.prototype.addEvent = function (name, func) {
            this.stage.addEventListener(name, func);
        };
        Scene.prototype.addKeyEvent = function (func) {
            return window.addEventListener("keydown", func);
        };
        Scene.prototype.addChild = function () {
            var arg = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                arg[_i - 0] = arguments[_i];
            }
            (_a = this.stage).addChild.apply(_a, arg);
            var _a;
        };
        Scene.prototype.removeChild = function () {
            var arg = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                arg[_i - 0] = arguments[_i];
            }
            (_a = this.stage).removeChild.apply(_a, arg);
            var _a;
        };
        Scene.prototype.setFPS = function (fps, mode) {
            if (fps === void 0) { fps = 60; }
            if (mode === void 0) { mode = createjs.Ticker.RAF_SYNCHED; }
            createjs.Ticker.timingMode = mode;
            createjs.Ticker.setFPS(fps);
            createjs.Ticker.addEventListener('tick', this.update.bind(this));
        };
        Scene.prototype.update = function () {
            this.stage.update();
        };
        Scene.prototype.close = function () {
            createjs.Ticker.removeAllEventListeners();
            this.stage.removeAllChildren();
        };
        Scene.prototype.navigate = function (arg) {
            var param = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                param[_i - 1] = arguments[_i];
            }
            this.close();
            arg.setStage.apply(arg, [this.stage].concat(param));
        };
        return Scene;
    })();
    Zodream.Scene = Scene;
    var LoadScene = (function (_super) {
        __extends(LoadScene, _super);
        function LoadScene() {
            _super.apply(this, arguments);
        }
        LoadScene.prototype.init = function () {
            _super.prototype.init.call(this);
            this._index = 0;
            this._images();
            this.setFPS(10);
        };
        LoadScene.prototype._setSchedule = function (num) {
            if (num === void 0) { num = 0; }
            if (this._lable === undefined) {
                this._lable = new createjs.Text(num.toString(), 'bold 14px Courier New', '#000000');
                this._lable.y = 10;
                this._rect = new createjs.Shape(new createjs.Graphics().beginFill("#ffffff").drawRect(0, 0, 400, 30));
                this.addChild(this._rect, this._lable);
            }
            this._lable.text = this._index.toString();
            this._rect.graphics.beginFill("#ff0000").drawRect(0, 0, this._index * 10, 30);
        };
        LoadScene.prototype._images = function () {
            this._loader = new createjs.LoadQueue(true);
            this._loader.addEventListener("complete", this._complete.bind(this));
            this._loader.addEventListener("fileload", this._fileLoad.bind(this));
            this._loader.loadManifest(Configs.resources);
            this._loader.getResult();
        };
        LoadScene.prototype._sounds = function () {
            createjs.Sound.alternateExtensions = ["mp3"];
            var preload = new createjs.LoadQueue(true);
            preload.installPlugin(createjs.Sound);
            preload.loadManifest(Configs.sounds);
        };
        LoadScene.prototype._fileLoad = function () {
            this._setSchedule(this._index++);
        };
        LoadScene.prototype._complete = function () {
            for (var i = 0, len = Configs.resources.length; i < len; i++) {
                var image = Configs.resources[i];
                if (image.id == "model") {
                    Resources.models = this._loader.getResult(image.id);
                }
                else {
                    Resources.setImage(image.id, this._loader.getResult(image.id));
                }
            }
            this.navigate(new MainScene());
        };
        return LoadScene;
    })(Scene);
    Zodream.LoadScene = LoadScene;
    var MainScene = (function (_super) {
        __extends(MainScene, _super);
        function MainScene() {
            _super.apply(this, arguments);
        }
        MainScene.prototype.init = function () {
            _super.prototype.init.call(this);
            this._drawBtn();
            this.setFPS(10);
        };
        MainScene.prototype._drawBtn = function () {
            var btn = new createjs.Shape(new createjs.Graphics().beginFill("#ff0000").drawRect(0, 0, 100, 50));
            btn.x = Configs.width / 2;
            btn.y = Configs.height / 2;
            btn.addEventListener("click", this._click.bind(this));
            this.addChild(btn);
        };
        MainScene.prototype._click = function () {
            this.navigate(new GameScene());
        };
        return MainScene;
    })(Scene);
    Zodream.MainScene = MainScene;
    var GameScene = (function (_super) {
        __extends(GameScene, _super);
        function GameScene() {
            _super.apply(this, arguments);
            this._count = Math.ceil(Configs.width / 80) + 1;
        }
        GameScene.prototype.init = function () {
            _super.prototype.init.call(this);
            this._stones = new Array();
            this._coins = new Array();
            this._index = 0;
            this._drawSky();
            this._drawShip();
            this._drawScore();
            for (var i = 0; i < this._count; i++) {
                this._draw(i * 80);
            }
            this.setFPS(30);
            this.addKeyEvent(this._keyDown.bind(this));
        };
        GameScene.prototype._drawScore = function () {
            this._score = new createjs.Text((0).toString(), 'bold 30px Courier New', '#ff0000');
            this._score.y = 50;
            this._score.x = 100;
            this.addChild(this._score);
        };
        GameScene.prototype._draw = function (x) {
            switch (Resources.models[0][this._index]) {
                case 3:
                    this._drawCoin(new Point(x + 15, 300));
                case 0:
                    break;
                case 4:
                    this._drawCoin(new Point(x + 15, 300));
                case 1:
                    this._drawStone(new Point(x, 200));
                    break;
                case 5:
                    this._drawCoin(new Point(x + 15, 350));
                case 2:
                    this._drawStone(new Point(x, 250), Resources.getImage("high"));
                    break;
                default:
                    break;
            }
            this._index++;
        };
        GameScene.prototype._keyDown = function (event) {
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
        };
        GameScene.prototype._drawSky = function (arg) {
            if (arg === void 0) { arg = Resources.getImage("bg"); }
            var sky = new createjs.Shape();
            sky.graphics.beginBitmapFill(arg).drawRect(0, 0, Configs.width, Configs.height);
            sky.setTransform(0, 0, 1, Configs.height / arg.height);
            this.addChild(sky);
        };
        GameScene.prototype._drawShip = function () {
            var manSpriteSheet = new createjs.SpriteSheet({
                "images": [Resources.getImage("man")],
                "frames": { "regX": 0, "height": 64, "count": 66, "regY": 1, "width": 64 },
                "animations": {
                    "stop": {
                        frames: [65],
                        next: "stop",
                        speed: 0.2,
                    },
                    "run": {
                        frames: [21, 20, 19, 18, 17, 16, 15, 14, 13, 12],
                        next: "run",
                        speed: 0.4,
                    },
                    "jump": {
                        frames: [33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43],
                        next: "stop",
                        speed: 0.1,
                    },
                    "die": {
                        frames: [8, 7, 6, 5, 4, 3, 2, 1, 0],
                        next: "die",
                        speed: 0.3,
                    }
                }
            });
            this._shap = new Person(manSpriteSheet, "run");
            this._shap.framerate = 13;
            this._shap.setBounds(0, 264, 64, 64);
            this._shap.energy = 100;
            this.addChild(this._shap);
        };
        GameScene.prototype._drawCoin = function (point, arg) {
            if (arg === void 0) { arg = Resources.getImage("coin"); }
            var coin = new Coin();
            coin.graphics.beginBitmapFill(arg).drawRect(0, 0, 50, 50);
            coin.setBounds(point, 50, 50);
            this.addChild(coin);
            this._coins.push(coin);
        };
        GameScene.prototype._drawStone = function (point, arg) {
            if (arg === void 0) { arg = Resources.getImage("ground"); }
            var stone = new Shape();
            stone.graphics.beginBitmapFill(arg).drawRect(0, 0, 80, arg.height);
            stone.setBounds(point, 80, 200);
            stone.scaleY = stone.point.y / arg.height;
            this.addChild(stone);
            this._stones.push(stone);
        };
        GameScene.prototype.update = function () {
            var _this = this;
            var bound = this._shap.getBounds(), distance = this._shap.x - Configs.width / 2;
            if (distance < 0 || this._index >= Resources.models[0].length) {
                distance = 0;
            }
            bound.x += 10;
            bound.width -= 20;
            this._stones.forEach(function (stone, i) {
                if (bound.x + bound.width == stone.x && stone.y < bound.y + bound.height) {
                    _this._shap.energy = 0;
                }
                var right = stone.x + stone.getBounds().width;
                if (((bound.x > stone.x &&
                    bound.x < right) ||
                    (bound.x + bound.width > stone.x &&
                        bound.x + bound.width < right)) &&
                    bound.y + bound.height >= stone.y) {
                    _this._shap.canDown = false;
                    _this._shap.isSuspeed = false;
                }
                if (right < 0) {
                    _this._draw(_this._count * 80 + stone.x);
                    _this.removeChild(stone);
                    _this._stones.splice(i, 1);
                }
                else {
                    stone.x -= distance;
                }
            });
            this._coins.forEach(function (coin, i) {
                if (coin.x <= 20 && coin.y <= 20) {
                    _this._score.text = (parseInt(_this._score.text) + 50).toString();
                    _this.removeChild(coin);
                    _this._coins.splice(i, 1);
                }
                if (_this._collide(bound, coin.getBounds())) {
                    coin.move();
                }
                if (coin.x + coin.getBounds().width < 0) {
                    _this.removeChild(coin);
                    _this._coins.splice(i, 1);
                }
                else {
                    coin.x -= distance;
                }
            });
            this._shap.x -= distance;
            this._shap.move();
            _super.prototype.update.call(this);
            if (this._shap.point.y <= 0) {
                this.navigate(new EndScene(), this._score.text);
            }
        };
        GameScene.prototype._collide = function (rect, ball) {
            var centerX = ball.x + ball.width / 2, centerY = ball.y + ball.height / 2, radius = Math.min(ball.width, ball.height) / 2, rectCenterX = rect.x + rect.width / 2, rectCenterY = rect.y + rect.height / 2;
            return (Math.abs(centerX - rectCenterX) <= radius + rect.width / 2 &&
                centerY <= rect.y && centerY >= rect.y + rect.height) ||
                (Math.abs(centerY - rectCenterY) <= radius + rect.height / 2 &&
                    centerX >= rect.x && centerX <= rect.x + rect.width);
        };
        return GameScene;
    })(Scene);
    Zodream.GameScene = GameScene;
    var EndScene = (function (_super) {
        __extends(EndScene, _super);
        function EndScene() {
            _super.apply(this, arguments);
        }
        EndScene.prototype.init = function (arg) {
            _super.prototype.init.call(this);
            this._drawScore(arg);
            this._drawBtn();
            this.setFPS(10);
        };
        EndScene.prototype._drawScore = function (arg) {
            var lable = new createjs.Text(arg, 'bold 30px Courier New', '#ff0000');
            lable.y = Configs.height / 2 - 50;
            lable.x = Configs.width / 2 + 30;
            this.addChild(lable);
        };
        EndScene.prototype._drawBtn = function () {
            var btn = new Shape(new createjs.Graphics().beginFill("#ff0000").drawRect(0, 0, 100, 50));
            btn.x = Configs.width / 2;
            btn.y = Configs.height / 2;
            btn.addEventListener("click", this._click.bind(this));
            this.addChild(btn);
        };
        EndScene.prototype._click = function () {
            this.navigate(new GameScene());
        };
        return EndScene;
    })(Scene);
    Zodream.EndScene = EndScene;
    var Person = (function (_super) {
        __extends(Person, _super);
        function Person() {
            _super.apply(this, arguments);
            this.speed = 2;
            this._energy = 0;
            this.gravity = 2;
            this._lift = 0;
            this.isSuspeed = true;
            this.canDown = true;
        }
        Object.defineProperty(Person.prototype, "point", {
            get: function () {
                this._point.setWorld(this.x, this.y);
                return this._point;
            },
            set: function (arg) {
                this._point = arg;
                var val = arg.getWorld();
                this.x = val.x;
                this.y = val.y;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Person.prototype, "size", {
            get: function () {
                return this._size;
            },
            set: function (arg) {
                this._size = arg;
            },
            enumerable: true,
            configurable: true
        });
        Person.prototype.setBounds = function (x, y, width, height) {
            if (x instanceof Point) {
                this.point = x;
                if (y instanceof Size) {
                    this.size = y;
                }
                else {
                    this.size = new Size(y, width);
                }
            }
            else {
                this.point = new Point(x, y);
                if (width instanceof Size) {
                    this.size = width;
                }
                else {
                    this.size = new Size(width, height);
                }
            }
        };
        Person.prototype.getBounds = function () {
            return {
                x: this.x,
                y: this.y,
                width: this.size.width,
                height: this.size.height
            };
        };
        Object.defineProperty(Person.prototype, "energy", {
            get: function () {
                return this._energy;
            },
            set: function (arg) {
                if (this._energy >= 0 && arg > 0) {
                    this._energy += arg;
                }
                else if ((this._energy > 0 && arg <= 0) || (this._energy < 0 && arg >= 0)) {
                    this._energy = arg;
                }
                else if (this._energy <= 0 && arg < 0) {
                    this._energy += arg;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Person.prototype, "lift", {
            get: function () {
                return this._lift;
            },
            set: function (arg) {
                if (!this.isSuspeed) {
                    this._lift += arg;
                    this.isSuspeed = true;
                }
            },
            enumerable: true,
            configurable: true
        });
        Person.prototype.animation = function (arg) {
            if (arg != this.currentAnimation) {
                this.gotoAndPlay(arg);
            }
        };
        Person.prototype.move = function () {
            if (this._lift > 0) {
                this.animation("jump");
                this.y -= this.gravity;
                this._lift -= this.gravity;
                if (this._lift <= 0) {
                    this._lift = 0;
                    this.animation("stop");
                }
            }
            if (this._energy > 0) {
                if (this.currentAnimation == "stop") {
                    this.animation("run");
                }
                this.x += this.speed;
                this._energy -= this.speed;
                if (this._energy <= 0) {
                    this._energy = 0;
                    this.animation("stop");
                }
            }
            else if (this._energy < 0) {
                this.x -= this.speed;
                this._energy += this.speed;
                if (this._energy >= 0) {
                    this._energy = 0;
                    this.animation("stop");
                }
            }
            if (this.canDown && this._lift == 0) {
                this.y += this.gravity;
            }
            this.canDown = true;
        };
        return Person;
    })(createjs.Sprite);
    Zodream.Person = Person;
    var Shape = (function (_super) {
        __extends(Shape, _super);
        function Shape() {
            _super.apply(this, arguments);
        }
        Object.defineProperty(Shape.prototype, "point", {
            get: function () {
                this._point.setWorld(this.x, this.y);
                return this._point;
            },
            set: function (arg) {
                this._point = arg;
                var val = arg.getWorld();
                this.x = val.x;
                this.y = val.y;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Shape.prototype, "size", {
            get: function () {
                return this._size;
            },
            set: function (arg) {
                this._size = arg;
            },
            enumerable: true,
            configurable: true
        });
        Shape.prototype.setBounds = function (x, y, width, height) {
            if (x instanceof Point) {
                this.point = x;
                if (y instanceof Size) {
                    this.size = y;
                }
                else {
                    this.size = new Size(y, width);
                }
            }
            else {
                this.point = new Point(x, y);
                if (width instanceof Size) {
                    this.size = width;
                }
                else {
                    this.size = new Size(width, height);
                }
            }
        };
        Shape.prototype.getBounds = function () {
            return {
                x: this.x,
                y: this.y,
                width: this.size.width,
                height: this.size.height
            };
        };
        return Shape;
    })(createjs.Shape);
    Zodream.Shape = Shape;
    var Coin = (function (_super) {
        __extends(Coin, _super);
        function Coin() {
            _super.apply(this, arguments);
        }
        Coin.prototype.move = function (arg) {
            if (arg === void 0) { arg = new Point(20, Configs.height - 20); }
            createjs.Tween.get(this).to({ x: arg.getWorld().x, y: arg.getWorld().y }, 2000);
        };
        return Coin;
    })(Shape);
    Zodream.Coin = Coin;
    var Configs = (function () {
        function Configs() {
        }
        Configs.resources = [
            { src: "img/man.png", id: "man" },
            { src: "img/ground.png", id: "ground" },
            { src: "img/bg.png", id: "bg" },
            { src: "img/high.jpg", id: "high" },
            { src: "img/coin.png", id: "coin" },
            { src: "js/game.json", id: "model" }
        ];
        Configs.width = window.innerWidth;
        Configs.height = window.innerHeight;
        return Configs;
    })();
    Zodream.Configs = Configs;
    var Resources = (function () {
        function Resources() {
        }
        Resources.setImage = function (id, img) {
            this.images[id] = img;
        };
        Resources.getImage = function (id) {
            if (this.images[id] == undefined)
                return null;
            return this.images[id];
        };
        Resources.sounds = function (id) {
            createjs.Sound.play(id);
        };
        Resources.images = {};
        Resources.models = [];
        return Resources;
    })();
    Zodream.Resources = Resources;
    var Point = (function () {
        function Point(x, y) {
            this.x = x;
            this.y = y;
        }
        Point.prototype.setLocal = function (x, y) {
            this.x = x;
            this.y = y;
        };
        Point.prototype.getLocal = function () {
            return this;
        };
        Point.prototype.setWorld = function (x, y) {
            this.x = x;
            this.y = Configs.height - y;
        };
        Point.prototype.getWorld = function () {
            return {
                x: this.x,
                y: Configs.height - this.y
            };
        };
        return Point;
    })();
    Zodream.Point = Point;
    var Size = (function () {
        function Size(width, height) {
            this.width = width;
            this.height = height;
        }
        return Size;
    })();
    Zodream.Size = Size;
})(Zodream || (Zodream = {}));
//# sourceMappingURL=zodream.js.map