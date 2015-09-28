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
    loadingEnd: function() {
		var scene = new EndScene();
		scene.score = this.score.getString();
		cc.director.runScene(new cc.TransitionFade(1, scene));		
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
    setLife: function( value ) {
        this.life.setPercent(parseInt( value / this.lifeCount * 100 ));
        this.lifeText.setString(value);
    },
    addShip: function() {
        this.ship = RobotSprite(GameRes.Ship, GameRes.Bullet, robotKind.SHIP);
        this.ship.setDieCallback(this.setLife.bind(this));
        this.lifeCount = this.ship.life;
        this.setLife(this.lifeCount);
        this.ship.setEnd(this.loadingEnd.bind(this));
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
            enemy.setDieCallback(this.addScore.bind(this));          
            this.addChild(enemy);
            this.enemyCount ++;
            console.log(this.enemyCount);
        }        
    },
    addScore: function(value) {
      this.score.setString( Number(this.score.getString()) + value ); 
      console.log(this.score.getString()); 
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