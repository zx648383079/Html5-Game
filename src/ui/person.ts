class Person extends createjs.Sprite {
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

    get height(): number {
        return this.size.height || 0;
    }

    get width(): number {
        return this.size.width || 0;
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

    /**
     * 去除一些边
     * @param x 
     * @param y 
     */
    public getRealBound(x: number = this.x, y: number = this.y): Bound {
        return new Bound(x + 15, y, this.size.width - 30, this.size.height);
    }

    public setRealPoint(x: number, y: number) {
        this.x = x - 15;
        this.y = y;
    }
    
    public speed: number = 2;
    
    private _energy: number = 0;
            
    get energy(): number {
        return this._energy;
    }
    
    set energy(arg: number) {
        if(this._energy >= 0 && arg > 0 ) {
            this._energy += arg;
        }else if( (this._energy > 0 && arg <= 0) || (this._energy < 0 && arg >= 0) ) {
            this._energy = arg;
        }else if(this._energy <= 0 && arg < 0 ) {
            this._energy += arg;
        }
    }
    
    public gravity: number = 2;    // 重力
    
    private _lift: number = 0;     //升力
    
    public isSuspeed: boolean = true;      //判断是否是悬浮状态
    
    get lift(): number {
        return this._lift;
    }
    
    set lift(arg: number) {
        if(!this.isSuspeed) {
            this._lift += arg;
            this.isSuspeed = true;
        }
    }

    public get rightOffest(): number {
        return this.x + this.size.width;
    }

    public get bottomOffest(): number {
        return this.y + this.size.height;
    }
    
    public canDown: boolean = true;
    
    public animation(arg: string): void {
        if(arg != this.currentAnimation) {
            this.gotoAndPlay(arg);
        }
    }
    
    public move() {
        if(this._lift > 0) {
            this.animation('jump');
            this.y -= this.gravity;
            this._lift -= this.gravity;
            if(this._lift <= 0) {
                this._lift = 0;
                this.animation('stop');
            }
        }
        if(this._energy > 0) {
            if(this.currentAnimation == 'stop') {
                this.animation('run');
            }
            this.x += this.speed;
            this._energy -= this.speed;
            if(this._energy < 0) {
                this._energy = 0;
            } 
        }else if(this._energy < 0) {
            this.x -= this.speed;
            this._energy += this.speed;
            if(this._energy > 0) {
                this._energy = 0;
            }
        }
        
        if(this._energy == 0 && !this.canDown ) {
            this.animation('stop');
        } 
        
        if(this.canDown && this._lift == 0) {
            this.y += this.gravity;
        }
        this.canDown = true;
    }
}