var res = {
    StartScene_json : "res/StartScene.json",
    GameScene_json : "res/GameScene.json",
    EndScene_json : "res/EndScene.json",
    TitleLayer_json : "res/TitleLayer.json",
    Ship: "res/image/ship.png",
    Bullet: "res/image/bullet.png",
    Enemy:  "res/image/enemy.png"
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}
