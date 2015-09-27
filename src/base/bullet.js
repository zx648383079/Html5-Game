cc.BulletSprite = cc.Sprite.extend({
	move: function()
	{
		switch (this.direction) 
		{
			case direction.UP:
				this.y += this.speed;
				break;
			case direction.RIGHT:
				this.x -= this.speed;
				break;
			case direction.DOWN:
				this.y -= this.speed;
				break;
			case direction.LEFT:
				this.x += this.speed;
				break;
			default:
				break;
		}
	},
	collide: function(robotSprite)
	{
		if( this.boundCollide(this.getBoundingBox(), robotSprite.getBoundingBox()) )
		{
			robotSprite.die(this.power,true);
			this.die();
			console.log("=====子弹碰撞=====");
			return true;
		}
		return false;
	},
	boundCollide: function(rect1 , rect2) {
		return rect1.x < rect2.x + rect2.width && 
			   rect1.y < rect2.y + rect2.height && 
			   rect1.x + rect1.width > rect2.x &&　
			   rect1.y + rect1.height > rect2.y;
	},
	die: function() 
	{
		this.removeFromParent(true);
	}
});


/* 创造子弹精灵 */
var BulletSprite = function( bulletRes )
{
	var bullet = new cc.BulletSprite(bulletRes.src);
    bullet.setName('bullet');
	bullet.power = bulletRes.power;
	bullet.speed = bulletRes.speed;
	bullet.direction = arguments[1] || direction.UP;
	var x = arguments[2] || 0,
	    y = arguments[3] || 0;
	bullet.setPosition( x , y );
	return bullet;
};