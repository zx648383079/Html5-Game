cc.BaseLayer = cc.Layer.extend({
	callChildrenByName: function(name, callback) {
		var children = this._children;
		var param = arguments[2] || null;            //传给 callback 的参数
		for(var i = 0 ; i < children.length; i++) {
			if(children[i]._name === name)
			{
				callback( children[i] , param);
			}
		};
	},
	getChildrenCoutByName: function( name ) {
		var count = 0;
		for(var i = 0,len = this._children.length; i < len; i++) {
			if(this._children[i]._name === name)
			{
				count ++;
			}
		};
		return count;
	}
});