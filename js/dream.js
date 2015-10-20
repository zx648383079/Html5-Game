zodream = function() {
	return new zodream.fn();
};

zodream.fn = function() {
	this.init(arguments[0] || window.document.body);
	return this;
};

zodream.fn.prototype = {
	init: function(canvas) {
		this.initThree(canvas);
		this.initCamera();
		this.initScene();
		this.initLight();
		this.initObject();
		this.initStats(canvas);
		this.render();
	},
	initThree: function(canvas) {
		if(typeof canvas == "string") {
			canvas = document.getElementById( canvas );
		}
		
		this.width = canvas.clientWidth;
		this.height = canvas.clientHeight;
		
		if(this.height <= 0) {
			this.height = 600;
		}
		
		this.renderer = new THREE.WebGLRenderer({
			antialias : true
		});
		this.renderer.setSize(this.width, this.height);
		canvas.appendChild(this.renderer.domElement);
		this.renderer.setClearColor(0xFFFFFF, 1.0);	
	},
	initStats: function(canvas) {
		this.stats = new Stats();
		this.stats.domElement.style.position = 'absolute';
		this.stats.domElement.style.left = '0px';
		this.stats.domElement.style.top = '0px';
		canvas.appendChild(this.stats.domElement);	
	},
	initCamera: function() {
		this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 10000);
		this.camera.position.x = 0;
		this.camera.position.y = 1000;
		this.camera.position.z = 0;
		this.camera.up.x = 0;
		this.camera.up.y = 0;
		this.camera.up.z = 1;
		this.camera.lookAt({
			x : 0,
			y : 0,
			z : 0
		});	
	},
	initScene: function() {
		this.scene = new THREE.Scene();
	},
	initLight: function() {
		this.light = new THREE.DirectionalLight(0xFF0000, 1.0, 0);
		this.light.position.set(100, 100, 200);
		this.scene.add(this.light);
	},
	initObject: function() {
		var geometry = new THREE.Geometry();
		var material = new THREE.LineBasicMaterial( { vertexColors: THREE.VertexColors} );
		var color1 = new THREE.Color( 0x444444 ), color2 = new THREE.Color( 0xFF0000 );

		// 线的材质可以由2点的颜色决定
		var p1 = new THREE.Vector3( -100, 0, 100 );
		var p2 = new THREE.Vector3(  100, 0, -100 );
		geometry.vertices.push(p1);
		geometry.vertices.push(p2);
		geometry.colors.push( color1, color2 );

		var line = new THREE.Line( geometry, material, THREE.LineSegments );
		this.scene.add(line);
	},
	initTween: function() {
		new TWEEN.Tween( mesh.position)
            .to( { x: -400 }, 3000 ).repeat( Infinity ).start();
		TWEEN.update();
	},
	render: function() {
		this.renderer.clear();
		this.renderer.render(this.scene, this.camera);
		requestAnimationFrame(this.render.bind(this));
		
		this.stats.update();
	}
};

(function() {
	zodream();
})();