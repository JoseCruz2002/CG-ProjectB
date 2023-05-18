//////////////////////
/* GLOBAL VARIABLES */
//////////////////////
var scene, renderer, currentCameraIndex = 0;
const cameras = [];

var mesh, geometry;
const materials = [];

var clock;

var trailer;

var wireFramed = true;
var moveTrailerForward = false;
var moveTrailerBack = false;
var moveTrailerLeft = false;
var moveTrailerRight = false;

/* Constants to use */
const SIZE_SCALING = 30;

// Scaling sizes for the trailer components (the wheels are also used in the robot)
const X_CONTAINER = 1.2 * SIZE_SCALING;
const Y_CONTAINER = 1.2 * SIZE_SCALING;
const Z_CONTAINER = 2.0 * SIZE_SCALING;

const X_WHEEL_JOINT = 0.4 * SIZE_SCALING;
const Y_WHEEL_JOINT = 0.4 * SIZE_SCALING;
const Z_WHEEL_JOINT = 1.2 * SIZE_SCALING;

const R_WHEEL = 0.2 * SIZE_SCALING;
const H_WHEEL = 0.2 * SIZE_SCALING;

const X_COUPLE = 0.2 * SIZE_SCALING;
const Y_COUPLE = 0.2 * SIZE_SCALING;
const Z_COUPLE = 0.2 * SIZE_SCALING;
const Z_TRANSLATION = 0.6 * SIZE_SCALING;

const TRAILER_VELOCITY_Z = 40;
const TRAILER_VELOCITY_X = 40;

//---------------------------------------------------------------------------------


////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////
/**
 * Creates the trailer piece where the wheels get placed.
 * 
 * @param {*} obj parent object - trailer
 * @param {*} x 
 * @param {*} y 
 * @param {*} z 
 */
