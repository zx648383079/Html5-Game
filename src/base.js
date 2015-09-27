/* 方向朝向 */
var direction = {
	UP: 0,
	RIGHT: 1,
	DOWN: 2,
	LEFT: 3
};

/* 机器人种类 */
var robotKind = {
    SHIP: 1,
    ENEMY: 0
}

/* 游戏资源及属性 */
var GameRes = {
	Ship: {
        src: res.Ship,
        speed: 10,
        life: 1
    },
    Bullet: {
        src: res.Bullet,
        speed: 10,
        power: 1
    },
    Enemy: {
        src: res.Enemy,
        speed: 3,
        life: 1,
        value: 10
    }
};
