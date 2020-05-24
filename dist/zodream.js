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
var Ball = (function () {
    function Ball(x, y, radius) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (radius === void 0) { radius = 0; }
        this.x = x;
        this.y = y;
        this.radius = radius;
    }
    return Ball;
}());
var Bound = (function () {
    function Bound(x, y, width, height) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (width === void 0) { width = 0; }
        if (height === void 0) { height = 0; }
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    return Bound;
}());
var Point = (function () {
    function Point(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
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
        this.y = y;
    };
    Point.prototype.getWorld = function () {
        return {
            x: this.x,
            y: this.y
        };
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
        this.eventDispatcher = new createjs.EventDispatcher();
        this.keyListener = [];
        if (stage == undefined) {
            return;
        }
        this.setStage(stage);
        this.init.apply(this, arg);
    }
    Object.defineProperty(Scene.prototype, "width", {
        get: function () {
            return this.stage.canvas.width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Scene.prototype, "height", {
        get: function () {
            return this.stage.canvas.height;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Scene.prototype, "size", {
        get: function () {
            return { width: this.width, height: this.height };
        },
        enumerable: true,
        configurable: true
    });
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
            this.application = arg;
        }
        this.stage = arg instanceof Program ? arg.getStage() : arg;
        this.init.apply(this, param);
    };
    Scene.prototype.addEvent = function (name, func) {
        this.stage.addEventListener(name, func);
    };
    Scene.prototype.addKeyEvent = function (func) {
        this.keyListener.push(func);
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
        var func = this.update.bind(this);
        createjs.Ticker.addEventListener('tick', func);
        this.on(EVENT_SCENE_CLOSE, function () {
            createjs.Ticker.removeEventListener('tick', func);
        });
    };
    Scene.prototype.update = function () {
        this.stage.update();
    };
    Scene.prototype.resize = function () {
        this.update();
    };
    Scene.prototype.close = function () {
        this.eventDispatcher.removeAllEventListeners();
        this.stage.removeAllChildren();
        this.keyListener.forEach(function (item) {
            window.removeEventListener('keydown', item);
        });
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
    Scene.prototype.on = function (event, callback) {
        var _this = this;
        this.eventDispatcher.addEventListener(event, function (obj) {
            callback.call.apply(callback, __spreadArrays([_this], obj.data));
        });
        return this;
    };
    Scene.prototype.trigger = function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (this.eventDispatcher.hasEventListener(event)) {
            var eventObj = new createjs.Event(event, false, true);
            eventObj.data = args;
            this.eventDispatcher.dispatchEvent(eventObj);
        }
        return this;
    };
    return Scene;
}());
var Shape = (function (_super) {
    __extends(Shape, _super);
    function Shape() {
        return _super !== null && _super.apply(this, arguments) || this;
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
    Shape.prototype.setBound = function (x, y, width, height) {
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
    Shape.prototype.getBound = function () {
        return new Bound(this.x, this.y, this.size.width, this.size.height);
    };
    return Shape;
}(createjs.Shape));
var Size = (function () {
    function Size(width, height) {
        if (width === void 0) { width = 0; }
        if (height === void 0) { height = 0; }
        this.width = width;
        this.height = height;
    }
    return Size;
}());
var MAN_IMG = 'man';
var LOW_STONE_IMG = 'low';
var HIGHT_STONE_IMG = 'hight';
var BG_IMG = 'bg';
var COIN_IMG = 'coin';
var EVENT_LEVEL = 'level';
var EVENT_SCORE = 'score';
var EVENT_BG_MOVE = 'bg.move';
var EVENT_RESIZE = 'window.resize';
var EVENT_PROGRESS = 'progress';
var EVENT_SCENE_CLOSE = 'scene.close';
var Utils = (function () {
    function Utils() {
    }
    Utils.random = function (min, max) {
        var _a;
        if (min === void 0) { min = 0; }
        if (max === void 0) { max = 1; }
        if (min > max) {
            _a = [0, min], min = _a[0], max = _a[1];
        }
        return min + Math.floor(Math.random() * (max - min + 1));
    };
    return Utils;
}());
var Coin = (function (_super) {
    __extends(Coin, _super);
    function Coin() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(Coin.prototype, "rightOffest", {
        get: function () {
            return this.x + (this.size.width || 0);
        },
        enumerable: true,
        configurable: true
    });
    Coin.prototype.getBall = function () {
        return new Ball(this.x, this.y, Math.min(this.size.width || 0, this.size.height || 0) / 2);
    };
    return Coin;
}(Shape));
var Person = (function (_super) {
    __extends(Person, _super);
    function Person() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.speed = 2;
        _this._energy = 0;
        _this.gravity = 2;
        _this._lift = 0;
        _this.isSuspeed = true;
        _this.canDown = true;
        return _this;
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
    Object.defineProperty(Person.prototype, "height", {
        get: function () {
            return this.size.height || 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Person.prototype, "width", {
        get: function () {
            return this.size.width || 0;
        },
        enumerable: true,
        configurable: true
    });
    Person.prototype.setBound = function (x, y, width, height) {
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
    Person.prototype.getBound = function () {
        return new Bound(this.x, this.y, this.size.width, this.size.height);
    };
    Person.prototype.getRealBound = function (x, y) {
        if (x === void 0) { x = this.x; }
        if (y === void 0) { y = this.y; }
        return new Bound(x + 15, y, this.size.width - 30, this.size.height);
    };
    Person.prototype.setRealPoint = function (x, y) {
        this.x = x - 15;
        this.y = y;
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
    Object.defineProperty(Person.prototype, "rightOffest", {
        get: function () {
            return this.x + this.size.width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Person.prototype, "bottomOffest", {
        get: function () {
            return this.y + this.size.height;
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
            this.animation('jump');
            this.y -= this.gravity;
            this._lift -= this.gravity;
            if (this._lift <= 0) {
                this._lift = 0;
                this.animation('stop');
            }
        }
        if (this._energy > 0) {
            if (this.currentAnimation == 'stop') {
                this.animation('run');
            }
            this.x += this.speed;
            this._energy -= this.speed;
            if (this._energy < 0) {
                this._energy = 0;
            }
        }
        else if (this._energy < 0) {
            this.x -= this.speed;
            this._energy += this.speed;
            if (this._energy > 0) {
                this._energy = 0;
            }
        }
        if (this._energy == 0 && !this.canDown) {
            this.animation('stop');
        }
        if (this.canDown && this._lift == 0) {
            this.y += this.gravity;
        }
        this.canDown = true;
    };
    return Person;
}(createjs.Sprite));
var ImgFill = (function () {
    function ImgFill(img, x, y, width, height) {
        this.img = img;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    ImgFill.prototype.exec = function (ctx) {
        ctx.save();
        ctx.drawImage(this.img, 0, 0, this.img.width, this.img.height, this.x, this.y, this.width, this.height);
        ctx.restore();
    };
    return ImgFill;
}());
var Wall = (function (_super) {
    __extends(Wall, _super);
    function Wall() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.level = 1;
        _this._items = [1, 1, 1];
        _this._stoneImgs = [];
        _this.height = 0;
        _this._stoneWidth = 80;
        _this._maxWidth = 0;
        _this._maxCount = 0;
        return _this;
    }
    Object.defineProperty(Wall.prototype, "stoneWidth", {
        get: function () {
            return this._stoneWidth;
        },
        enumerable: true,
        configurable: true
    });
    Wall.prototype.init = function (width, height) {
        this.height = height;
        this._stoneImgs = [
            Resources.getImage(LOW_STONE_IMG),
            Resources.getImage(HIGHT_STONE_IMG)
        ];
        this._stoneWidth = Math.min.apply(Math, this._stoneImgs.map(function (i) { return i.width; }).filter(function (i) { return i > 0; }));
        this._maxCount = Math.ceil(width / this._stoneWidth);
        this._maxWidth = this._maxCount * this._stoneWidth;
        var count = this._maxCount * 2;
        this._items = [];
        for (var i = 0; i < count; i++) {
            if (i < 5) {
                this._items.push(0);
                continue;
            }
            this.generateNext();
        }
        this.update();
    };
    Wall.prototype.update = function () {
        this.graphics.clear();
        for (var i = 0; i < this._items.length; i++) {
            var item = this._items[i];
            if (item < 0) {
                continue;
            }
            var stone = this._stoneImgs[item];
            this.graphics.append(new ImgFill(stone, i * this._stoneWidth, this.height - stone.height, this._stoneWidth, stone.height));
        }
    };
    Wall.prototype.generateNext = function () {
        var _this = this;
        var last = this._items[this._items.length - 1];
        var rnd = Math.random() * 100;
        if (last >= 0 && rnd < 10 * this.level) {
            this._items.push(-1);
            return;
        }
        var items = [];
        if (last < 0) {
            var sond = this._items[this._items.length - 2];
            for (; sond >= 0; sond--) {
                items.push(sond);
            }
        }
        else {
            items.push(last);
            items.push(last - 1);
            items.push(last + 1);
        }
        items = items.filter(function (i) { return i >= 0 && i < _this._stoneImgs.length; });
        if (items.length === 1) {
            this._items.push(items[0]);
            return;
        }
        this._items.push(items[Math.floor(rnd / 100 * items.length)]);
    };
    Wall.prototype.move = function (diff) {
        this.x -= diff;
        if (this.x > -this._maxWidth) {
            return;
        }
        this._items.splice(0, this._maxCount);
        for (var i = 0; i < this._maxCount; i++) {
            this.generateNext();
        }
        this.x += this._maxWidth;
        this.update();
    };
    Wall.prototype.getCoinPoint = function (x) {
        var i = Math.ceil((x - this.x) / this._stoneWidth) - 1;
        return new Point(i * this._stoneWidth + this.x, this.height - (this._items[i] < 0 ? this._stoneImgs[this._items[i - 1]].height : this._stoneImgs[this._items[i]].height));
    };
    Wall.prototype.getSpacePoint = function (x) {
        var i = Math.ceil((x - this.x) / this._stoneWidth) - 1;
        return new Point(i * this._stoneWidth + this.x, this.height - (this._items[i] < 0 ? 0 : this._stoneImgs[this._items[i]].height));
    };
    Wall.prototype.getStoneBound = function (x) {
        var i = Math.ceil((x - this.x) / this._stoneWidth) - 1;
        var height = this._items[i] < 0 || !this._stoneImgs[this._items[i]] ? 0 : this._stoneImgs[this._items[i]].height;
        return new Bound(i * this._stoneWidth + this.x, this.height - height, this._stoneWidth, height);
    };
    return Wall;
}(createjs.Shape));
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
        lable.y = this.height / 2 - 170;
        lable.x = this.width / 2;
        lable.textAlign = 'center';
        this.addChild(lable);
    };
    EndScene.prototype._drawBtn = function () {
        var btn = new createjs.Text('AGAIN', 'bold 30px Courier New', '#000');
        btn.x = (this.width - 30) / 2;
        btn.y = (this.height - 60) / 2;
        btn.textAlign = 'center';
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
        _this._score = 0;
        _this._level = 1;
        _this._distance = 0;
        _this._coinTime = 0;
        _this._jumping = 0;
        _this._vy = -12;
        _this._gravity = .5;
        _this._hx = 0;
        _this._resistance = .3;
        _this._speed = 1;
        return _this;
    }
    Object.defineProperty(GameScene.prototype, "stoneHeight", {
        get: function () {
            return Math.floor(this.height / 4);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameScene.prototype, "score", {
        get: function () {
            return this._score;
        },
        set: function (arg) {
            this._score = arg;
            this.trigger(EVENT_SCORE, arg);
            this.level = Math.ceil(arg / 200);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameScene.prototype, "level", {
        get: function () {
            return this._level;
        },
        set: function (v) {
            this._level = v;
            this.trigger(EVENT_LEVEL, v);
            this._wall.level = v;
            this._speed = Math.ceil(this.level / 10);
        },
        enumerable: true,
        configurable: true
    });
    GameScene.prototype.init = function () {
        _super.prototype.init.call(this);
        this._coins = [];
        this._distance = 0;
        this._drawSky();
        this._drawWall();
        this._drawScore();
        this._drawMan();
        this.setFPS();
        this.addKeyEvent(this._keyDown.bind(this));
    };
    GameScene.prototype._drawScore = function () {
        var _this = this;
        var box = new createjs.Text('', 'bold 30px Courier New', '#ff0000');
        box.y = 20;
        box.x = this.width - 100;
        box.textAlign = 'center';
        this.addChild(box);
        this.on(EVENT_SCORE, function () {
            box.text = _this._score.toString();
        });
    };
    GameScene.prototype._keyDown = function (event) {
        event.preventDefault();
        switch (event.key) {
            case 'D':
            case 'd':
            case 'ArrowRight':
                this.runRightMan();
                break;
            case 'A':
            case 'a':
            case 'ArrowLeft':
                this.runLeftMan();
                break;
            case ' ':
                this.dumpMan();
                break;
            default:
                break;
        }
    };
    GameScene.prototype.runLeftMan = function () {
        this._man.animation('run');
        this._hx = -5;
    };
    GameScene.prototype.runRightMan = function () {
        this._man.animation('run');
        this._hx = 5;
    };
    GameScene.prototype.dumpMan = function () {
        if (this._jumping > 1) {
            return;
        }
        this._jumping++;
        this._man.animation('jump');
        this._vy = -12;
    };
    GameScene.prototype._drawWall = function () {
        this._wall = new Wall();
        this._wall.init(this.width, this.height);
        this.addChild(this._wall);
    };
    GameScene.prototype._drawSky = function (arg) {
        if (arg === void 0) { arg = Resources.getImage(BG_IMG); }
        var sky = new createjs.Shape();
        sky.graphics.beginBitmapFill(arg);
        var scale = this.height / arg.height;
        var width = scale * arg.width;
        var count = Math.ceil(width / this.width) + 1;
        for (var i = count - 1; i >= 0; i--) {
            sky.graphics.drawRect(i * arg.width, 0, arg.width, arg.height);
        }
        sky.scaleX = sky.scaleY = scale;
        this.addChild(sky);
        this.on(EVENT_BG_MOVE, function (diff) {
            sky.x -= diff;
            if (sky.x < -width) {
                sky.x += width;
            }
        });
    };
    GameScene.prototype._drawMan = function () {
        var manSpriteSheet = new createjs.SpriteSheet({
            'images': [Resources.getImage(MAN_IMG)],
            'frames': { 'regX': 0, 'height': 64, 'count': 66, 'regY': 1, 'width': 64 },
            'animations': {
                'stop': {
                    frames: [65],
                    next: 'stop',
                    speed: 0.2,
                },
                'run': {
                    frames: [21, 20, 19, 18, 17, 16, 15, 14, 13, 12],
                    next: 'run',
                    speed: 0.2,
                },
                'jump': {
                    frames: [33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43],
                    next: 'stop',
                    speed: 0.2,
                },
                'die': {
                    frames: [8, 7, 6, 5, 4, 3, 2, 1, 0],
                    next: 'die',
                    speed: 0.3,
                }
            }
        });
        this._man = new Person(manSpriteSheet, 'stop');
        this._man.framerate = 13;
        var point = this._wall.getSpacePoint(200);
        this._man.setBound(point.x, 0, 64, 62);
        this._vy = 0;
        this.addChild(this._man);
    };
    GameScene.prototype._drawCoin = function (point, arg) {
        if (arg === void 0) { arg = Resources.getImage(COIN_IMG); }
        var coin = new Coin();
        coin.graphics.beginBitmapFill(arg).drawRect(0, 0, arg.width, arg.height);
        point.y -= arg.height;
        point.x += (this._wall.stoneWidth - arg.width) / 2;
        coin.setBound(point, arg.width, arg.height);
        this.addChild(coin);
        this._coins.push(coin);
    };
    GameScene.prototype.mapCoin = function (cb) {
        for (var i = this._coins.length - 1; i >= 0; i--) {
            var res = cb(this._coins[i], i);
            if (typeof res === 'undefined') {
                continue;
            }
            if (typeof res === 'boolean' && !res) {
                break;
            }
            if (typeof res === 'number' && res === -1) {
                this.removeChild(this._coins[i]);
                this._coins.splice(i, 1);
            }
        }
    };
    GameScene.prototype.moveCoin = function (diff) {
        var _this = this;
        this.mapCoin(function (coin) {
            if (coin.x + coin.getBound().width < 0) {
                return -1;
            }
            coin.x -= diff;
            if (_this._collide(coin.getBall(), _this._man.getRealBound())) {
                _this.score += 1;
                return -1;
            }
        });
    };
    GameScene.prototype.generateCoin = function () {
        this._coinTime -= 1;
        if (this._coinTime > 0) {
            return;
        }
        var x = this.width;
        if (this._coins.length > 0) {
            x = this._coins[this._coins.length - 1].rightOffest;
            if (x > this.width) {
                return;
            }
        }
        var rnd = this._coinTime = Math.floor(Math.random() * 1000);
        x = Math.max(x, this.width);
        var point = this._wall.getCoinPoint(x);
        if (rnd > 500) {
            point.y -= 80;
        }
        this._drawCoin(point);
    };
    GameScene.prototype.moveMan = function (diff) {
        var manBound = this._man.getRealBound();
        var y = manBound.y;
        if (this._jumping > 0) {
            this._vy += this._gravity;
            y += this._vy;
        }
        var x = manBound.x - diff;
        if (this._hx > 0) {
            this._hx -= this._resistance;
            x += this._hx;
            if (this._hx <= 0) {
                this._man.animation('stop');
                this._hx = 0;
            }
        }
        else if (this._hx < 0) {
            this._hx += this._resistance;
            x += this._hx;
            if (this._hx >= 0) {
                this._man.animation('stop');
                this._hx = 0;
            }
            var prev = this._wall.getStoneBound(x);
            if (prev.x + prev.width >= x && prev.y < y + manBound.height) {
                x = prev.x + prev.width;
                this._man.animation('stop');
                this._hx = 0;
            }
        }
        var bound = this._wall.getStoneBound(x);
        var next = this._wall.getStoneBound(x + manBound.width);
        if (this._jumping > 0) {
            if (y + manBound.height >= bound.y && bound.y < this.height) {
                this._jumping = 0;
                this._hx = 0;
                this._man.animation('stop');
                y = bound.y - manBound.height;
            }
            if (next.y < bound.y && y + manBound.height >= next.y) {
                this._jumping = 0;
                this._hx = 0;
                this._man.animation('stop');
                y = next.y - manBound.height;
            }
        }
        else {
            if (y + manBound.height < bound.y) {
                this._jumping = 2;
                this._vy = 0;
            }
        }
        if (next.y < y + manBound.height) {
            x = next.x - manBound.width;
            this._man.animation('stop');
        }
        if (x + manBound.width >= this.width) {
            x = this.width - manBound.width;
            this._man.animation('stop');
        }
        this._man.setRealPoint(x, y);
        if (x + manBound.width < 0
            || y + manBound.height >= this.height - 10) {
            this.navigate(new EndScene, this.score);
            return;
        }
    };
    GameScene.prototype.moveMap = function (diff) {
        this._distance += diff;
        this.trigger(EVENT_BG_MOVE, diff);
        this._wall.move(diff);
        this.moveMan(diff);
        this.moveCoin(diff);
        this.generateCoin();
    };
    GameScene.prototype.update = function () {
        this.moveMap(this._speed);
    };
    GameScene.prototype._collide = function (ball, rect) {
        var rx = ball.x - (rect.x + rect.width / 2), ry = ball.y - (rect.y + rect.height / 2), dx = Math.min(rx, rect.width / 2), dx1 = Math.max(dx, -rect.width / 2), dy = Math.min(ry, rect.height / 2), dy1 = Math.max(dy, -rect.height / 2);
        return Math.pow(dx1 - rx, 2) + Math.pow(dy1 - ry, 2) <= Math.pow(ball.radius, 2);
    };
    GameScene.prototype._ballCollideRect = function (ball, rect) {
        if (ball.x < rect.x && ball.y < rect.y) {
            return Math.pow(ball.x - rect.x, 2) + Math.pow(ball.y - rect.y, 2) <
                Math.pow(ball.radius, 2);
        }
        else if (ball.x < rect.x && ball.y > rect.y + rect.height) {
            return Math.pow(ball.x - rect.x, 2) + Math.pow(ball.y - rect.y - rect.height, 2) <
                Math.pow(ball.radius, 2);
        }
        else if (ball.x > rect.x + rect.width && ball.y < rect.y) {
            return Math.pow(ball.x - rect.x - rect.width, 2) + Math.pow(ball.y - rect.y, 2) <
                Math.pow(ball.radius, 2);
        }
        else if (ball.x > rect.x + rect.width && ball.y > rect.y + rect.height) {
            return Math.pow(ball.x - rect.x - rect.width, 2) + Math.pow(ball.y - rect.y - rect.height, 2) <
                Math.pow(ball.radius, 2);
        }
        else {
            return (Math.abs(ball.x - rect.x - rect.width / 2) < ball.radius + rect.width / 2) &&
                (Math.abs(ball.y - rect.y - rect.height / 2) < ball.radius + rect.height / 2);
        }
    };
    GameScene.prototype._rectCollide = function (rect1, rect2) {
        return rect1.x + rect1.width > rect2.x &&
            rect1.x < rect2.x + rect2.width &&
            rect1.y + rect1.height > rect2.y &&
            rect1.y < rect2.y + rect2.height;
    };
    GameScene.prototype._ballCollide = function (ball1, ball2) {
        return Math.pow(ball1.x - ball2.x, 2) +
            Math.pow(ball1.y - ball2.y, 2) <
            Math.pow(ball1.radius + ball2.radius, 2);
    };
    GameScene.prototype.close = function () {
        _super.prototype.close.call(this);
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
        this.createSchedule();
        this.loadImages();
        this.setFPS(10);
    };
    LoadScene.prototype.createSchedule = function () {
        var bar = new createjs.Container();
        var outline = new createjs.Shape(new createjs.Graphics().beginFill('#cccccc').drawRect(0, 0, 300, 10));
        var inline = new createjs.Shape();
        var tip = new createjs.Text('0', 'bold 14px Courier New', '#333');
        tip.textAlign = 'center';
        tip.x = 150;
        tip.y = 20;
        bar.addChild(outline, inline, tip);
        bar.x = this.width / 2 - 150;
        bar.y = this.height * .8;
        this.addChild(bar);
        this.on(EVENT_PROGRESS, function (progress, label) {
            inline.graphics.clear();
            if (progress > 0) {
                inline.graphics.beginFill('#0172d5').drawRect(0, 0, progress * 300, 10);
            }
            tip.text = label + ': ' + Math.floor(progress * 100) + '%';
        });
    };
    LoadScene.prototype.loadImages = function () {
        var _this = this;
        var items = Configs.resources;
        var preload = new createjs.LoadQueue(true);
        preload.on('complete', function () {
            for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
                var item = items_1[_i];
                Resources.setImage(item.id, preload.getResult(item.id));
            }
            _this.loadSounds();
        });
        preload.on('progress', function (e) {
            _this.trigger(EVENT_PROGRESS, e.progress, '加载图片');
        });
        preload.loadManifest(Configs.resources);
        preload.getResult();
    };
    LoadScene.prototype.loadSounds = function () {
        var _this = this;
        if (!Configs.sounds || Configs.sounds.length < 1) {
            this.complete();
            return;
        }
        createjs.Sound.alternateExtensions = ['mp3'];
        var preload = new createjs.LoadQueue(true);
        preload.installPlugin(createjs.Sound);
        preload.on('complete', function () {
            _this.complete();
        });
        preload.on('progress', function (e) {
            _this.trigger(EVENT_PROGRESS, e.progress, '加载音频');
        });
        preload.loadManifest(Configs.sounds);
        preload.getResult();
    };
    LoadScene.prototype.complete = function () {
        this.navigate(new MainScene);
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
        btn.x = (this.width - 30) / 2;
        btn.y = (this.height - 60) / 2;
        btn.textAlign = 'center';
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
        { src: 'img/man.png', id: MAN_IMG },
        { src: 'img/ground.png', id: LOW_STONE_IMG },
        { src: 'img/bg.png', id: BG_IMG },
        { src: 'img/high.png', id: HIGHT_STONE_IMG },
        { src: 'img/coin.png', id: COIN_IMG },
    ];
    return Configs;
}());
var App = (function () {
    function App() {
    }
    App.main = function (arg) {
        var app = new Program(arg);
        var setSize = function () {
            var box = app.getStage().canvas.parentElement;
            if (!box || box.nodeName === 'BODY') {
                app.setSize(window.innerWidth, window.innerHeight);
                return;
            }
            app.setSize(box.offsetWidth, box.offsetHeight);
        };
        app.setTouch();
        setSize();
        app.init();
        window.onresize = setSize;
        return app;
    };
    return App;
}());
var Program = (function () {
    function Program(arg) {
        this.stage = new createjs.Stage(arg);
    }
    Object.defineProperty(Program.prototype, "width", {
        get: function () {
            return this.stage.canvas.width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Program.prototype, "height", {
        get: function () {
            return this.stage.canvas.height;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Program.prototype, "size", {
        get: function () {
            return { width: this.width, height: this.height };
        },
        enumerable: true,
        configurable: true
    });
    Program.prototype.setTouch = function () {
        createjs.Touch.enable(this.stage);
    };
    Program.prototype.getStage = function () {
        return this.stage;
    };
    Program.prototype.setSize = function (width, height) {
        this.stage.canvas.width = width;
        this.stage.canvas.height = height;
        if (this.scene) {
            this.scene.resize();
            this.scene.trigger(EVENT_RESIZE, width, height);
        }
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
        this.scene = page;
        page.setStage.apply(page, __spreadArrays([this], param));
        page.navigated.apply(page, __spreadArrays([before], param));
        return this;
    };
    Program.prototype.update = function () {
        this.scene.update();
    };
    return Program;
}());
