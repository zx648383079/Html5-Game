var StartLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        this._super();
        this.loadingScene();
        return true;
    },
    loadingScene: function() {
       var startscene = ccs.load(res.StartScene_json);
       this.addChild(startscene.node); 
       
        var button = startscene.node.getChildByName('PlayButton').getChildByName('Button_1');
        button.addClickEventListener(function() {
            cc.director.runScene(new cc.TransitionFade(1, new GameScene()));
        });
    }
});


var StartScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new StartLayer();
        this.addChild(layer);
    }
});