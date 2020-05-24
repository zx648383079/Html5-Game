class Coin extends Shape {

    /**
     * 左边距加宽度
     */
    public get rightOffest(): number {
        return this.x + (this.size.width || 0);
    }

    public getBall(): Ball {
        return new Ball(this.x, this.y, Math.min(this.size.width || 0, this.size.height || 0) / 2 );
    }
}