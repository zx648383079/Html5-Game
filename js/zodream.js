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
            return new LoadScene(this.stage);
        };
        return Program;
    })();
    Zodream.Program = Program;
    var Scene = (function () {
        function Scene(arg) {
            this.stage = arg;
            this.init();
        }
        Scene.prototype.init = function () {
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
                this.stage.addChild(this._rect, this._lable);
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
                Resources.images[image.id] = this._loader.getResult(image.id);
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
            var btn = new createjs.Shape(new createjs.Graphics().beginFill("#ff0000").drawRect(0, 0, 100, 50));
            btn.x = Configs.width / 2;
            btn.y = Configs.height / 2;
            btn.addEventListener("click", this._click.bind(this));
            this.stage.addChild(btn);
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
            this._drawSky();
        };
        GameScene.prototype._drawSky = function () {
            var sky = new createjs.Shape(), bg = Resources.images["bg"];
            sky.graphics.beginBitmapFill(bg).drawRect(0, 0, Configs.width, Configs.height);
            sky.setTransform(0, 0, 1, Configs.height / bg.height);
            console.log(bg);
            this.stage.addChild(sky);
        };
        return GameScene;
    })(Scene);
    Zodream.GameScene = GameScene;
    var EndScene = (function (_super) {
        __extends(EndScene, _super);
        function EndScene() {
            _super.apply(this, arguments);
        }
        return EndScene;
    })(Scene);
    Zodream.EndScene = EndScene;
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
        Configs.sounds = {};
        Configs.width = window.innerWidth;
        Configs.height = window.innerHeight;
        return Configs;
    })();
    Zodream.Configs = Configs;
    var Resources = (function () {
        function Resources() {
        }
        Resources.sounds = function (id) {
            createjs.Sound.play(id);
        };
        Resources.images = new Object();
        return Resources;
    })();
    Zodream.Resources = Resources;
    var Point = (function () {
        function Point(x, y) {
            this.x = x;
            this.y = y;
        }
        return Point;
    })();
    Zodream.Point = Point;
})(Zodream || (Zodream = {}));
