class Sprite extends createjs.Sprite {
    public point: Point = new Point(0, 0);
    
    public setPoint = function(this: Sprite) {
        this.point.setPoint(this);
    }
}