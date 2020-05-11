class Point {
    constructor(x?: number, y?: number) {
        this.value = 0;
        this.kind = Kind.CIRCLE;
        if (x != undefined && y != undefined) {
            this.x = x;
            this.y = y;
        } else if (x != undefined && y == undefined) {
            this.x = x % 9;
            this.y = x / 9;
        } else {
            this.x = 0;
            this.y = 0;
        }
    }
    
    public x: number;
    
    public y: number;
    
    public value: number;
    
    public kind: Kind;

    public startPoint!: Point;
    
    public setPoint(...args: any[]) {
        let x: number = this.y % 2 * 29 + this.x * 58,
            y: number = this.y * 50;
        if (this.kind == Kind.CAT) {
            y -= 66;
        }
        for (let i = 0, len = args.length; i < len; i++) {
            const element = args[i];
            element.x = x;
            element.y = y;
        }
    }
}