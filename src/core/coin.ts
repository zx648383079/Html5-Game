class Coin extends Shape {
    public getBall(): Ball {
        return new Ball(this.x, this.y, Math.min(this.size.width || 0, this.size.height || 0) / 2 );
    }
    
    public move( arg: Point = new Point( 20, Configs.height - 20 ) ) {
        createjs.Tween.get(this).to({x: arg.getWorld().x, y: arg.getWorld().y}, 1000);
    }
}