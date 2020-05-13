enum CellKind {
    L,
    J,
    Z,
    S,
    I,
    T,
    O
}

class MiniMap extends MapShape {

    /**
     *
     */
    constructor(
        public kind: CellKind,
        public rotate: number,
        cellWidth = 30,
        cellHeight: number = 30,
        color: string = '#000',
        lineColor: string = '#fff'
    ) {
        super(4, 4, cellWidth, cellHeight, color, lineColor);
        if (this.kind < 0) {
            return;
        }
        this.generateCells(kind, rotate);
    }

    private _leftSpace = 0;
    /**
     * 左边空列
     */
    public get leftSpace(): number {
        return this._leftSpace;
    }

    private _rightSpace = 0;
    /**
     * 右边空列
     */
    public get rightSpace(): number {
        return this._rightSpace;
    }

    private _bottomSpace = 0;
    /**
     * 底部空行
     */
    public get bottomSpace(): number {
        return this._bottomSpace;
    }

    public setPositionIndex(x: number, y: number) {
        this.x = x * this.cellWidth;
        this.y = y * this.cellHeight;
        return this;
    }

    public getPositionIndex() {
        return [
            Math.floor(this.x / this.cellWidth),
            Math.floor(this.y / this.cellHeight)
        ];
    }

    public rotateCell() {
        this.generateCells(this.kind, this.rotate + 1);
    }

    public copy(source: MiniMap) {
        this.kind = source.kind;
        this.rotate = source.rotate;
        return super.copy(source);
    }

    public update() {
        super.update();
        this._leftSpace = this.columnEq(0) ? 1 : 0;
        this._bottomSpace = this._rightSpace = 0;
        if (this.columnEq(2)) {
            this._rightSpace = 2;
        } else if (this.columnEq(3)) {
            this._rightSpace = 1;
        }
        if (this.rowEq(2)) {
            this._bottomSpace = 2;
        } else if (this.rowEq(3)) {
            this._bottomSpace = 1;
        }
    }

    public generateCells(kind: CellKind, rotate: number = 0) {
        const maps = {
            [CellKind.I]: [
                [1, 5, 9, 13],
                [4, 5, 6, 7]
            ],
            [CellKind.L]: [
                [1, 5, 9, 10],
                [9, 5, 6, 7],
                [1, 2, 6, 10],
                [6, 10, 9, 8],
            ],
            [CellKind.Z]: [
                [4, 5, 9, 10],
                [2, 6, 5, 9],
            ],
            [CellKind.S]: [
                [8, 9, 5, 6],
                [1, 5, 6, 10],
            ],
            [CellKind.T]: [
                [1, 4, 5, 6],
                [1, 5, 9, 6],
                [4, 5, 9, 6],
                [5, 2, 6, 10],
            ],
            [CellKind.O]: [
                [5, 6, 9, 10],
            ],
            [CellKind.J]: [
                [2, 6, 9, 10],
                [4, 8, 9, 10],
                [1, 2, 5, 9],
                [4, 5, 6, 10],
            ],
        }
        const map = maps[kind];
        this.reset();
        this.kind = kind;
        this.rotate = rotate % map.length;
        return this.setCellsIndex(map[this.rotate]);
    }
}