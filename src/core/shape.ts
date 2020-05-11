class Shape extends createjs.Shape {
    public status: Status = Status.NONE;
    
    public setStatus(arg: Status = Status.NONE) {
        this.status = arg;
        this.graphics.beginFill(Colors[this.status]).drawCircle( 29, 25 , 25).endFill();
    }
}