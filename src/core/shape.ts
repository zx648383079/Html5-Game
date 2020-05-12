class Shape extends createjs.Shape {
    private _point!: Point;
    
    set point(arg: Point) {
        this._point = arg;
        var val: any = arg.getWorld();
        this.x = val.x;
        this.y = val.y;
    }
    
    get point(): Point {
        this._point.setWorld(this.x, this.y);			
        return this._point;
    }
    
    private _size!: Size;
    
    set size(arg: Size) {
        this._size = arg;
    }
    
    get size(): Size {
        return this._size;
    }
    
    public setBound(x: number | Point, y: number | Size, width?: number | Size, height?: number) {
        if(x instanceof Point) {
            this.point = <Point>x;
            if(y instanceof Size) {
                this.size = y;
            }else{
                this.size = new Size( <number>y, <number>width);
            }
        }else {
            this.point = new Point( <number>x , <number>y);
            if(width instanceof Size) {
                this.size = width;
            }else{
                this.size = new Size( <number>width, <number>height);
            }
        }
    }
    
    public getBound(): Bound {
        return new Bound(this.x, this.y, this.size.width, this.size.height);
    }
}