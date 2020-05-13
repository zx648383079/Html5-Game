class MapShape extends createjs.Shape {
    /**
     *
     */
    constructor(
        /**
         * 多少行
         */
        public rows: number,
        /**
         * 多少列
         */
        public columns: number, 
        /**
         * 一格宽
         */
        public cellWidth: number = 30, 
        /**
         * 一格高
         */
        public cellHeight: number = 30,
        public color: string = '#000',
        public lineColor: string = '#fff') {
        super(new createjs.Graphics());
        const maps = [];
        for (let i = 0; i < rows; i ++) {
            const cells = [];
            for (let j = 0; j < columns; j++) {
                cells.push(0);
            }
            maps.push(cells);
        }
        this.maps = maps;
    }

    private maps: number[][];

    public setCell(row: number = 0, column: number = 0, value: number = 1) {
        this.maps[row][column] = value;
        this.update();
        return this;
    }

    public setCells(maps: number[][], value: number = 1) {
        for (const [row, column] of maps) {
            this.maps[row][column] = value;
        }
        this.update();
        return this;
    }

    public setCellIndex(index: number = 0, value: number = 1) {
        return this.setCell(Math.floor(index / this.columns), index % this.columns, value);
    }

    public setCellsIndex(maps: number[], value: number = 1) {
        for (const index of maps) {
            this.maps[Math.floor(index / this.columns)][index % this.columns] = value;
        }
        this.update();
        return this;
    }

    public map(cb: (val: number, row: number, column: number) => any) {
        let edit = false;
        for (let i = this.maps.length - 1; i >= 0; i--) {
            for (let j = this.maps[i].length - 1; j >= 0; j--) { 
                const res = cb(this.maps[i][j], i, j);
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
    }

    /**
     * 行复制
     * @param row 
     * @param source 
     */
    public rowMove(row: number, source: number) {
        if (source < 0 || source >= this.maps.length) {
            return this;
        }
        for (let i = this.maps[source].length - 1; i >= 0; i--) {
            this.maps[row][i] = this.maps[source][i];
            this.maps[source][i] = 0;
        }
        return this;
    }

    /**
     * 行设置
     * @param row 
     * @param val 
     */
    public row(row: number, val: number = 0) {
        for (let i = this.maps[row].length - 1; i >= 0; i--) {
            this.maps[row][i] = val;
        }
        return this;
    }

    public mapRow(cb: (row: number) => any) {
        let edit = false;
        for (let i = this.maps.length - 1; i >= 0; i--) {
            const res = cb(i);
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
    }

    /**
     * 是否整行都为一个值
     * @param row 
     * @param val 
     */
    public rowEq(row: number = 0, val: number = 0) {
        if (row < 0 || row >= this.maps.length) {
            return false;
        }
        for (let i = this.maps[row].length - 1; i >= 0; i--) {
            if (this.maps[row][i] !== val) {
                return false;
            }
        }
        return true;
    }

    /**
     * 是否整列都为一个值
     * @param column 
     * @param val 
     */
    public columnEq(column: number = 0, val: number = 0) {
        for (let i = this.maps.length - 1; i >= 0; i--) {
            if (this.maps[i][column] !== val) {
                return false;
            }
        }
        return true;
    }

    /**
     * 是否有重合
     * @param source 
     * @param startX 
     * @param startY 
     */
    public hasOver(source: MapShape, startX: number, startY: number) {
        let over = false;
        source.map((val, y, x) => {
            if (val < 1) {
                return;
            }
            const row = startY + y;
            if (row < 0 || row >= this.maps.length) {
                return;
            }
            const column = startX + x;
            if (column < 0 || column >= this.maps[row].length) {
                return;
            }
            if (this.maps[row][column] == val) {
                over = true;
            }
        });
        return over;
    }
    
    public update() {
        this.graphics.clear();
        this.graphics.beginFill(this.color);
        this.graphics.beginStroke(this.lineColor);
        this.map((val, y, x) => {
            if (val > 0) {
                this.graphics.drawRect(x * this.cellWidth, y * this.cellHeight, this.cellWidth, this.cellHeight);
            }
        });
    }

    public copy(source: MapShape) {
        source.map((val, y, x) => {
            this.maps[x][y] = val;
        });
        this.update();
        return this;
    }

    public copyCell(source: MiniMap, startX: number, startY: number) {
        source.map((val, y, x) => {
            if (val < 1) {
                return;
            }
            const row = startY + y;
            if (row < 0 || row >= this.maps.length) {
                return;
            }
            const column = startX + x;
            if (column < 0 || column >= this.maps[row].length) {
                return;
            }
            this.maps[row][column] = val;
        });
        this.update();
        return this;
    }

    public reset() {
        this.map(() => 0);
        return this;
    }
}