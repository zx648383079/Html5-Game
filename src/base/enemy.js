cc.EnemySprite = cc.RobotSprite.extend({
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
				this.y -= this.speed;
				if(this.y < -30) {
					this.die(9999);
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
		var hit = arguments[0] || this.life;
		var suicide = arguments[1] || false;
		this.life -= hit;
		
		var die = false;
		if(this.life <= 0)
		{
			this._parent.enemyCount --;		
			if(suicide && this.dieCallback && typeof this.dieCallback == "function")
			{
			 	this.dieCallback(this.value);				
			}
			this.removeFromParent(true);
			die = true;
		}
		return die;
	}
});