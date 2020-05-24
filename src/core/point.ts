class Point {
    constructor (
        public x: number = 0,
        public y: number = 0
    ) {
    }
    
    public setLocal(x: number, y: number): void {
        this.x = x;
        this.y = y;
    }
    
    public getLocal(): Point {
        return this;
    }
    
    public setWorld(x: number, y:number): void {
        this.x = x;
        this.y = y;
    }
    
    public getWorld(): any {
        return {
            x: this.x,
            y: this.y
        };
    }
}