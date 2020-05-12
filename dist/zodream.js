"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var Point = (function () {
    function Point(x, y) {
        this.value = 0;
        this.kind = Kind.CIRCLE;
        if (x != undefined && y != undefined) {
            this.x = x;
            this.y = y;
        }
        else if (x != undefined && y == undefined) {
            this.x = x % 9;
            this.y = x / 9;
        }
        else {
            this.x = 0;
            this.y = 0;
        }
    }
    Point.prototype.setPoint = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var x = this.y % 2 * 29 + this.x * 58, y = this.y * 50;
        if (this.kind == Kind.CAT) {
            y -= 66;
        }
        for (var i = 0, len = args.length; i < len; i++) {
            var element = args[i];
            element.x = x;
            element.y = y;
        }
    };
    return Point;
}());
var Resources = (function () {
    function Resources() {
    }
    Resources.setImage = function (id, img) {
        this.images[id] = img;
    };
    Resources.getImage = function (id) {
        if (this.images[id] == undefined) {
            throw id + ':img load failure';
        }
        ;
        return this.images[id];
    };
    Resources.sounds = function (id) {
        createjs.Sound.play(id);
    };
    Resources.images = {};
    Resources.models = [];
    return Resources;
}());
var Scene = (function () {
    function Scene(stage) {
        var arg = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            arg[_i - 1] = arguments[_i];
        }
        if (stage == undefined) {
            return;
        }
        this.setStage(stage);
        this.init.apply(this, arg);
    }
    Scene.prototype.init = function () {
        var _arg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _arg[_i] = arguments[_i];
        }
    };
    Scene.prototype.navigating = function (_before) {
        var _param = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            _param[_i - 1] = arguments[_i];
        }
    };
    Scene.prototype.navigated = function (_before) {
        var _param = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            _param[_i - 1] = arguments[_i];
        }
    };
    Scene.prototype.setStage = function (arg) {
        var param = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            param[_i - 1] = arguments[_i];
        }
        if (arg instanceof Program) {
            this.stage = arg.getStage();
        }
        this.stage = arg instanceof Program ? arg.getStage() : arg;
        this.init.apply(this, param);
    };
    Scene.prototype.addEvent = function (name, func) {
        this.stage.addEventListener(name, func);
    };
    Scene.prototype.addKeyEvent = function (func) {
        return window.addEventListener('keydown', func);
    };
    Scene.prototype.addChild = function () {
        var _a;
        var arg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            arg[_i] = arguments[_i];
        }
        (_a = this.stage).addChild.apply(_a, arg);
    };
    Scene.prototype.removeChild = function () {
        var _a;
        var arg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            arg[_i] = arguments[_i];
        }
        (_a = this.stage).removeChild.apply(_a, arg);
    };
    Scene.prototype.setFPS = function (fps, mode) {
        if (fps === void 0) { fps = 60; }
        if (mode === void 0) { mode = createjs.Ticker.RAF_SYNCHED; }
        createjs.Ticker.timingMode = mode;
        createjs.Ticker.framerate = fps;
        createjs.Ticker.addEventListener('tick', this.update.bind(this));
    };
    Scene.prototype.update = function () {
        this.stage.update();
    };
    Scene.prototype.close = function () {
        this.stage.removeAllChildren();
    };
    Scene.prototype.navigate = function (arg) {
        var _a;
        var param = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            param[_i - 1] = arguments[_i];
        }
        if (this.application) {
            (_a = this.application).navigate.apply(_a, __spreadArrays([arg, this], param));
            return;
        }
        this.close();
        arg.setStage.apply(arg, __spreadArrays([this.stage], param));
    };
    return Scene;
}());
var Shape = (function (_super) {
    __extends(Shape, _super);
    function Shape() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.status = Status.NONE;
        return _this;
    }
    Shape.prototype.setStatus = function (arg) {
        if (arg === void 0) { arg = Status.NONE; }
        this.status = arg;
        this.graphics.beginFill(Colors[this.status]).drawCircle(29, 25, 25).endFill();
    };
    return Shape;
}(createjs.Shape));
var Sprite = (function (_super) {
    __extends(Sprite, _super);
    function Sprite() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.point = new Point(0, 0);
        _this.setPoint = function () {
            this.point.setPoint(this);
        };
        return _this;
    }
    return Sprite;
}(createjs.Sprite));
var Status;
(function (Status) {
    Status[Status["NONE"] = 0] = "NONE";
    Status[Status["SELECTED"] = 1] = "SELECTED";
    Status[Status["USED"] = 2] = "USED";
})(Status || (Status = {}));
var Game;
(function (Game) {
    Game[Game["NONE"] = 0] = "NONE";
    Game[Game["SURROUND"] = 1] = "SURROUND";
    Game[Game["END"] = 2] = "END";
})(Game || (Game = {}));
var Kind;
(function (Kind) {
    Kind[Kind["CIRCLE"] = 0] = "CIRCLE";
    Kind[Kind["CAT"] = 1] = "CAT";
})(Kind || (Kind = {}));
var Colors;
(function (Colors) {
    Colors[Colors["#999"] = 0] = "#999";
    Colors[Colors["#f00"] = 1] = "#f00";
    Colors[Colors["#fff"] = 2] = "#fff";
})(Colors || (Colors = {}));
var Direction;
(function (Direction) {
    Direction[Direction["LEFT"] = 0] = "LEFT";
    Direction[Direction["LEFTTOP"] = 1] = "LEFTTOP";
    Direction[Direction["RIGHTTOP"] = 2] = "RIGHTTOP";
    Direction[Direction["RIGHT"] = 3] = "RIGHT";
    Direction[Direction["RIGHTBOTTOM"] = 4] = "RIGHTBOTTOM";
    Direction[Direction["LEFTBOTTOM"] = 5] = "LEFTBOTTOM";
})(Direction || (Direction = {}));
var PLAY_IMG = 'play';
var CAT_IMG = 'cat';
var CATED_IMG = 'cated';
var EndScene = (function (_super) {
    __extends(EndScene, _super);
    function EndScene() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EndScene.prototype.init = function () {
        var _a;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        _super.prototype.init.call(this);
        (_a = this._drawScore).call.apply(_a, __spreadArrays([this], args));
        this._drawBtn();
        this.setFPS(10);
    };
    EndScene.prototype._drawScore = function (arg, success) {
        if (arg === void 0) { arg = 0; }
        if (success === void 0) { success = false; }
        var _args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            _args[_i - 2] = arguments[_i];
        }
        var text, color;
        if (success) {
            text = '恭喜您，在经历' + arg + '步后终于围住了那只神经猫！';
            color = '#f00';
        }
        else {
            text = '经过' + arg + '步后还是被那只神经猫逃脱了，再接再厉吧！';
            color = '#000';
        }
        var lable = new createjs.Text(text, 'bold 30px Courier New', color);
        lable.y = Configs.height / 2 - 170;
        lable.x = Configs.width / 2 - 300;
        this.addChild(lable);
    };
    EndScene.prototype._drawBtn = function () {
        var img = Resources.getImage(PLAY_IMG);
        var btn = new createjs.Shape(new createjs.Graphics().beginBitmapFill(img).drawRect(0, 0, img.width, img.height));
        btn.x = (Configs.width - img.width) / 2;
        btn.y = (Configs.height - img.height) / 2;
        btn.addEventListener('click', this._click.bind(this));
        this.addChild(btn);
    };
    EndScene.prototype._click = function () {
        this.navigate(new GameScene());
    };
    return EndScene;
}(Scene));
var GameScene = (function (_super) {
    __extends(GameScene, _super);
    function GameScene() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GameScene.prototype.init = function () {
        _super.prototype.init.call(this);
        this._status = Game.NONE;
        this._drawScence();
        this._drawScore();
        this._drawCat();
        this.setFPS(30);
    };
    GameScene.prototype._drawScence = function () {
        this._container = new createjs.Container();
        this._container.x = 30;
        this._container.y = 70;
        this._circles = new Array();
        for (var i = 0; i < 9; i++) {
            this._circles[i] = new Array();
            for (var j = 0; j < 9; j++) {
                this._container.addChild(this._circles[i][j] = this._drawCircle(i, j));
                if (Math.random() < 0.1) {
                    this._circles[i][j].setStatus(Status.SELECTED);
                }
            }
        }
        this.addChild(this._container);
    };
    GameScene.prototype._drawCircle = function (x, y, arg) {
        if (arg === void 0) { arg = Status.NONE; }
        var cirtle = new Shape(), point = new Point(x, y);
        point.setPoint(cirtle);
        cirtle.setStatus(arg);
        cirtle.addEventListener('click', this._clickEvent.bind(this));
        return cirtle;
    };
    GameScene.prototype._clickEvent = function (event) {
        if (event.target.status != Status.NONE) {
            return;
        }
        ;
        this._score.text = (parseInt(this._score.text) + 1).toString();
        if (this._cat.point.x == 8 || this._cat.point.x == 0 || this._cat.point.y == 0 || this._cat.point.y == 8) {
            this._close();
        }
        event.target.setStatus(Status.SELECTED);
        var point = this._findPath();
        if (point) {
            this._moveCat(point);
        }
    };
    GameScene.prototype._drawScore = function () {
        this._score = new createjs.Text((0).toString(), 'bold 30px Courier New', '#ff0000');
        this._score.y = 50;
        this._score.x = 100;
        this.addChild(this._score);
    };
    GameScene.prototype._drawCat = function () {
        var spriteSheet = new createjs.SpriteSheet({
            'images': [Resources.getImage(CAT_IMG)],
            framerate: 15,
            frames: {
                regX: 0,
                height: 93,
                count: 16,
                regY: 0,
                width: 61
            },
            animations: {
                run: [0, 15, 'run', 0.5],
            }
        });
        this._cat = new Sprite(spriteSheet, 'run');
        var point = undefined;
        while (true) {
            point = new Point(Math.floor(Math.random() * 4) + 2, Math.floor(Math.random() * 4) + 2);
            if (this._circles[point.x][point.y].status == Status.NONE) {
                break;
            }
        }
        this._cat.point = point;
        this._cat.point.kind = Kind.CAT;
        this._cat.setPoint();
        this._circles[this._cat.point.x][this._cat.point.y].setStatus(Status.USED);
        this._container.addChild(this._cat);
    };
    GameScene.prototype._findPath = function () {
        console.log('=====开始检测=====');
        var points = Array(), start = Array();
        for (var i = 0; i < 9; i++) {
            if (this._circles[0][i].status != Status.SELECTED) {
                start.push(new Point(0, i));
                points.push(new Point(0, i));
            }
            if (this._circles[8][i].status != Status.SELECTED) {
                start.push(new Point(8, i));
                points.push(new Point(8, i));
            }
        }
        for (var i = 0; i < 8; i++) {
            if (this._circles[i][0].status != Status.SELECTED) {
                start.push(new Point(i, 0));
                points.push(new Point(i, 0));
            }
            if (this._circles[i][8].status != Status.SELECTED) {
                start.push(new Point(i, 8));
                points.push(new Point(i, 8));
            }
        }
        while (this._status == Game.NONE) {
            var nexts = Array();
            for (var i = 0, len = start.length; i < len; i++) {
                var p = start[i];
                for (var j = 0; j < 6; j++) {
                    var tem = this._getNextPoint(p, j);
                    if (tem.x > 8 || tem.x < 0 || tem.y < 0 || tem.y > 8) {
                        continue;
                    }
                    if (this._circles[tem.x][tem.y].status == Status.USED) {
                        return p;
                    }
                    if (this._circles[tem.x][tem.y].status == Status.SELECTED) {
                        continue;
                    }
                    var b = false;
                    for (var m = 0, leng = points.length; m < leng; m++) {
                        if (tem.x == points[m].x && tem.y == points[m].y) {
                            b = true;
                            break;
                        }
                        ;
                    }
                    ;
                    if (b) {
                        continue;
                    }
                    points.push(tem);
                    nexts.push(tem);
                }
            }
            start = nexts;
            if (start.length <= 0) {
                this._status = Game.SURROUND;
                var spriteSheet = new createjs.SpriteSheet({
                    framerate: 15,
                    images: [Resources.getImage(CATED_IMG)],
                    frames: {
                        regX: 0,
                        height: 91,
                        count: 15,
                        regY: 0,
                        width: 64
                    },
                    animations: {
                        run: [0, 14, 'run', 0.5],
                    }
                });
                this._cat.spriteSheet = spriteSheet;
                break;
            }
        }
        console.log('=====围住=====');
        points = Array();
        start = Array();
        for (var i = 0; i < 6; i++) {
            var tem = this._getNextPoint(this._cat.point, i);
            if (tem.x > 8 || tem.x < 0 || tem.y < 0 || tem.y > 8) {
                continue;
            }
            ;
            if (this._circles[tem.x][tem.y].status == Status.SELECTED) {
                continue;
            }
            tem.startPoint = tem;
            start.push(tem);
            points.push(tem);
        }
        if (start.length <= 0) {
            this._status = Game.END;
            this._close(true);
        }
        while (this._status == Game.SURROUND) {
            var nexts = Array();
            for (var i = 0; i < start.length; i++) {
                var p = start[i];
                for (var j = 0; j < 6; j++) {
                    var tem = this._getNextPoint(p, j);
                    if (tem.x > 8 || tem.x < 0 || tem.y < 0 || tem.y > 8) {
                        continue;
                    }
                    ;
                    if (this._circles[tem.x][tem.y].status == Status.USED) {
                        continue;
                    }
                    ;
                    if (this._circles[tem.x][tem.y].status == Status.SELECTED) {
                        continue;
                    }
                    var b = false;
                    for (var m = 0, len = points.length; m < len; m++) {
                        if (tem.x == points[m].x && tem.y == points[m].y) {
                            b = true;
                            break;
                        }
                        ;
                    }
                    ;
                    if (b) {
                        continue;
                    }
                    ;
                    tem.startPoint = p.startPoint;
                    nexts.push(tem);
                    points.push(tem);
                }
            }
            if (nexts.length <= 0) {
                return start[0].startPoint;
            }
            start = nexts;
        }
    };
    GameScene.prototype._moveCat = function (point) {
        this._circles[this._cat.point.x][this._cat.point.y].setStatus(Status.NONE);
        this._cat.point.x = point.x;
        this._cat.point.y = point.y;
        this._cat.setPoint();
        this._circles[this._cat.point.x][this._cat.point.y].setStatus(Status.USED);
    };
    GameScene.prototype._getNextPoint = function (p, dire) {
        if (dire === void 0) { dire = Direction.LEFT; }
        var point = new Point(p.x, p.y);
        point.kind = p.kind;
        switch (dire) {
            case Direction.LEFT:
                point.x--;
                break;
            case Direction.LEFTTOP:
                if (point.y % 2 == 0) {
                    point.x--;
                }
                point.y--;
                break;
            case Direction.RIGHTTOP:
                if (point.y % 2 == 1) {
                    point.x++;
                }
                point.y--;
                break;
            case Direction.RIGHT:
                point.x++;
                break;
            case Direction.RIGHTBOTTOM:
                if (point.y % 2 == 0) {
                    point.x--;
                }
                point.y++;
                break;
            case Direction.LEFTBOTTOM:
                if (point.y % 2 == 1) {
                    point.x++;
                }
                point.y++;
                break;
            default:
                break;
        }
        return point;
    };
    GameScene.prototype._close = function (arg) {
        if (arg === void 0) { arg = false; }
        this.navigate(new EndScene(), this._score.text, arg);
    };
    return GameScene;
}(Scene));
var LoadScene = (function (_super) {
    __extends(LoadScene, _super);
    function LoadScene() {
        return _super !== null && _super.apply(this, arguments) || this;
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
            this._rect = new createjs.Shape(new createjs.Graphics().beginFill('#ffffff').drawRect(0, 0, 400, 30));
            this.addChild(this._rect, this._lable);
        }
        this._lable.text = this._index.toString();
        this._rect.graphics.beginFill('#ff0000').drawRect(0, 0, this._index * 10, 30);
    };
    LoadScene.prototype._images = function () {
        this._loader = new createjs.LoadQueue(true);
        this._loader.addEventListener('complete', this._complete.bind(this));
        this._loader.addEventListener('fileload', this._fileLoad.bind(this));
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
}(Scene));
var MainScene = (function (_super) {
    __extends(MainScene, _super);
    function MainScene() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MainScene.prototype.init = function () {
        _super.prototype.init.call(this);
        this._drawBtn();
        this.setFPS(10);
    };
    MainScene.prototype._drawBtn = function () {
        var img = Resources.getImage(PLAY_IMG);
        var btn = new createjs.Shape(new createjs.Graphics().beginBitmapFill(img).drawRect(0, 0, img.width, img.height));
        btn.x = (Configs.width - img.width) / 2;
        btn.y = (Configs.height - img.height) / 2;
        btn.addEventListener('click', this._click.bind(this));
        this.addChild(btn);
    };
    MainScene.prototype._click = function () {
        this.navigate(new GameScene());
    };
    return MainScene;
}(Scene));
var Configs = (function () {
    function Configs() {
    }
    Configs.resources = [
        { src: 'img/play.png', id: PLAY_IMG },
        { src: 'img/cat.png', id: CAT_IMG },
        { src: 'img/cated.png', id: CATED_IMG }
    ];
    Configs.width = window.innerWidth;
    Configs.height = window.innerHeight;
    return Configs;
}());
var App = (function () {
    function App() {
    }
    App.main = function (arg) {
        var app = new Program(arg);
        app.setTouch();
        app.setSize(Configs.width, Configs.height);
        app.init();
        return app;
    };
    return App;
}());
var Program = (function () {
    function Program(arg) {
        this.stage = new createjs.Stage(arg);
    }
    Program.prototype.setTouch = function () {
        createjs.Touch.enable(this.stage);
    };
    Program.prototype.getStage = function () {
        return this.stage;
    };
    Program.prototype.setSize = function (width, height) {
        this.stage.canvas.width = width;
        this.stage.canvas.height = height;
    };
    Program.prototype.init = function () {
        this.navigate(new LoadScene());
    };
    Program.prototype.navigate = function (page, before) {
        var param = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            param[_i - 2] = arguments[_i];
        }
        page.navigating.apply(page, __spreadArrays([before], param));
        if (before) {
            before.close();
        }
        page.setStage.apply(page, __spreadArrays([this], param));
        this.scene = page;
        page.navigated.apply(page, __spreadArrays([before], param));
        return this;
    };
    Program.prototype.update = function () {
        this.scene.update();
    };
    return Program;
}());
