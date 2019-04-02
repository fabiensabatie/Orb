if ( WEBGL.isWebGLAvailable() === false )
	document.body.appendChild( WEBGL.getWebGLErrorMessage() );
let orb, controls, camera, scene, renderer, mixer, loader;

function init() {

	/* Selecting the container */
	orb = document.querySelector("#orb");
	document.body.appendChild( orb );

	/* Creating the camera and setting up controls */
	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.25, 20);
	camera.position.set(0, 0, 3);
	controls = new THREE.OrbitControls(camera);

	/* Creating the scene */
	scene = new THREE.Scene();

	/* Creating the lights and defining their position */
	var lights = [];
	lights[0] = new THREE.PointLight(0xffffff, .4, 0);
	lights[1] = new THREE.PointLight(0xffffff, .3, 0);
	lights[2] = new THREE.PointLight(0xffffff, .8, 0);
	lights[3] = new THREE.AmbientLight(0x916262);
	lights[4] = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);

	lights[0].position.set(0, 200, 0);
	lights[1].position.set(100, 200, 100);
	lights[2].position.set(-100, -200, -100, 100);

	/* Adding the lights to the scene */
	for (let l of lights) scene.add(l);

	/* Setting up the render */
	renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

	renderer.setClearColor(0xffffff, 1);
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.gammaOutput = true;
	orb.appendChild(renderer.domElement);

	/* Resizing the window */
	window.addEventListener('resize', onWindowResize, false);

	/* Loading the orb */
	loader = new THREE.GLTFLoader();
	loader.load('assets/scenes/Planet.gltf', (gltf) => {
		scene.add(gltf.scene);
		mixer = new THREE.AnimationMixer(gltf.scene);
		gltf.animations.forEach((clip) => { mixer.clipAction(clip).play(); });
	});
}

/* We change the render size when the window is resized */
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

/* Starting the animations */
function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
	if (mixer) mixer.update(0.01);
}

/* That's all folks */
init();
animate();
