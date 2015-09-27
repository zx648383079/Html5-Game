var EndLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        this._super();
        this.loadingScene();
        return true;
    },
    loadingScene: function() {
       var scene = ccs.load(res.EndScene_json);
       this.addChild(scene.node); 
        var button = scene.node.getChildByName('AgainButton');
        button.addClickEventListener(function() {
            cc.director.runScene(new cc.TransitionFade(1, new GameScene()));
        });
    }
});


var EndScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new EndLayer();
        ((layer.getChildren()[0]).getChildByName("score")).setString("您最终得分：\n" + this.score);        
        this.addChild(layer);  
    }
});