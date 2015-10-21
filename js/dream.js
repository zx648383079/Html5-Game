window.requestNextAnimationFrame = (function () {
	var originalWebkitRequestAnimationFrame = undefined,
		wrapper = undefined,
		callback = undefined,
		geckoVersion = 0,
		userAgent = navigator.userAgent,
		index = 0,
		self = this;
	
	if (window.webkitRequestAnimationFrame) {
		wrapper = function (time) {
		if (time === undefined) {
			time = +new Date();
		}
		self.callback(time);
		};
		
		originalWebkitRequestAnimationFrame = window.webkitRequestAnimationFrame;    

		window.webkitRequestAnimationFrame = function (callback, element) {
		self.callback = callback;
		originalWebkitRequestAnimationFrame(wrapper, element);
		}
	}
	if (window.mozRequestAnimationFrame) {
		index = userAgent.indexOf('rv:');

		if (userAgent.indexOf('Gecko') != -1) {
		geckoVersion = userAgent.substr(index + 3, 3);

		if (geckoVersion === '2.0') {
			window.mozRequestAnimationFrame = undefined;
		}
		}
	}
	
	return window.requestAnimationFrame   ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame    ||
		window.oRequestAnimationFrame      ||
		window.msRequestAnimationFrame     ||

		function (callback, element) {
		var start,
			finish;

		window.setTimeout( function () {
			start = +new Date();
			callback(start);
			finish = +new Date();

			self.timeout = 1000 / 60 - (finish - start);

		}, self.timeout);
		};
	}
)();

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
		this.sphere = new THREE.Mesh(
				new THREE.SphereGeometry(20,20),                //width,height,depth
				new THREE.MeshLambertMaterial({color: 0xff0000}) //材质设定
		);
		this.scene.add(this.sphere);
		this.sphere.position.set(0,0,0);	
	},
	initLine: function() {
		var geometry = new THREE.Geometry();
		var material = new THREE.LineBasicMaterial( { vertexColors: THREE.VertexColors} );
		var color1 = new THREE.Color( 0x444444 ), color2 = new THREE.Color( 0xFF0000 );
		
		// 线的材质可以由2点的颜色决定
		geometry.vertices.push(
			new THREE.Vector3( -100, 0, 100 ),
			new THREE.Vector3(  100, 0, -100 )
		);
		geometry.colors.push( color1, color2 );
		var line = new THREE.Line( geometry, material, THREE.LineSegments );  //LineSegments一系列线
		this.scene.add(line);
	},
	initBone: function() {
		new THREE.Bone()	//骨头
		SkinnedMesh          //骨骼
		
		
		var bones = [];
		
		var shoulder = new THREE.Bone();
		var elbow = new THREE.Bone();
		var hand = new THREE.Bone();
		
		shoulder.add( elbow );
		elbow.add( hand );
		
		bones.push( shoulder );
		bones.push( elbow );
		bones.push( hand );
		
		shoulder.position.y = -5;
		elbow.position.y = 0;
		hand.position.y = 5;
		
		var armSkeleton = THREE.Skeleton( bones );        //骨骼
	},
	initLensFlare: function() {
		new THREE.LensFlare() //光晕	
	},
	initLOD: function() {
		var lod = new THREE.LOD();             //显示水平网格
		for( var i = 0; i < 5; i++ ) {
			
			var geometry = new THREE.IcosahedronGeometry( 10, 5 - i )
			
			new THREE.Mesh( geometry, material );
			
			lod.addLevel( mesh, i * 50 );
			
		}	
	},
	initMesh: function() {
		var geometry = new THREE.BoxGeometry( 1, 1, 1 );
		var material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
		var mesh = new THREE.Mesh( geometry, material );             //网格对象的基类
		scene.add( mesh );	
	},
	initMorphAnimMesh: function() {
		meshAnim = new THREE.MorphAnimMesh( geometry, material );                //变形动画
		meshAnim.duration = 1000;
		scene.add( meshAnim );	
		
		var delta = clock.getDelta();
		meshAnim.updateAnimation( 1000 * delta );
	},
	initPoints: function() {
		Points                           //粒子
	},
	initSprite: function() {
		var map = THREE.ImageUtils.loadTexture( "sprite.png" );
		var material = new THREE.SpriteMaterial( { map: map, color: 0xffffff, fog: true } );
		var sprite = new THREE.Sprite( material );
		scene.add( sprite );	
	},
	initTween: function() {
		new TWEEN.Tween( mesh.position)
            .to( { x: -400 }, 3000 ).repeat( Infinity ).start();
		TWEEN.update();
	},
	render: function() {
		this.renderer.clear();
		this.renderer.render(this.scene, this.camera);
		window.requestNextAnimationFrame(this.render.bind(this));
		
		this.stats.update();
	}
};

(function() {
	zodream();
})();