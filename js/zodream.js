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
            this.stage = stage;
            this.init.apply(this, arg);
        }
        Scene.prototype.init = function () {
            var arg = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                arg[_i - 0] = arguments[_i];
            }
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
            (_a = this.stage.addChild).call.apply(_a, [this.stage].concat(arg));
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
            this.images();
            this.setFPS(10);
        };
        LoadScene.prototype.setSchedule = function (num) {
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
        LoadScene.prototype.images = function () {
            this._loader = new createjs.LoadQueue(true);
            this._loader.addEventListener("complete", this.complete.bind(this));
            this._loader.addEventListener("fileload", this.fileLoad.bind(this));
            this._loader.loadManifest(Configs.images);
            this._loader.getResult();
        };
        LoadScene.prototype.sounds = function () {
            createjs.Sound.alternateExtensions = ["mp3"];
            var preload = new createjs.LoadQueue(true);
            preload.installPlugin(createjs.Sound);
            preload.loadManifest(Configs.sounds);
        };
        LoadScene.prototype.fileLoad = function () {
            this.setSchedule(this._index++);
        };
        LoadScene.prototype.complete = function () {
            this.close();
            for (var i = 0, len = Configs.images.length; i < len; i++) {
                var image = Configs.images[i];
                Resources.setImage(image.id, this._loader.getResult(image.id));
            }
            new MainScene(this.stage);
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
            this.close();
            new GameScene(this.stage);
        };
        return MainScene;
    })(Scene);
    Zodream.MainScene = MainScene;
    var GameScene = (function (_super) {
        __extends(GameScene, _super);
        function GameScene() {
            _super.apply(this, arguments);
        }
        GameScene.prototype.init = function () {
            _super.prototype.init.call(this);
            this._stones = new Array();
            this._drawSky();
            this._drawShip();
            this._drawStone();
            this.setFPS(30);
            this.addKeyEvent(this._keyDown.bind(this));
        };
        GameScene.prototype._keyDown = function (event) {
            switch (event.keyCode) {
                case 39:
                    this._shap.animation("run");
                    this._shap.energy = 60;
                    break;
                case 32:
                    this._shap.animation("jump");
                    this._shap.lift += 50;
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
        GameScene.prototype._drawStone = function (arg, i) {
            if (arg === void 0) { arg = Resources.getImage("ground"); }
            if (i === void 0) { i = 0; }
            var stone = new Shape();
            stone.graphics.beginBitmapFill(arg).drawRect(0, 0, arg.width, arg.height);
            stone.setBounds(arg.width * i, 200, arg.width, 200);
            stone.scaleY = stone.point.y / arg.height;
            this.addChild(stone);
            this._stones.push(stone);
        };
        GameScene.prototype.update = function () {
            var _this = this;
            var bound = this._shap.getBounds();
            this._stones.forEach(function (stone) {
                if (bound.x + bound.width >= stone.x && stone.y < bound.y + bound.height) {
                    _this._shap.energy = 0;
                }
                var right = stone.x + stone.getBounds().width;
                if (((bound.x > stone.x &&
                    bound.x < right) ||
                    (bound.x + bound.width > stone.x &&
                        bound.x + bound.width < right)) &&
                    bound.y + bound.height >= stone.y) {
                    _this._shap.canDown = false;
                }
            });
            if (this._shap.point.y <= 0) {
                this.close();
                return new EndScene(this.stage, 0);
            }
            this._shap.move();
            _super.prototype.update.call(this);
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
            this._score = arg;
            this._drawScore();
            this._drawBtn();
            this.setFPS(10);
        };
        EndScene.prototype._drawScore = function () {
            var lable = new createjs.Text(this._score.toString(), 'bold 14px Courier New', '#000000');
            lable.y = 10;
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
            this.close();
            new GameScene(this.stage);
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
            this.lift = 0;
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
        Person.prototype.animation = function (arg) {
            if (arg != this.currentAnimation) {
                this.gotoAndPlay(arg);
            }
        };
        Person.prototype.move = function () {
            if (this.lift > 0) {
                this.animation("jump");
                this.y -= this.gravity;
                this.lift -= this.gravity;
                if (this.lift <= 0) {
                    this.lift = 0;
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
            if (this.canDown && this.lift == 0) {
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
    var Configs = (function () {
        function Configs() {
        }
        Configs.images = [
            { src: "img/man.png", id: "man" },
            { src: "img/ground.png", id: "ground" },
            { src: "img/bg.png", id: "bg" },
            { src: "img/high.jpg", id: "high" },
            { src: "img/coins.png", id: "coin" }
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