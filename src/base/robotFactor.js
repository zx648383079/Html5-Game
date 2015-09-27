/* 机甲基类 */
var RobotSprite = function( robotRes )
{
	var robot;
	var kind = arguments[2] || robotKind.ENEMY;
	switch ( kind ) {
		case robotKind.SHIP:
			robot = new cc.ShipSprite(robotRes.src);
			robot.direction = direction.UP;
			robot.x = cc.winSize.width/2;
			robot.y = 100;
			robot.setName('ship');
			robot.runAction( cc.MoveTo.create(1 , robot.x, 100) );
			break;
		case robotKind.ENEMY:
			robot = new cc.EnemySprite(robotRes.src);
			robot.direction = direction.DOWN;
			robot.x = 50 + Math.random()*0.9*cc.winSize.width;
			robot.y = cc.winSize.height + 50;
			robot.setName('enemy');
			robot.value = robotRes.value;
			break;
		default:
			break;
	}
	robot.life = robotRes.life;
	robot.speed = robotRes.speed;
	robot.bullet = arguments[1] || null; 
	robot.setDieCallback(arguments[3] || null);
	console.log("=====加载角色！=====");
	return robot;
};