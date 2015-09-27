cc.RobotSprite = cc.Sprite.extend({
	setDieCallback: function(callback) {
		this.dieCallback = callback;
	},
	shoot: function(){
		if(this.bullet != null)
		{
			var b = BulletSprite( this.bullet , this.direction , this.x , this.y);
			this._parent.addChild( b );
		}
	},
	collide: function(robotSprite)
	{
		if( this.ballCollide(this.getBoundingBox(), robotSprite.getBoundingBox()) )
		{
			var life = robotSprite.life;
			robotSprite.die(this.life , true );			
			this.die(life , true);
			console.log("=====机器碰撞=====");
			return true;
		}
		return false;
	},
	ballCollide: function(ball1, ball2) {
		var centerX = ball1.x + ball1.width/2,
			centerY = ball1.y + ball1.height/2,
			radius = Math.min(ball1.width, ball1.height)/2,
			center2X = ball2.x + ball2.width/2,
			center2Y = ball2.y + ball2.height/2,
			radius2 = Math.min(ball2.width, ball2.height)/2;
		var distance = Math.sqrt(
			Math.pow(centerX - center2X, 2) + Math.pow(centerY - center2Y, 2)
		);
		
		return distance < radius + radius2;
	}
});