function createWheelJoint(obj, x, y, z) {
    'use strict';

    geometry = new THREE.CubeGeometry(X_WHEEL_JOINT, Y_WHEEL_JOINT, Z_WHEEL_JOINT);
    mesh = new THREE.Mesh(geometry, materials[0]);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

/**
 * Creates a wheel and places it on the wheelJoint
 * 
 * @param {*} obj parent object - trailer
 * @param {*} x 
 * @param {*} y 
 * @param {*} z 
 */
function createWheel(obj, x, y, z) {
    'use strict';

    geometry = new THREE.CylinderGeometry(R_WHEEL, R_WHEEL, H_WHEEL, 64);
    mesh = new THREE.Mesh(geometry, materials[0]);
    mesh.rotation.z = Math.PI/2;
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

/**
 * Creates the accoplation place, where the truck and trailer are joined
 * 
 * @param {*} obj 
 * @param {*} x 
 * @param {*} y 
 * @param {*} z 
 */
function createCouplingThing(obj, x, y, z) {
    'use strict';

    geometry = new THREE.CubeGeometry(X_COUPLE, Y_COUPLE, Z_COUPLE);
    mesh = new THREE.Mesh(geometry, materials[0]);
    mesh.position.set(x, y ,z);
    obj.add(mesh);
}

/**
 * Create the container for the trailer
 * 
 * @param {*} obj parent object - trailer
 * @param {*} x 
 * @param {*} y 
 * @param {*} z 
 */
function createContainer(obj, x, y, z) {
    'use strict';

    geometry = new THREE.CubeGeometry(X_CONTAINER, Y_CONTAINER, Z_CONTAINER);
    mesh = new THREE.Mesh(geometry, materials[0]);
    mesh.position.set(x, y ,z);
    obj.add(mesh);
}

/* CREATE THE TRAILER OBJECT */
function createTrailer(x, y, z) {
    'use strict';

    trailer = new THREE.Object3D();

    materials[0] = new THREE.MeshBasicMaterial({color: 0x807979, wireframe: true});

    createContainer(trailer, 0, 0, 0);
    createWheelJoint(trailer, (X_CONTAINER-X_WHEEL_JOINT)/2, -(Y_CONTAINER+Y_WHEEL_JOINT)/2, -(Z_CONTAINER-Z_WHEEL_JOINT)/2);
    createWheelJoint(trailer, -(X_CONTAINER-X_WHEEL_JOINT)/2, -(Y_CONTAINER+Y_WHEEL_JOINT)/2, -(Z_CONTAINER-Z_WHEEL_JOINT)/2);
    createWheel(trailer, (X_CONTAINER-X_WHEEL_JOINT)/2, -(Y_CONTAINER+Y_WHEEL_JOINT+R_WHEEL*2)/2, (Z_WHEEL_JOINT+R_WHEEL*3-Z_CONTAINER)/2);
    createWheel(trailer, (X_CONTAINER-X_WHEEL_JOINT)/2, -(Y_CONTAINER+Y_WHEEL_JOINT+R_WHEEL*2)/2, (Z_WHEEL_JOINT-R_WHEEL*3-Z_CONTAINER)/2);
    createWheel(trailer, -(X_CONTAINER-X_WHEEL_JOINT)/2, -(Y_CONTAINER+Y_WHEEL_JOINT+R_WHEEL*2)/2, (Z_WHEEL_JOINT+R_WHEEL*3-Z_CONTAINER)/2);
    createWheel(trailer, -(X_CONTAINER-X_WHEEL_JOINT)/2, -(Y_CONTAINER+Y_WHEEL_JOINT+R_WHEEL*2)/2, (Z_WHEEL_JOINT-R_WHEEL*3-Z_CONTAINER)/2);
    createCouplingThing(trailer, 0, -(Y_CONTAINER+Y_COUPLE)/2, Z_TRANSLATION);

    scene.add(trailer);

    trailer.position.set(x, y, z);
}


/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene() {
    'use strict';

    scene = new THREE.Scene();

    scene.add(new THREE.AxisHelper(100));
    scene.background = new THREE.Color(0xffeeff);

    //createRobot();
    createTrailer(0, 0, 0);
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////
function createCameras() {
    'use strict';

    //orthogonal cameras (1, 2, 3, 4)
    for (let i = 0; i < 4; i++) {
        cameras[i] = new THREE.OrthographicCamera(window.innerWidth/-2, window.innerWidth/2, 
                     window.innerHeight/2, window.innerHeight/-2, 1, 1000);
    }
    cameras[0].position.x = 0;
    cameras[0].position.y = 0;
    cameras[0].position.z = 100;
    cameras[0].lookAt(scene.position);

    cameras[1].position.x = 100;
    cameras[1].position.y = 0;
    cameras[1].position.z = 0;
    cameras[1].lookAt(scene.position);

    cameras[2].position.x = 0;
    cameras[2].position.y = 100;
    cameras[2].position.z = 0;
    cameras[2].lookAt(scene.position);

    cameras[3].position.x = 100;
    cameras[3].position.y = 100;
    cameras[3].position.z = 100;
    cameras[3].lookAt(scene.position);

    //perspective camera (5)
    cameras[4] = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    cameras[4].position.x = 100;
    cameras[4].position.y = -10;
    cameras[4].position.z = 0;
    cameras[4].lookAt(scene.position);

}


//////////////////////
/* CHECK COLLISIONS */
//////////////////////
function checkCollisions(){
    'use strict';

}

///////////////////////
/* HANDLE COLLISIONS */
///////////////////////
function handleCollisions(){
    'use strict';

}

////////////
/* UPDATE */
////////////
function update(){
    'use strict';

    var delta = clock.getDelta();
    
    // changes the wireframe attribute of all the materials
    for (let i = 0; i < materials.length; i++) { 
        materials[i].wireframe = wireFramed;
    }

    // moves the trailer
    if (moveTrailerForward) {
        trailer.position.z = trailer.position.z + TRAILER_VELOCITY_Z*delta;
    }
    if (moveTrailerBack) {
        trailer.position.z = trailer.position.z - TRAILER_VELOCITY_Z*delta;
    }
    if (moveTrailerLeft) {
        trailer.position.x = trailer.position.x - TRAILER_VELOCITY_X*delta;
    }
    if (moveTrailerRight) {
        trailer.position.x = trailer.position.x + TRAILER_VELOCITY_X*delta;
    }
}

/////////////
/* DISPLAY */
/////////////
function render() {
    'use strict';
    renderer.render(scene, cameras[currentCameraIndex]);
}

////////////////////////////////
/* INITIALIZE ANIMATION CYCLE */
////////////////////////////////
function init() {
    'use strict';

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    createScene();
    createCameras();

    clock = new THREE.Clock();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", onResize);
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
    'use strict';

    //update
    update();

    //display
    render();

    requestAnimationFrame(animate);

}

////////////////////////////
/* RESIZE WINDOW CALLBACK */
////////////////////////////
function onResize() { 
    'use strict';

    renderer.setSize(window.innerWidth, window.innerHeight);

    if (window.innerHeight > 0 && window.innerWidth > 0) {
        for (let i = 0; i < 5; i++) {
            cameras[i].aspect = window.innerWidth / window.innerHeight;
            cameras[i].updateProjectionMatrix();
        }
    }
}

///////////////////////
/* KEY DOWN CALLBACK */
///////////////////////
function onKeyDown(e) {
    'use strict';

    switch (e.keyCode) {
        case 49: //1
            currentCameraIndex = 0;
            break;
        case 50: //2
            currentCameraIndex = 1;
            break;
        case 51: //3
            currentCameraIndex = 2;
            break;
        case 52: //4
            currentCameraIndex = 3;
            break;
        case 53: //5
            currentCameraIndex = 4;
            break;
        case 54: //6
            wireFramed = !wireFramed;
            break;
        case 38: // arrow-up
            moveTrailerForward = true;
            break;
        case 40: // arrow-down
            moveTrailerBack = true;
            break;
        case 37: // arrow-left
            moveTrailerLeft = true;
            break;
        case 39: // arrow-right
            moveTrailerRight = true;
            break;
    }

}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e){
    'use strict';

    switch (e.keyCode) {
        case 38: // arrow-up
            moveTrailerForward = false;
            break;
        case 40: // arrow-down
            moveTrailerBack = false;
            break;
        case 37: // arrow-left
            moveTrailerLeft = false;
            break;
        case 39: // arrow-right
            moveTrailerRight = false;
            break;
    }
}