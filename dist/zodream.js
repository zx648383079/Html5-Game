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
        createjs.Ticker.reset();
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
var BITS_OF_WOOD_IMG = 'bits';
var BOOMERANG_IMG = 'boomerang';
var TARGET_IMG = 'target';
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
            text = '恭喜您，获得' + arg + '分！';
            color = '#f00';
        }
        else {
            text = '您的得分为' + arg + '，再接再厉吧！';
            color = '#000';
        }
        var lable = new createjs.Text(text, 'bold 30px Courier New', color);
        lable.y = Configs.height / 2 - 170;
        lable.x = Configs.width / 2 - 300;
        this.addChild(lable);
    };
    EndScene.prototype._drawBtn = function () {
        var btn = new createjs.Text('START GAME', 'bold 30px Courier New', '#000');
        btn.x = (Configs.width - 30) / 2;
        btn.y = (Configs.height - 60) / 2;
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
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.targetBooms = [];
        _this.rotationSpeed = 1;
        _this.isShooting = false;
        _this._level = 1;
        _this._amount = 9;
        _this._score = 0;
        _this.events = {};
        return _this;
    }
    Object.defineProperty(GameScene.prototype, "level", {
        get: function () {
            return this._level;
        },
        set: function (v) {
            this._level = v;
            this.trigger('level');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameScene.prototype, "amount", {
        get: function () {
            return this._amount;
        },
        set: function (v) {
            this._amount = v;
            this.trigger('amount');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameScene.prototype, "score", {
        get: function () {
            return this._score;
        },
        set: function (v) {
            this._score = v;
            this.trigger('score');
        },
        enumerable: true,
        configurable: true
    });
    GameScene.prototype.init = function () {
        _super.prototype.init.call(this);
        this.createAmount();
        this.createLevel();
        this.createScore();
        this.createBoom();
        this.createTarget();
        this.setFPS();
    };
    GameScene.prototype.update = function () {
        this.targetBox.rotation += this.rotationSpeed;
        _super.prototype.update.call(this);
    };
    GameScene.prototype.nextLevel = function () {
        this.level++;
        this.amount = Math.max(1, 9 + Math.floor(this.level / 10 - 1));
        this.rotationSpeed = this.level % 3 === 0 && Math.random() < 0.1 ? this.rotationSpeed * -1 : this.rotationSpeed;
        for (var _i = 0, _a = this.targetBooms; _i < _a.length; _i++) {
            var item = _a[_i];
            this.targetBox.removeChild(item.boom);
        }
        this.targetBooms = [];
        var random = Math.floor(Math.random() * this.level);
        if (random >= this.level / 2) {
            this.amount -= Math.floor(Math.random() * this.level / 2 + 1);
        }
        for (var i = 1; i < random; i++) {
            var r = Math.floor(Math.random() * 180);
            r = Math.random() < .5 ? r * -1 : r;
            this.trigger('boom.hit', r);
        }
        this.trigger('boom.reset');
    };
    GameScene.prototype.shoot = function () {
        var _this = this;
        if (this.isShooting || this.amount < 1) {
            return;
        }
        this.isShooting = true;
        this.amount--;
        createjs.Tween.get(this.boom)
            .to({
            y: 350
        }, 150, createjs.Ease.cubicIn)
            .call(function () {
            var rotation = _this.targetBox.rotation % 360;
            if (rotation < 0) {
                rotation = 360 + rotation;
            }
            if (_this.hasBoom(rotation)) {
                _this.flickBoom();
                return;
            }
            _this.woodBits();
            var x = _this.targetBox.x;
            var y = _this.targetBox.y;
            createjs.Tween.get(_this.targetBox)
                .to({ x: x - 6, y: y - 7 }, 20, createjs.Ease.bounceInOut)
                .to({ x: x, y: y }, 20, createjs.Ease.bounceInOut)
                .call(function () {
                if (_this.amount < 1) {
                    _this.nextLevel();
                    return;
                }
                _this.trigger('boom.reset');
            });
            _this.boom.alpha = 0;
            _this.trigger('boom.hit', rotation);
            _this.score++;
        });
    };
    GameScene.prototype.flickBoom = function () {
        var _this = this;
        createjs.Tween.get(this.boom)
            .to({ x: Configs.width + 100, y: Configs.height + 100, rotation: 720 }, 700, createjs.Ease.bounceOut)
            .call(function () {
            _this.navigate(new EndScene(), _this.score);
        });
    };
    GameScene.prototype.hasBoom = function (rotation) {
        for (var _i = 0, _a = this.targetBooms; _i < _a.length; _i++) {
            var item = _a[_i];
            if (rotation > item.rotation - 10 && rotation < item.rotation + 10) {
                return true;
            }
            if (Math.abs(rotation - item.rotation) > 350) {
                return true;
            }
        }
        return false;
    };
    GameScene.prototype.woodBits = function () {
        var _this = this;
        var img = Resources.getImage(BITS_OF_WOOD_IMG);
        if (!img) {
            throw 'img load failure';
        }
        var bit = new createjs.Shape(new createjs.Graphics().beginBitmapFill(img).drawRect(0, 0, img.width, img.height));
        var scale = 5 / img.width;
        bit.scaleX = bit.scaleY = scale;
        var maxWidth = Configs.width;
        var maxHeight = Configs.height;
        bit.x = maxWidth / 2 - 1;
        bit.y = 250;
        var _loop_1 = function (i) {
            var bitNew = bit.clone();
            this_1.addChild(bitNew);
            var random = Math.floor(Math.random() * maxWidth * 2);
            random = Math.random() < .5 ? random * -1 : random;
            createjs.Tween.get(bitNew)
                .to({ x: random, y: maxHeight }, 500, createjs.Ease.sineOut)
                .call(function () {
                _this.removeChild(bitNew);
            });
        };
        var this_1 = this;
        for (var i = 0; i < 4; i++) {
            _loop_1(i);
        }
    };
    GameScene.prototype.createTarget = function () {
        var _this = this;
        var bgImg = Resources.getImage(TARGET_IMG);
        if (!bgImg) {
            throw 'img load failure';
        }
        var img = Resources.getImage(BOOMERANG_IMG);
        if (!img) {
            throw 'img load failure';
        }
        var bg = new createjs.Shape(new createjs.Graphics().beginBitmapFill(bgImg).drawRect(0, 0, bgImg.width, bgImg.height));
        var height = 200, scale = height / bgImg.height;
        var boomOut = 50;
        bg.y = bg.x = boomOut;
        bg.scaleX = bg.scaleY = scale;
        this.targetBox = new createjs.Container();
        this.targetBox.addChild(bg);
        this.targetBox.y = 250;
        this.targetBox.regX = 150;
        this.targetBox.regY = 150;
        this.targetBox.x = Configs.width / 2;
        this.addChild(this.targetBox);
        this.targetBox.setChildIndex(bg, 100);
        var boomHeight = 100, boomScale = boomHeight / img.height;
        var minWidth = boomScale * img.width;
        var boom = new createjs.Shape(new createjs.Graphics().beginBitmapFill(img).drawRect(0, 0, img.width, img.height));
        boom.scaleX = boom.scaleY = boomScale;
        boom.regY = 0;
        boom.regX = minWidth + 5;
        boom.y = 200;
        boom.x = 150;
        this.on('boom.hit', function (rotation) {
            var boomNew = boom.clone();
            var deg = -rotation * Math.PI / 180;
            boomNew.x = 150 - 50 * Math.sin(deg);
            boomNew.y = 150 + 50 * Math.cos(deg);
            boomNew.rotation = -rotation;
            _this.targetBox.addChild(boomNew);
            _this.targetBooms.push({ boom: boomNew, rotation: rotation });
            _this.targetBox.setChildIndex(boomNew, 0);
        });
    };
    GameScene.prototype.createBoom = function () {
        var _this = this;
        var img = Resources.getImage(BOOMERANG_IMG);
        if (!img) {
            throw 'img load failure';
        }
        this.boom = new createjs.Shape(new createjs.Graphics().beginBitmapFill(img).drawRect(0, 0, img.width, img.height));
        var height = 100, scale = height / img.height;
        this.boom.scaleY = this.boom.scaleX = scale;
        var x = (Configs.width - img.width * scale) / 2;
        var y = Configs.height - 100 - height;
        this.boom.x = x;
        this.boom.y = y;
        this.addChild(this.boom);
        this.boom.addEventListener('click', this.shoot.bind(this));
        this.on('boom.reset', function () {
            _this.boom.x = x;
            _this.boom.y = y;
            _this.boom.rotation = 0;
            _this.boom.alpha = 1;
            _this.isShooting = false;
        });
    };
    GameScene.prototype.createScore = function () {
        var _this = this;
        var text = new createjs.Text('得分', "20px Arial", '#fff');
        var score = new createjs.Text(this.score.toString(), "20px Arial", '#fff');
        var bg = new createjs.Shape(new createjs.Graphics().beginFill('gray').drawRect(0, 0, 80, 60));
        text.y = 5;
        score.x = text.x = 40;
        score.y = 30;
        score.textAlign = text.textAlign = 'center';
        this.scoreBox = new createjs.Container();
        this.scoreBox.addChild(bg, text, score);
        this.scoreBox.y = 20;
        this.scoreBox.x = Configs.width / 2 - 40;
        this.addChild(this.scoreBox);
        this.on('score', function () {
            score.text = _this.score.toString();
        });
    };
    GameScene.prototype.createLevel = function () {
        var _this = this;
        var label = function () { return '第 ' + _this.level + ' 关'; };
        var text = new createjs.Text(label(), "20px Arial", '#fff');
        var bg = new createjs.Shape(new createjs.Graphics().beginFill('gray').drawRect(0, 0, 100, 30));
        text.y = 5;
        text.x = 50;
        text.textAlign = 'center';
        this.levelBox = new createjs.Container();
        this.levelBox.addChild(bg, text);
        this.levelBox.y = 20;
        this.addChild(this.levelBox);
        this.on('level', function () {
            text.text = label();
        });
    };
    GameScene.prototype.createAmount = function () {
        var _this = this;
        var label = function () { return 'x' + _this.amount; };
        var text = new createjs.Text(label(), "20px Arial", "#000");
        var img = Resources.getImage(BOOMERANG_IMG);
        if (!img) {
            throw 'img load failure';
        }
        var boom = new createjs.Shape(new createjs.Graphics().beginBitmapFill(img).drawRect(0, 0, img.width, img.height));
        var height = 50, scale = height / img.height;
        boom.scaleY = boom.scaleX = scale;
        text.x = img.width * scale + 10;
        text.y = height / 2 - 5;
        this.amountBox = new createjs.Container();
        this.amountBox.addChild(text, boom);
        this.amountBox.x = 20;
        this.amountBox.y = Configs.height - 100 - height;
        this.addChild(this.amountBox);
        this.on('amount', function () {
            text.text = label();
        });
    };
    GameScene.prototype.on = function (event, callback) {
        this.events[event] = callback;
        return this;
    };
    GameScene.prototype.hasEvent = function (event) {
        return this.events.hasOwnProperty(event);
    };
    GameScene.prototype.trigger = function (event) {
        var _a;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (!this.hasEvent(event)) {
            return;
        }
        return (_a = this.events[event]).call.apply(_a, __spreadArrays([this], args));
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
        this.navigate(new GameScene());
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
        var btn = new createjs.Text('START GAME', 'bold 30px Courier New', '#000');
        btn.x = (Configs.width - 30) / 2;
        btn.y = (Configs.height - 60) / 2;
        btn.addEventListener('click', this._click.bind(this));
        this.addChild(btn);
    };
    MainScene.prototype._click = function () {
        this.navigate(new MainScene());
    };
    return MainScene;
}(Scene));
var Configs = (function () {
    function Configs() {
    }
    Configs.resources = [
        { src: 'img/bits.png', id: BITS_OF_WOOD_IMG },
        { src: 'img/boomerang.png', id: BOOMERANG_IMG },
        { src: 'img/target.png', id: TARGET_IMG }
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
