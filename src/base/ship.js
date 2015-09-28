cc.ShipSprite = cc.RobotSprite.extend({
	move: function() {
		var direct = arguments[0] || this.direction;
		switch (direct) {
			case direction.UP:
				if(this.y + this.speed < cc.winSize.height) {
					this.y += this.speed;				
				}
				break;
			case direction.RIGHT:
				if(this.x + this.speed < cc.winSize.width) {
					this.x += this.speed;					
				}
				break;
			case direction.DOWN:
				if(this.y > -20) {
					this.y -= this.speed;				
				}
				break;
			case direction.LEFT:
				if(this.x > this.speed) {
					this.x -= this.speed;					
				}
				break;
			default:
				break;
		}
	},
	die: function()
	{
		var hit = arguments[0] || 0;
		this.life -= hit;
		
		if(this.dieCallback && typeof this.dieCallback == "function")
		{
			this.dieCallback(this.life);				
		}
		
		var die = false;
		if(this.life <= 0)
		{
			this.end();
			this.removeFromParent(true);
			die = true;
		}
		return die;
	},
	setEnd: function(callback) {
		this.end = callback;
	}
});