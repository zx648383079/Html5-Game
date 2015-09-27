var GameLayer = cc.BaseLayer.extend({
    sprite:null,
    ctor:function () {
        this._super();
        this.loadingScene();
        this.addTitleLayer();        
        this.addShip();
        this.beginGame();
        this.addKeyEvent();
        return true;
    },
    loadingScene: function() {
        var gamescene = ccs.load(res.GameScene_json);
        this.addChild(gamescene.node);
        this.bg = gamescene.node.getChildByName('GameBg');
    },
    addTitleLayer: function() {
        var title = ccs.load(res.TitleLayer_json).node;
        title.setLocalZOrder(99);
        title.y = cc.winSize.height - 300;
        this.score = title.getChildByName('score');
        this.life = title.getChildByName('life');
        this.lifeCount = 100;
        this.lifeText = title.getChildByName('lifeText');
        this.addChild(title);
        this.score.setString(0);
    },
    setLife: function( parent, value ) {
        parent.life.setPercent(parseInt( value / parent.lifeCount * 100 ));
        parent.lifeText.setString(value);
    },
    addShip: function() {
        this.ship = RobotSprite(GameRes.Ship, GameRes.Bullet, robotKind.SHIP);
        this.ship.setDieCallback(this.setLife);
        this.lifeCount = this.ship.life;
        this.setLife(this,this.lifeCount);
        this.addChild(this.ship);
    },
    beginGame: function() {
        this.enemyCount = 0;
        this.schedule(this.addEnemy, 2, cc.REPEAT_FOREVER, 3);        
    },
    addEnemy: function() {
        if(this.enemyCount < 10)
        {
            var enemy = RobotSprite(GameRes.Enemy);
            enemy.setDieCallback(this.addScore);          
            this.addChild(enemy);
            this.enemyCount ++;
            console.log(this.enemyCount);
        }        
    },
    addScore: function(self) {
      self._parent.score.setString( Number(self._parent.score.getString()) + self.value ); 
      console.log(self._parent.score.getString()); 
    },
    addKeyEvent: function() {
        cc.eventManager.addListener({    
            event: cc.EventListener.KEYBOARD,    
            onKeyPressed:  function(keyCode, event){ 
                var ship = event.getCurrentTarget().ship;
                switch (keyCode) {
                    case 32:
                        ship.shoot();//空格
                        break;
                    case 38:
                    case 87:
                        ship.move(0);
                        break;
                    case 37:
                    case 65:
                        ship.move(3);
                        break;
                    case 40:
                    case 83:
                        ship.move(2);
                        break;
                    case 39:
                    case 68:
                        ship.move(1);
                        break;
                    default:
                        console.log(keyCode);
                        break;
                }
            }
        }, this); 
    },
    onEnter: function() {
        this._super();
        this.scheduleUpdate();
    },
    moveRobot: function() {
       this.callChildrenByName('enemy',function(child,ship) {
            child.collide(ship);
            child.move();
        },this.ship);
    },
    moveBullet: function() {
        this.callChildrenByName('bullet',function(child,parent) {
            child.move();
            parent.callChildrenByName('enemy',function(child,bullet) {
                bullet.collide(child);
            },child);
            if(child.y > 960)
            {
                child.die(); 
            } 
            
        },this);
    },
    update: function() {
        this.bg.y -= 2;
        if(this.bg.y < -362)
        {
            this.bg.y =0;
        }
        this.moveRobot();
        this.moveBullet();
    }
});

var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        this.addGameLayer();
    },
    addGameLayer: function() {
        var layer = new GameLayer();
        this.addChild(layer);
    }
});