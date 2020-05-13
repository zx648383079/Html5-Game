
class GameScene extends Scene {

    /**
     * 第几关
     */
    private levelBox!: createjs.Container;
    /**
     * 下一个方块
     */
    private nextBox!: createjs.Container;
    /**
     * 分数
     */
    private scoreBox!: createjs.Container;

    private mainBox!: createjs.Container;

    private current!: MiniMap;

    private cells!: MapShape;

    private status: number = 0;

    private levelScore: number = 0;

    /**
     * 旋转速度
     */
    private speed: number = 1;

    private _level: number = 1;

    public get level() : number {
        return this._level;
    }
    

    public set level(v : number) {
        this._level = v;
        this.trigger(EVENT_LEVEL);
    }

    private _score: number = 0;

    public get score() : number {
        return this._score;
    }
    
    public set score(v : number) {
        this._score = v;
        this.trigger(EVENT_SCORE);
    }
    
    

    protected init(): void {
        super.init();
        this.createLevel();
        this.createScore();
        this.createNext();
        this.createBox();
        this.setFPS();
        this.trigger(EVENT_NEXT);
        this.addKeyEvent(event => {
            event.stopPropagation();
            if (this.status > 1) {
                return;
            }
            switch (event.key) {
                case ' ':
                    // 变换
                    this.rotate();
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    // 下
                    this.status = 1;
                    this.moveDown(10);
                    this.status = 0;
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    // 右
                    this.moveRight();
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    // 左
                    this.moveLeft();
                    break;
                default:
                    break;
            }
        });
    }

    public update() {
        if (this.status < 1) {
            this.moveDown();
        }
        super.update();
    }

    /**
     * 旋转方块
     */
    private rotate() {
        this.current.rotateCell();
        const [x, y] = this.current.getPositionIndex();
        if (x < 0) {
            if (this.current.leftSpace > 0) {
                return;
            }
            this.current.x = 0;
            return;
        }
        const columns = this.cells.columns - 4;
        if (this.current.rightSpace > 0) {
            return;
        }
        if (x > columns) {
            this.current.setPositionIndex(columns, y);
        }
    }

    /**
     * 下移
     * @param speed 
     */
    private moveDown(speed: number = 0) {
        if (!this.canDown()) {
            this.trigger(EVENT_FIXED);
            this.removeCell();
            if (this.cells.rowEq(0)) {
                this.trigger(EVENT_NEXT);
            } else {
                // 游戏结束
                this.status = 2;
                this.navigate(new EndScene(), this.score);
                return;
            }
        }
        this.current.y = this.getCanDownY(speed + this.speed, this.current.y);
    }

    /**
     * 修正下一个可移动的位置
     * @param y 
     */
    private getCanDownY(diff: number, y: number) {
        if (diff > this.current.cellHeight) {
            diff = this.current.cellHeight;
        }
        const rows = this.cells.rows + this.current.bottomSpace;
        const newY = Math.floor((y + diff) / this.current.cellHeight);
        if (newY >= rows) {
            return rows * this.current.cellHeight;
        }
        const [x, ] = this.current.getPositionIndex();
        if (this.cells.hasOver(this.current, x, newY - 3)) {
            return newY * this.current.cellHeight;
        }
        return y + diff;
    }

    private moveRight() {
        const [x, y] = this.current.getPositionIndex();
        const columns = this.cells.columns - 4 + this.current.rightSpace;
        if (x >= columns) {
            return;
        }
        if (this.cells.hasOver(this.current, x + 1, y - 3)) {
            return;
        }
        this.current.x += this.current.cellWidth;
    }

    private moveLeft() {
        const [x, y] = this.current.getPositionIndex();
        const newX = x + this.current.leftSpace;
        if (newX <= 0) {
            return;
        }
        if (this.cells.hasOver(this.current, x - 1, y - 3)) {
            return;
        }
        this.current.x -= this.current.cellWidth;
    }

