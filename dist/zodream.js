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
        createjs.Ticker.addEventListener('tick', this.update.bind(this));
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
var EVENT_RESIZE = 'resize';
var EVENT_LEVEL = 'level';
var EVENT_SCORE = 'score';
var EVENT_NEXT = 'next';
var EVENT_FIXED = 'fixed';
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
var MapShape = (function (_super) {
    __extends(MapShape, _super);
    function MapShape(rows, columns, cellWidth, cellHeight, color, lineColor) {
        if (cellWidth === void 0) { cellWidth = 30; }
        if (cellHeight === void 0) { cellHeight = 30; }
        if (color === void 0) { color = '#000'; }
        if (lineColor === void 0) { lineColor = '#fff'; }
        var _this = _super.call(this, new createjs.Graphics()) || this;
        _this.rows = rows;
        _this.columns = columns;
        _this.cellWidth = cellWidth;
        _this.cellHeight = cellHeight;
        _this.color = color;
        _this.lineColor = lineColor;
        var maps = [];
        for (var i = 0; i < rows; i++) {
            var cells = [];
            for (var j = 0; j < columns; j++) {
                cells.push(0);
            }
            maps.push(cells);
        }
        _this.maps = maps;
        return _this;
    }
    MapShape.prototype.setCell = function (row, column, value) {
        if (row === void 0) { row = 0; }
        if (column === void 0) { column = 0; }
        if (value === void 0) { value = 1; }
        this.maps[row][column] = value;
        this.update();
        return this;
    };
    MapShape.prototype.setCells = function (maps, value) {
        if (value === void 0) { value = 1; }
        for (var _i = 0, maps_1 = maps; _i < maps_1.length; _i++) {
            var _a = maps_1[_i], row = _a[0], column = _a[1];
            this.maps[row][column] = value;
        }
        this.update();
        return this;
    };
    MapShape.prototype.setCellIndex = function (index, value) {
        if (index === void 0) { index = 0; }
        if (value === void 0) { value = 1; }
        return this.setCell(Math.floor(index / this.columns), index % this.columns, value);
    };
    MapShape.prototype.setCellsIndex = function (maps, value) {
        if (value === void 0) { value = 1; }
        for (var _i = 0, maps_2 = maps; _i < maps_2.length; _i++) {
            var index = maps_2[_i];
            this.maps[Math.floor(index / this.columns)][index % this.columns] = value;
        }
        this.update();
        return this;
    };
    MapShape.prototype.map = function (cb) {
        var edit = false;
        for (var i = this.maps.length - 1; i >= 0; i--) {
            for (var j = this.maps[i].length - 1; j >= 0; j--) {
                var res = cb(this.maps[i][j], i, j);
                if (typeof res === 'boolean' && !res) {
                    return this;
                }
                if (typeof res === 'number') {
                    this.maps[i][j] = res;
                    edit = true;
                }
            }
        }
        if (edit) {
            this.update();
        }
        return this;
    };
    MapShape.prototype.rowMove = function (row, source) {
        if (source < 0 || source >= this.maps.length) {
            return this;
        }
        for (var i = this.maps[source].length - 1; i >= 0; i--) {
            this.maps[row][i] = this.maps[source][i];
            this.maps[source][i] = 0;
        }
        return this;
    };
    MapShape.prototype.row = function (row, val) {
        if (val === void 0) { val = 0; }
        for (var i = this.maps[row].length - 1; i >= 0; i--) {
            this.maps[row][i] = val;
        }
        return this;
    };
    MapShape.prototype.mapRow = function (cb) {
        var edit = false;
        for (var i = this.maps.length - 1; i >= 0; i--) {
            var res = cb(i);
            if (typeof res === 'boolean' && !res) {
                return this;
            }
            if (typeof res === 'number') {
                this.row(i, res);
                edit = true;
            }
        }
        if (edit) {
            this.update();
        }
        return this;
    };
    MapShape.prototype.rowEq = function (row, val) {
        if (row === void 0) { row = 0; }
        if (val === void 0) { val = 0; }
        if (row < 0 || row >= this.maps.length) {
            return false;
        }
        for (var i = this.maps[row].length - 1; i >= 0; i--) {
            if (this.maps[row][i] !== val) {
                return false;
            }
        }
        return true;
    };
    MapShape.prototype.columnEq = function (column, val) {
        if (column === void 0) { column = 0; }
        if (val === void 0) { val = 0; }
        for (var i = this.maps.length - 1; i >= 0; i--) {
            if (this.maps[i][column] !== val) {
                return false;
            }
        }
        return true;
    };
    MapShape.prototype.hasOver = function (source, startX, startY) {
        var _this = this;
        var over = false;
        source.map(function (val, y, x) {
            if (val < 1) {
                return;
            }
            var row = startY + y;
            if (row < 0 || row >= _this.maps.length) {
                return;
            }
            var column = startX + x;
            if (column < 0 || column >= _this.maps[row].length) {
                return;
            }
            if (_this.maps[row][column] == val) {
                over = true;
            }
        });
        return over;
    };
    MapShape.prototype.update = function () {
        var _this = this;
        this.graphics.clear();
        this.graphics.beginFill(this.color);
        this.graphics.beginStroke(this.lineColor);
        this.map(function (val, y, x) {
            if (val > 0) {
                _this.graphics.drawRect(x * _this.cellWidth, y * _this.cellHeight, _this.cellWidth, _this.cellHeight);
            }
        });
    };
    MapShape.prototype.copy = function (source) {
        var _this = this;
        source.map(function (val, y, x) {
            _this.maps[x][y] = val;
        });
        this.update();
        return this;
    };
    MapShape.prototype.copyCell = function (source, startX, startY) {
        var _this = this;
        source.map(function (val, y, x) {
            if (val < 1) {
                return;
            }
            var row = startY + y;
            if (row < 0 || row >= _this.maps.length) {
                return;
            }
            var column = startX + x;
            if (column < 0 || column >= _this.maps[row].length) {
                return;
            }
            _this.maps[row][column] = val;
        });
        this.update();
        return this;
    };
    MapShape.prototype.reset = function () {
        this.map(function () { return 0; });
        return this;
    };
    return MapShape;
}(createjs.Shape));
var CellKind;
(function (CellKind) {
    CellKind[CellKind["L"] = 0] = "L";
    CellKind[CellKind["J"] = 1] = "J";
    CellKind[CellKind["Z"] = 2] = "Z";
    CellKind[CellKind["S"] = 3] = "S";
    CellKind[CellKind["I"] = 4] = "I";
    CellKind[CellKind["T"] = 5] = "T";
    CellKind[CellKind["O"] = 6] = "O";
})(CellKind || (CellKind = {}));
var MiniMap = (function (_super) {
    __extends(MiniMap, _super);
    function MiniMap(kind, rotate, cellWidth, cellHeight, color, lineColor) {
        if (cellWidth === void 0) { cellWidth = 30; }
        if (cellHeight === void 0) { cellHeight = 30; }
        if (color === void 0) { color = '#000'; }
        if (lineColor === void 0) { lineColor = '#fff'; }
        var _this = _super.call(this, 4, 4, cellWidth, cellHeight, color, lineColor) || this;
        _this.kind = kind;
        _this.rotate = rotate;
        _this._leftSpace = 0;
        _this._rightSpace = 0;
        _this._bottomSpace = 0;
        if (_this.kind < 0) {
            return _this;
        }
        _this.generateCells(kind, rotate);
        return _this;
    }
    Object.defineProperty(MiniMap.prototype, "leftSpace", {
        get: function () {
            return this._leftSpace;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MiniMap.prototype, "rightSpace", {
        get: function () {
            return this._rightSpace;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MiniMap.prototype, "bottomSpace", {
        get: function () {
            return this._bottomSpace;
        },
        enumerable: true,
        configurable: true
    });
    MiniMap.prototype.setPositionIndex = function (x, y) {
        this.x = x * this.cellWidth;
        this.y = y * this.cellHeight;
        return this;
    };
    MiniMap.prototype.getPositionIndex = function () {
        return [
            Math.floor(this.x / this.cellWidth),
            Math.floor(this.y / this.cellHeight)
        ];
    };
    MiniMap.prototype.rotateCell = function () {
        this.generateCells(this.kind, this.rotate + 1);
    };
    MiniMap.prototype.copy = function (source) {
        this.kind = source.kind;
        this.rotate = source.rotate;
        return _super.prototype.copy.call(this, source);
    };
    MiniMap.prototype.update = function () {
        _super.prototype.update.call(this);
        this._leftSpace = this.columnEq(0) ? 1 : 0;
        this._bottomSpace = this._rightSpace = 0;
        if (this.columnEq(2)) {
            this._rightSpace = 2;
        }
        else if (this.columnEq(3)) {
            this._rightSpace = 1;
        }
        if (this.rowEq(2)) {
            this._bottomSpace = 2;
        }
        else if (this.rowEq(3)) {
            this._bottomSpace = 1;
        }
    };
    MiniMap.prototype.generateCells = function (kind, rotate) {
        var _a;
        if (rotate === void 0) { rotate = 0; }
        var maps = (_a = {},
            _a[CellKind.I] = [
                [1, 5, 9, 13],
                [4, 5, 6, 7]
            ],
            _a[CellKind.L] = [
                [1, 5, 9, 10],
                [9, 5, 6, 7],
                [1, 2, 6, 10],
                [6, 10, 9, 8],
            ],
            _a[CellKind.Z] = [
                [4, 5, 9, 10],
                [2, 6, 5, 9],
            ],
            _a[CellKind.S] = [
                [8, 9, 5, 6],
                [1, 5, 6, 10],
            ],
            _a[CellKind.T] = [
                [1, 4, 5, 6],
                [1, 5, 9, 6],
                [4, 5, 9, 6],
                [5, 2, 6, 10],
            ],
            _a[CellKind.O] = [
                [5, 6, 9, 10],
            ],
            _a[CellKind.J] = [
                [2, 6, 9, 10],
                [4, 8, 9, 10],
                [1, 2, 5, 9],
                [4, 5, 6, 10],
            ],
            _a);
        var map = maps[kind];
        this.reset();
        this.kind = kind;
        this.rotate = rotate % map.length;
        return this.setCellsIndex(map[this.rotate]);
    };
    return MiniMap;
}(MapShape));
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
        this.on(EVENT_RESIZE, function (width, height) {
            lable.y = height / 2 - 170;
            lable.x = width / 2;
        });
    };
    EndScene.prototype._drawBtn = function () {
        var btn = new createjs.Text('AGAIN', 'bold 30px Courier New', '#000');
        btn.x = (this.width - 30) / 2;
        btn.y = (this.height - 60) / 2;
        btn.textAlign = 'center';
        btn.addEventListener('click', this._click.bind(this));
        this.addChild(btn);
        this.on(EVENT_RESIZE, function (width, height) {
            btn.x = (width - 30) / 2;
            btn.y = (height - 60) / 2;
        });
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
        _this.status = 0;
        _this.levelScore = 0;
        _this.speed = 1;
        _this._level = 1;
        _this._score = 0;
        return _this;
    }
    Object.defineProperty(GameScene.prototype, "level", {
        get: function () {
            return this._level;
        },
        set: function (v) {
            this._level = v;
            this.trigger(EVENT_LEVEL);
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
            this.trigger(EVENT_SCORE);
        },
        enumerable: true,
        configurable: true
    });
    GameScene.prototype.init = function () {
        var _this = this;
        _super.prototype.init.call(this);
        this.createLevel();
        this.createScore();
        this.createNext();
        this.createBox();
        this.setFPS();
        this.trigger(EVENT_NEXT);
        this.addKeyEvent(function (event) {
            event.stopPropagation();
            if (_this.status > 1) {
                return;
            }
            switch (event.key) {
                case ' ':
                    _this.rotate();
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    _this.status = 1;
                    _this.moveDown(10);
                    _this.status = 0;
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    _this.moveRight();
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    _this.moveLeft();
                    break;
                default:
                    break;
            }
        });
    };
    GameScene.prototype.update = function () {
        if (this.status < 1) {
            this.moveDown();
        }
        _super.prototype.update.call(this);
    };
    GameScene.prototype.rotate = function () {
        this.current.rotateCell();
        var _a = this.current.getPositionIndex(), x = _a[0], y = _a[1];
        if (x < 0) {
            if (this.current.leftSpace > 0) {
                return;
            }
            this.current.x = 0;
            return;
        }
        var columns = this.cells.columns - 4;
        if (this.current.rightSpace > 0) {
            return;
        }
        if (x > columns) {
            this.current.setPositionIndex(columns, y);
        }
    };
    GameScene.prototype.moveDown = function (speed) {
        if (speed === void 0) { speed = 0; }
        if (!this.canDown()) {
            this.trigger(EVENT_FIXED);
            this.removeCell();
            if (this.cells.rowEq(0)) {
                this.trigger(EVENT_NEXT);
            }
            else {
                this.status = 2;
                this.navigate(new EndScene(), this.score);
                return;
            }
        }
        this.current.y = this.getCanDownY(speed + this.speed, this.current.y);
    };
    GameScene.prototype.getCanDownY = function (diff, y) {
        if (diff > this.current.cellHeight) {
            diff = this.current.cellHeight;
        }
        var rows = this.cells.rows + this.current.bottomSpace;
        var newY = Math.floor((y + diff) / this.current.cellHeight);
        if (newY >= rows) {
            return rows * this.current.cellHeight;
        }
        var x = this.current.getPositionIndex()[0];
        if (this.cells.hasOver(this.current, x, newY - 3)) {
            return newY * this.current.cellHeight;
        }
        return y + diff;
    };
    GameScene.prototype.moveRight = function () {
        var _a = this.current.getPositionIndex(), x = _a[0], y = _a[1];
        var columns = this.cells.columns - 4 + this.current.rightSpace;
        if (x >= columns) {
            return;
        }
        if (this.cells.hasOver(this.current, x + 1, y - 3)) {
            return;
        }
        this.current.x += this.current.cellWidth;
    };
    GameScene.prototype.moveLeft = function () {
        var _a = this.current.getPositionIndex(), x = _a[0], y = _a[1];
        var newX = x + this.current.leftSpace;
        if (newX <= 0) {
            return;
        }
        if (this.cells.hasOver(this.current, x - 1, y - 3)) {
            return;
        }
        this.current.x -= this.current.cellWidth;
    };
    GameScene.prototype.removeCell = function () {
        var diff = 0;
        var y = this.cells.rows;
        var emptyRows = [];
        var isBefore = false;
        while (y >= 0) {
            y--;
            var isSame = emptyRows.indexOf(y) < 0 && this.cells.rowEq(y, 1);
            if (isSame) {
                diff++;
                isBefore = true;
            }
            else if (isBefore) {
                isBefore = false;
                continue;
            }
            if (y - diff < 0) {
                break;
            }
            if (diff > 0) {
                this.cells.rowMove(y, y - diff);
                emptyRows.push(y - diff);
            }
            if (isSame) {
                y++;
            }
        }
        this.score += diff;
        this.levelScore += diff;
        if (this.levelScore > 50) {
            this.passLevel();
            return;
        }
        this.cells.update();
    };
    GameScene.prototype.canDown = function () {
        if (this.current.y % 30 > 0) {
            return true;
        }
        var _a = this.current.getPositionIndex(), x = _a[0], y = _a[1];
        var rows = this.cells.rows + this.current.bottomSpace;
        if (y >= rows) {
            return false;
        }
        return !this.cells.hasOver(this.current, x, y - 3);
    };
    GameScene.prototype.passLevel = function () {
        this.nextLevel();
    };
    GameScene.prototype.nextLevel = function () {
        this.level++;
        this.speed += 1;
        this.cells.reset();
        this.trigger(EVENT_FIXED);
    };
    GameScene.prototype.createNext = function () {
        var _this = this;
        var bg = new createjs.Shape(new createjs.Graphics().beginFill('gray').drawRect(0, 0, 120, 120));
        var cell = new MiniMap(Utils.random(6), Utils.random(3));
        this.nextBox = new createjs.Container();
        this.nextBox.addChild(bg, cell);
        this.nextBox.y = 300;
        this.nextBox.x = 500;
        this.addChild(this.nextBox);
        this.on(EVENT_NEXT, function () {
            _this.current.copy(cell);
            var min = 0 - _this.current.leftSpace, max = 10 + _this.current.rightSpace;
            var y = _this.current.bottomSpace;
            _this.current.setPositionIndex(Utils.random(min, max), y);
            cell.generateCells(Utils.random(6), Utils.random(3));
        });
    };
    GameScene.prototype.createBox = function () {
        var _this = this;
        var bg = new createjs.Shape(new createjs.Graphics().beginFill('gray').drawRect(0, 0, 420, 600));
        this.current = new MiniMap(-1, 0);
        this.cells = new MapShape(20, 14);
        bg.y = this.cells.y = 120;
        this.mainBox = new createjs.Container();
        this.mainBox.addChild(bg, this.current, this.cells);
        this.mainBox.y = 0;
        this.mainBox.x = 50;
        this.addChild(this.mainBox);
        var mask = new createjs.Shape(new createjs.Graphics().beginFill("#ffffff").drawRect(this.mainBox.x, this.mainBox.y + 120, 420, 600));
        this.mainBox.mask = mask;
        this.on(EVENT_FIXED, function () {
            var _a = _this.current.getPositionIndex(), x = _a[0], y = _a[1];
            _this.cells.copyCell(_this.current, x, y - 4);
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
        this.scoreBox.x = this.width / 2 - 40;
        this.addChild(this.scoreBox);
        this.on(EVENT_SCORE, function () {
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
        this.on(EVENT_LEVEL, function () {
            text.text = label();
        });
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
        if (Configs.resources.length < 1) {
            this._complete();
            return;
        }
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
        var btn = new createjs.Text('START GAME', 'bold 30px Courier New', '#000');
        btn.x = (this.width - 30) / 2;
        btn.y = (this.height - 60) / 2;
        btn.textAlign = 'center';
        btn.addEventListener('click', this._click.bind(this));
        this.addChild(btn);
        this.on(EVENT_RESIZE, function (width, height) {
            btn.x = (width - 30) / 2;
            btn.y = (height - 60) / 2;
        });
    };
    MainScene.prototype._click = function () {
        this.navigate(new GameScene());
    };
    return MainScene;
}(Scene));
var Configs = (function () {
    function Configs() {
    }
    Configs.resources = [];
    return Configs;
}());
var App = (function () {
    function App() {
    }
    App.main = function (arg) {
        var app = new Program(arg);
        var setSize = function () {
            app.setSize(window.innerWidth, window.innerHeight);
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
