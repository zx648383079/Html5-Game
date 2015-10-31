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
        LoadScene.prototype._fileLoad = function () {
            this._setSchedule(this._index++);
        };
        LoadScene.prototype._complete = function () {
            for (var i = 0, len = Configs.resources.length; i < len; i++) {
                var image = Configs.resources[i];
                Resources.setImage(image.id, this._loader.getResult(image.id));
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
            var img = Resources.getImage('start'), btn = new createjs.Shape(new createjs.Graphics().beginBitmapFill(img).drawRect(0, 0, img.width, img.height));
            btn.x = (Configs.width - img.width) / 2;
            btn.y = (Configs.height - img.height) / 2;
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
        }
        GameScene.prototype.init = function () {
            _super.prototype.init.call(this);
            this._time = 200;
            this._total = 100;
            this._shapes = Array();
            this._drawShip();
            this._drawScore();
            this.setFPS(30);
            this.addKeyEvent(this._keyDown.bind(this));
        };
        GameScene.prototype._draw = function () {
            var tem = Math.random(), x = Math.random() * (Configs.width - 100), speed = Math.ceil(Math.random() * 10);
            if (tem < 0.2) {
                this._drawGhost(x, speed);
            }
            else if (tem < 0.5) {
                this._drawCandy(x, speed);
            }
            else {
                this._drawPumpkin(x, speed, tem > 0.8);
            }
        };
        GameScene.prototype._drawScore = function () {
            this._score = new createjs.Text((0).toString(), 'bold 30px Courier New', '#ff0000');
            this._score.y = 50;
            this._score.x = 100;
            this.addChild(this._score);
        };
        GameScene.prototype._keyDown = function (event) {
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
        };
        GameScene.prototype._drawCandy = function (x, speed) {
            if (x === void 0) { x = 0; }
            if (speed === void 0) { speed = 1; }
            var img = Resources.getImage("candy"), shape = new Shape(new createjs.Graphics().beginBitmapFill(img).drawRect(0, 0, img.width, img.height));
            shape.setBound(x, -img.height, img.width, img.height);
            shape.name = "candy";
            shape.value = 30;
            shape.speed = speed;
            this.addChild(shape);
            this._shapes.push(shape);
        };
        GameScene.prototype._drawPumpkin = function (x, speed, big) {
            if (x === void 0) { x = 0; }
            if (speed === void 0) { speed = 1; }
            if (big === void 0) { big = false; }
            var img = Resources.getImage(big ? "pumpkinl" : "pumpkin");
            var shape = new Shape(new createjs.Graphics().beginBitmapFill(img).drawRect(0, 0, img.width, img.height));
            shape.setBound(x, -img.height, img.width, img.height);
            shape.speed = speed;
            shape.name = "pumpkin";
            shape.value = big ? 100 : 50;
            this.addChild(shape);
            this._shapes.push(shape);
        };
        GameScene.prototype._drawGhost = function (x, speed) {
            if (x === void 0) { x = 0; }
            if (speed === void 0) { speed = 1; }
            var ghostSpriteSheet = new createjs.SpriteSheet({
                "images": [Resources.getImage("ghost")],
                "frames": { "regX": 0, "height": 70, "count": 5, "regY": 0, "width": 70 },
                "animations": {
                    "run": {
                        frames: [4, 3, 2, 1, 0],
                        next: true,
                        speed: 0.2,
                    }
                }
            });
            var ghost = new Sprite(ghostSpriteSheet, "run");
            ghost.name = "ghost";
            ghost.value = -200;
            ghost.speed = speed;
            ghost.setBound(x, -70, 70, 70);
            this.addChild(ghost);
            this._shapes.push(ghost);
        };
        GameScene.prototype._drawShip = function () {
            var manSpriteSheet = new createjs.SpriteSheet({
                "images": [Resources.getImage("shap")],
                "frames": { "regX": 0, "height": 161, "count": 16, "regY": 0, "width": 147 },
                "animations": {
                    "nleft": {
                        frames: [0, 1, 2, 3],
                        next: true,
                        speed: 0.2,
                    },
                    "nright": {
                        frames: [4, 5, 6, 7],
                        next: true,
                        speed: 0.2,
                    },
                    "left": {
                        frames: [8, 9, 10, 11],
                        next: true,
                        speed: 0.2,
                    },
                    "right": {
                        frames: [12, 13, 14, 15],
                        next: true,
                        speed: 0.2,
                    },
                }
            });
            this._shap = new Person(manSpriteSheet, "nleft");
            this._shap.setBound(Configs.width / 2, Configs.height - 200, 147, 161);
            this.addChild(this._shap);
        };
        GameScene.prototype.update = function () {
            var _this = this;
            var bound = this._shap.getBound();
            bound.y += 40;
            bound.height -= 40;
            this._shapes.forEach(function (shape, i) {
                shape.y += shape.speed;
                if (_this._rectCollide(shape.getBound(), bound)) {
                    _this._total--;
                    _this._score.text = (parseInt(_this._score.text, 10) + shape.value).toString();
                    _this._shapes.splice(i, 1);
                    _this.removeChild(shape);
                }
                else if (shape.y > Configs.height) {
                    _this._shapes.splice(i, 1);
                    _this.removeChild(shape);
                }
            });
            _super.prototype.update.call(this);
            if (this._total <= 0) {
                this.navigate(new EndScene(), this._score.text);
            }
            this._time--;
            if (this._time <= 0) {
                this._draw();
                this._time = Math.random() * 60;
            }
        };
        /**
         * 矩形之间的碰撞检测
         *
         */
        GameScene.prototype._rectCollide = function (rect1, rect2) {
            return rect1.x + rect1.width > rect2.x &&
                rect1.x < rect2.x + rect2.width &&
                rect1.y + rect1.height > rect2.y &&
                rect1.y < rect2.y + rect2.height;
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
            var img = Resources.getImage('restart'), btn = new createjs.Shape(new createjs.Graphics().beginBitmapFill(img).drawRect(0, 0, img.width, img.height));
            btn.x = (Configs.width - img.width) / 2;
            btn.y = (Configs.height - img.height) / 2;
            btn.addEventListener("click", this._click.bind(this));
            this.addChild(btn);
        };
        EndScene.prototype._click = function () {
            this.navigate(new GameScene());
        };
        return EndScene;
    })(Scene);
    Zodream.EndScene = EndScene;
    var Sprite = (function (_super) {
        __extends(Sprite, _super);
        function Sprite() {
            _super.apply(this, arguments);
        }
        Sprite.prototype.setBound = function (x, y, width, height) {
            if (x instanceof Bound) {
                this.x = x.x;
                this.y = x.y;
                this._width = x.width;
                this._height = x.height;
            }
            else {
                this.x = x;
                this.y = y;
                this._width = width;
                this._height = height;
            }
        };
        Sprite.prototype.getBound = function () {
            return new Bound(this.x, this.y, this._width, this._height);
        };
        return Sprite;
    })(createjs.Sprite);
    Zodream.Sprite = Sprite;
    var Person = (function (_super) {
        __extends(Person, _super);
        function Person() {
            _super.apply(this, arguments);
        }
        Person.prototype.animation = function (arg) {
            if (arg != this.currentAnimation) {
                this.gotoAndPlay(arg);
            }
            else {
                switch (arg) {
                    case "nleft":
                    case "left":
                        if (this.x > 10) {
                            this.x -= 10;
                        }
                        break;
                    case "nright":
                    case "right":
                        if (this.x < Configs.width - this._width) {
                            this.x += 10;
                        }
                        break;
                    default:
                        break;
                }
            }
        };
        return Person;
    })(Sprite);
    Zodream.Person = Person;
    var Shape = (function (_super) {
        __extends(Shape, _super);
        function Shape() {
            _super.apply(this, arguments);
        }
        Shape.prototype.setBound = function (x, y, width, height) {
            if (x instanceof Bound) {
                this.x = x.x;
                this.y = x.y;
                this._width = x.width;
                this._height = x.height;
            }
            else {
                this.x = x;
                this.y = y;
                this._width = width;
                this._height = height;
            }
        };
        Shape.prototype.getBound = function () {
            return new Bound(this.x, this.y, this._width, this._height);
        };
        return Shape;
    })(createjs.Shape);
    Zodream.Shape = Shape;
    var Configs = (function () {
        function Configs() {
        }
        Configs.resources = [
            { src: "img/candy.png", id: "candy" },
            { src: "img/ghost.png", id: "ghost" },
            { src: "img/pumpkin.png", id: "pumpkin" },
            { src: "img/pumpkin_l.png", id: "pumpkinl" },
            { src: "img/shap.png", id: "shap" },
            { src: "img/start.png", id: "start" },
            { src: "img/restart.png", id: "restart" },
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
    var Bound = (function () {
        function Bound(x, y, width, height) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }
        return Bound;
    })();
    Zodream.Bound = Bound;
})(Zodream || (Zodream = {}));
//# sourceMappingURL=zodream.js.map