    /**
     * 移除行
     */
    private removeCell() {
        let diff = 0;
        let y = this.cells.rows;
        const emptyRows: number[] = [];
        let isBefore = false; // 当前行是否是已经换过了
        while (y >= 0) {
            y --;
            const isSame = emptyRows.indexOf(y) < 0 && this.cells.rowEq(y, 1);
            if (isSame) {
                diff ++;
                isBefore = true;
            } else if (isBefore) {
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
                y ++; // 重新检测当前行
            }
        }
        this.score += diff;
        this.levelScore += diff;
        if (this.levelScore > 50) {
            this.passLevel();
            return;
        }
        this.cells.update();
    }

    private canDown() {
        if (this.current.y % 30 > 0) {
            return true;
        }
        const [x, y] = this.current.getPositionIndex();
        const rows = this.cells.rows + this.current.bottomSpace;
        if (y >= rows) {
            return false;
        }
        return !this.cells.hasOver(this.current, x, y - 3);
    }

    /**
     * 过关动画
     */
    private passLevel() {

        this.nextLevel();
    }

    /**
     * 下一关
     */
    private nextLevel() {
        this.level ++;
        this.speed += 1;
        this.cells.reset();
        this.trigger(EVENT_FIXED);
    }

    private createNext() {
        const bg = new createjs.Shape(new createjs.Graphics().beginFill('gray').drawRect(0, 0, 120, 120));
        const cell = new MiniMap(Utils.random(6), Utils.random(3));
        this.nextBox = new createjs.Container();
        this.nextBox.addChild(bg, cell);
        this.nextBox.y = 300;
        this.nextBox.x = 500;
        this.addChild(this.nextBox);
        this.on(EVENT_NEXT, () => {
            this.current.copy(cell);
            let min = 0 - this.current.leftSpace, max = 10 + this.current.rightSpace;
            let y =  this.current.bottomSpace;
            this.current.setPositionIndex(Utils.random(min, max), y);
            cell.generateCells(Utils.random(6), Utils.random(3));
        })
    }

    private createBox() {
        const bg = new createjs.Shape(new createjs.Graphics().beginFill('gray').drawRect(0, 0, 420, 600));
        this.current = new MiniMap(-1, 0);
        this.cells = new MapShape(20, 14);
        bg.y = this.cells.y = 120;
        this.mainBox = new createjs.Container();
        this.mainBox.addChild(bg, this.current, this.cells);
        this.mainBox.y = 0;
        this.mainBox.x = 50;
        
        this.addChild(this.mainBox);
        const mask = new createjs.Shape(new createjs.Graphics().beginFill("#ffffff").drawRect(this.mainBox.x, this.mainBox.y + 120, 420, 600));
        this.mainBox.mask = mask;
        this.on(EVENT_FIXED, () => {
            const [x, y] = this.current.getPositionIndex();
            this.cells.copyCell(this.current, x, y - 4);
        });
    }

    /**
     * 创建分数
     */
    private createScore() {
        const text = new createjs.Text('得分', "20px Arial", '#fff');
        const score = new createjs.Text(this.score.toString(), "20px Arial", '#fff');
        const bg = new createjs.Shape(new createjs.Graphics().beginFill('gray').drawRect(0, 0, 80, 60));
        text.y = 5;
        score.x = text.x = 40;
        score.y = 30;
        score.textAlign = text.textAlign = 'center';
        this.scoreBox = new createjs.Container();
        this.scoreBox.addChild(bg, text, score);
        this.scoreBox.y = 20;
        this.scoreBox.x = this.width / 2 - 40;
        this.addChild(this.scoreBox);
        this.on(EVENT_SCORE, () => {
            score.text = this.score.toString();
        });
    }

    /**
     * 创建第几关
     */
    private createLevel() {
        const label = () => '第 ' + this.level + ' 关';
        const text = new createjs.Text(label(), "20px Arial", '#fff');
        const bg = new createjs.Shape(new createjs.Graphics().beginFill('gray').drawRect(0, 0, 100, 30));
        text.y = 5;
        text.x = 50;
        text.textAlign = 'center';
        this.levelBox = new createjs.Container();
        this.levelBox.addChild(bg, text);
        this.levelBox.y = 20;
        this.addChild(this.levelBox);
        this.on(EVENT_LEVEL, () => {
            text.text = label();
        });
    }

    public close(): void {
        super.close();
    }
}

