//////////////////////
/* GLOBAL VARIABLES */
//////////////////////
var scene, renderer, currentCameraIndex = 0;
const cameras = [];

var mesh, geometry;
const materials = [];

var clock;

var trailer;
var head;
var leftArm;
var rightArm;

var wireFramedChange = false, wireFramedChanged = false;
var moveTrailerForward = false;
var moveTrailerBack = false;
var moveTrailerLeft = false;
var moveTrailerRight = false;
var rotateHeadIn = false;
var rotateHeadOut = false;
var moveArmsIn = false, moveArmsOut = false;

// These constaants are used for indexing the materials of each part of the objects.
const CONTAINER_INDEX = 0;
const COUPLE_INDEX = 1;
const WHEEL_INDEX = 2;
const WHEEL_JOINT_INDEX = 3;

const TORSO_INDEX = 4;
const ABDOMEN_INDEX = 5;
const WAIST_INDEX = 6;

const HEAD_BASE_INDEX = 7;
const EYES_INDEX = 8;
const ANTENAS_INDEX = 9;

const ARM_INDEX = 10;
const EXHAUST_INDEX = 11;
const LEGS_INDEX = 12;

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
const Z_COUPLE_TRANSLATION = 0.6 * SIZE_SCALING;

const TRAILER_VELOCITY_Z = 40;
const TRAILER_VELOCITY_X = 40;


// Scaling sizes for the robot components (the wheels are in the trailer components)
// Base of the robot, torso, abdomen and waist (with wheels)
const X_TORSO = 1.1 * SIZE_SCALING;
const Y_TORSO = 0.7 * SIZE_SCALING;
const Z_TORSO = 0.7 * SIZE_SCALING;

const X_ABDOMEN = 0.7 * SIZE_SCALING;
const Y_ABDOMEN = 0.2 * SIZE_SCALING;
const Z_ABDOMEN = 0.2 * SIZE_SCALING;

const X_WAIST = 0.7 * SIZE_SCALING;
const Y_WAIST = 0.3 * SIZE_SCALING;
const Z_WAIST = 0.7 * SIZE_SCALING;

// head of the robot, with the head, eyes, antenas and rotation angle for the head
const X_HEAD_BASE = 0.3 * SIZE_SCALING;
const Y_HEAD_BASE = 0.3 * SIZE_SCALING;
const Z_HEAD_BASE = 0.3 * SIZE_SCALING;

const X_EYE = 0.1 * SIZE_SCALING;
const Y_EYE = 0.1 * SIZE_SCALING;
const Z_EYE = 0.1 * SIZE_SCALING;
const X_EYE_TRANSLATION = 0.08 * SIZE_SCALING;
const Y_EYE_TRANSLATION = 0.05 * SIZE_SCALING;

const R_ANTENA = 0.1 / 2 * SIZE_SCALING;
const H_ANTENA = 0.1 * SIZE_SCALING;

const HEAD_ROTATION_ANGLE = Math.PI;

// arms of the robot, with the upper and lower arm 

const X_UPPER_ARM = 0.3 * SIZE_SCALING;
const Y_UPPER_ARM = 0.8 * SIZE_SCALING;
const Z_UPPER_ARM = 0.2 * SIZE_SCALING;

const X_FORE_ARM = 0.3 * SIZE_SCALING;
const Y_FORE_ARM = 0.2 * SIZE_SCALING;
const Z_FORE_ARM = 0.7 * SIZE_SCALING;

const R_EXHAUST = 0.1 / 2 * SIZE_SCALING;
const H_EXHAUST = 0.2 * SIZE_SCALING;

const ARM_VELOCITY = 30;

// legs of the robot

const X_UPPER_LEG = 0.2 * SIZE_SCALING;
const Y_UPPER_LEG = 0.3 * SIZE_SCALING;
const Z_UPPER_LEG = 1.6 * SIZE_SCALING;

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
    mesh = new THREE.Mesh(geometry, materials[WHEEL_JOINT_INDEX]);
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

    geometry = new THREE.CylinderGeometry(R_WHEEL, R_WHEEL, H_WHEEL, 34);
    mesh = new THREE.Mesh(geometry, materials[WHEEL_INDEX]);
    mesh.rotation.z = Math.PI / 2;
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
function createCouplingDevice(obj, x, y, z) {
    'use strict';

    geometry = new THREE.CubeGeometry(X_COUPLE, Y_COUPLE, Z_COUPLE);
    mesh = new THREE.Mesh(geometry, materials[COUPLE_INDEX]);
    mesh.position.set(x, y, z);
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
    mesh = new THREE.Mesh(geometry, materials[CONTAINER_INDEX]);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

/* CREATE THE TRAILER OBJECT */
function createTrailer(x, y, z) {
    'use strict';

    trailer = new THREE.Object3D();

    materials[CONTAINER_INDEX] = new THREE.MeshBasicMaterial({ color: 0x807979, wireframe: true });
    materials[COUPLE_INDEX] = new THREE.MeshBasicMaterial({ color: 0x807900, wireframe: true });
    materials[WHEEL_INDEX] = new THREE.MeshBasicMaterial({ color: 0x800079, wireframe: true });
    materials[WHEEL_JOINT_INDEX] = new THREE.MeshBasicMaterial({ color: 0x007979, wireframe: true });

    createContainer(trailer, 0, 0, 0);
    createWheelJoint(trailer, (X_CONTAINER - X_WHEEL_JOINT) / 2, -(Y_CONTAINER + Y_WHEEL_JOINT) / 2, -(Z_CONTAINER - Z_WHEEL_JOINT) / 2);
    createWheelJoint(trailer, -(X_CONTAINER - X_WHEEL_JOINT) / 2, -(Y_CONTAINER + Y_WHEEL_JOINT) / 2, -(Z_CONTAINER - Z_WHEEL_JOINT) / 2);
    createWheel(trailer, (X_CONTAINER - X_WHEEL_JOINT) / 2, -(Y_CONTAINER + Y_WHEEL_JOINT + R_WHEEL * 2) / 2, (Z_WHEEL_JOINT + R_WHEEL * 3 - Z_CONTAINER) / 2);
    createWheel(trailer, (X_CONTAINER - X_WHEEL_JOINT) / 2, -(Y_CONTAINER + Y_WHEEL_JOINT + R_WHEEL * 2) / 2, (Z_WHEEL_JOINT - R_WHEEL * 3 - Z_CONTAINER) / 2);
    createWheel(trailer, -(X_CONTAINER - X_WHEEL_JOINT) / 2, -(Y_CONTAINER + Y_WHEEL_JOINT + R_WHEEL * 2) / 2, (Z_WHEEL_JOINT + R_WHEEL * 3 - Z_CONTAINER) / 2);
    createWheel(trailer, -(X_CONTAINER - X_WHEEL_JOINT) / 2, -(Y_CONTAINER + Y_WHEEL_JOINT + R_WHEEL * 2) / 2, (Z_WHEEL_JOINT - R_WHEEL * 3 - Z_CONTAINER) / 2);
    createCouplingDevice(trailer, 0, -(Y_CONTAINER + Y_COUPLE) / 2, Z_COUPLE_TRANSLATION);

    scene.add(trailer);

    trailer.position.set(x, y, z);
}

/**
 * Creates the Torso of the robot (base)
 * 
 * @param {*} obj parent object - baseForRobot
 * @param {*} x 
 * @param {*} y 
 * @param {*} z 
 */
function createTorso(obj, x, y, z) {
    'use strict';

    geometry = new THREE.CubeGeometry(X_TORSO, Y_TORSO, Z_TORSO);
    mesh = new THREE.Mesh(geometry, materials[TORSO_INDEX]);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

/**
 * Creates the Abdomen of the robot (base)
 * 
 * @param {*} obj parent object - baseForRobot
 * @param {*} x 
 * @param {*} y 
 * @param {*} z 
 */
function createAbdomen(obj, x, y, z) {
    'use strict';

    geometry = new THREE.CubeGeometry(X_ABDOMEN, Y_ABDOMEN, Z_ABDOMEN);
    mesh = new THREE.Mesh(geometry, materials[ABDOMEN_INDEX]);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

/**
 * Creates the Abdomen of the robot (base)
 * 
 * @param {*} obj parent object - baseForRobot
 * @param {*} x 
 * @param {*} y 
 * @param {*} z 
 */
function createWaist(obj, x, y, z) {
    'use strict';

    geometry = new THREE.CubeGeometry(X_WAIST, Y_WAIST, Z_WAIST);
    mesh = new THREE.Mesh(geometry, materials[WAIST_INDEX]);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

/**
 * Creates the base for the head, the "skull??".
 * 
 * @param {*} obj parent object - head
 * @param {*} x 
 * @param {*} y 
 * @param {*} z 
 */
function createHeadBase(obj, x, y, z) {
    'use strict';

    geometry = new THREE.CubeGeometry(X_HEAD_BASE, Y_HEAD_BASE, Z_HEAD_BASE);
    mesh = new THREE.Mesh(geometry, materials[HEAD_BASE_INDEX]);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

/**
 * Creates an eye for the head.
 * 
 * @param {*} obj parent object - head
 * @param {*} x 
 * @param {*} y 
 * @param {*} z 
 */
function createEye(obj, x, y, z) {
    'use strict';

    geometry = new THREE.CubeGeometry(X_EYE, Y_EYE, Z_EYE);
    mesh = new THREE.Mesh(geometry, materials[EYES_INDEX]);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

/**
 * Creates an antena for the head.
 * 
 * @param {*} obj parent object - head
 * @param {*} x 
 * @param {*} y 
 * @param {*} z 
 */
function createAntena(obj, x, y, z) {
    'use strict';

    geometry = new THREE.CylinderGeometry(R_ANTENA, R_ANTENA, H_ANTENA, 30);
    mesh = new THREE.Mesh(geometry, materials[ANTENAS_INDEX]);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

/**
 * Creates the head of the robot, the headBase, eyes and antenas.
 * The head can perform a rotation in orther to get into the body with 
 * the alpha angle over the XX axis.
 * 
 * @param {*} obj parent object - baseForRobot
 * @param {*} x 
 * @param {*} y 
 * @param {*} z 
 */
function createHead(obj, x, y, z) {
    'use strict'

    head = new THREE.Object3D();

    materials[HEAD_BASE_INDEX] = new THREE.MeshBasicMaterial({ color: 0xaaaa00, wireframe: true });
    materials[EYES_INDEX] = new THREE.MeshBasicMaterial({ color: 0xaa00aa, wireframe: true });
    materials[ANTENAS_INDEX] = new THREE.MeshBasicMaterial({ color: 0x00aaaa, wireframe: true });

    createHeadBase(head, 0, 0, 0);
    createEye(head, X_EYE_TRANSLATION, Y_EYE_TRANSLATION, (Z_HEAD_BASE - Z_EYE) / 2 + 0.01 * SIZE_SCALING);
    createEye(head, -X_EYE_TRANSLATION, Y_EYE_TRANSLATION, (Z_HEAD_BASE - Z_EYE) / 2 + 0.01 * SIZE_SCALING);
    createAntena(head, (X_HEAD_BASE - R_ANTENA * 2) / 2, (Y_HEAD_BASE + H_ANTENA) / 2, 0);
    createAntena(head, -(X_HEAD_BASE - R_ANTENA * 2) / 2, (Y_HEAD_BASE + H_ANTENA) / 2, 0);

    head.position.set(x, y + Y_HEAD_BASE / 2, z);

    obj.add(head);
}


/**
 * Creates an upper arm.
 * 
 * @param {*} obj parent object - baseForRobot
 * @param {*} x 
 * @param {*} y 
 * @param {*} z 
 */
function createUpperArm(obj, x, y, z) {
    'use strict';

    geometry = new THREE.CubeGeometry(X_UPPER_ARM, Y_UPPER_ARM, Z_UPPER_ARM);
    mesh = new THREE.Mesh(geometry, materials[ARM_INDEX]);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

/**
 * Creates a forearm.
 * 
 * @param {*} obj parent object - baseForRobot
 * @param {*} x 
 * @param {*} y 
 * @param {*} z 
 */
function createForeArm(obj, x, y, z) {
    'use strict';

    geometry = new THREE.CubeGeometry(X_FORE_ARM, Y_FORE_ARM, Z_FORE_ARM);
    mesh = new THREE.Mesh(geometry, materials[ARM_INDEX]);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

/**
 * Creates an tube for the arm.
 * 
 * @param {*} obj parent object - head
 * @param {*} x 
 * @param {*} y 
 * @param {*} z 
 */
function createExhaustPipe(obj, x, y, z) {
    'use strict';

    geometry = new THREE.CylinderGeometry(R_EXHAUST, R_EXHAUST, H_EXHAUST, 30);
    mesh = new THREE.Mesh(geometry, materials[ANTENAS_INDEX]);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

/**
 * Creates the left arm of the robot
 * 
 * @param {*} obj parent object - baseForRobot
 * @param {*} x
 * @param {*} y
 * @param {*} z 
 */
function createLeftArm(obj, x, y, z) {
    'use strict'

    leftArm = new THREE.Object3D();

    materials[ARM_INDEX] = new THREE.MeshBasicMaterial({ color: 0x5500aa, wireframe: true });
    materials[EXHAUST_INDEX] = new THREE.MeshBasicMaterial({ color: 0x00aaaa, wireframe: true });

    createUpperArm(leftArm, 0, 0, 0);
    createForeArm(leftArm, 0, -(Y_UPPER_ARM+Y_FORE_ARM)/2, Z_UPPER_ARM+0.06*SIZE_SCALING);
    createExhaustPipe(leftArm, 0, (Y_UPPER_ARM / 2) + (H_EXHAUST / 2), 0)

    leftArm.position.set(x, y, z);

    obj.add(leftArm);
}

/**
 * Creates the right arm of the robot
 * 
 * @param {*} obj parent object - baseForRobot
 * @param {*} x
 * @param {*} y
 * @param {*} z 
 */
function createRightArm(obj, x, y, z) {
    'use strict'

    rightArm = new THREE.Object3D();

    createUpperArm(rightArm, 0, 0, 0);
    createForeArm(rightArm, 0, -(Y_UPPER_ARM+Y_FORE_ARM)/2, Z_UPPER_ARM+0.06*SIZE_SCALING);
    createExhaustPipe(rightArm, 0, (Y_UPPER_ARM / 2) + (H_EXHAUST / 2), 0)

    rightArm.position.set(x, y, z);

    obj.add(rightArm);
}

/**
 * Creates an upper leg.
 * 
 * @param {*} obj 
 * @param {*} x 
 * @param {*} y 
 * @param {*} z 
 */
function createUpperLeg(obj, x, y, z) {
    'use strict';

    geometry = new THREE.CubeGeometry(X_UPPER_LEG, Y_UPPER_LEG, Z_UPPER_LEG);
    mesh = new THREE.Mesh(geometry, materials[LEGS_INDEX]);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

/**
 * Creates the leg of the robot
 * 
 * @param {*} obj parent object - baseForRobot
 * @param {*} x 
 * @param {*} y 
 * @param {*} z 
 */
function createLeg(obj, obj1, x, y, z) {
    'use strict'

    obj1 = new THREE.Object3D();

    materials[ARM_INDEX] = new THREE.MeshBasicMaterial({ color: 0x55aa00, wireframe: true });
    materials[EXHAUST_INDEX] = new THREE.MeshBasicMaterial({ color: 0xaa5500, wireframe: true });


    createUpperLeg(obj1, 0, 0, 0);
    createWheel/*on leg*/(obj1, 0, 0, -(Z_UPPER_LEG / 4));
    createWheel/*on leg*/(obj1, 0, 0, (Z_UPPER_LEG / 6));
    //createForeArm(obj1, 0, -(Y_UPPER_ARM/2), Z_UPPER_ARM);
    //createTuboDeEscape(obj1, 0,(Y_UPPER_ARM/2)+(H_TUBO/2),0)

    obj1.position.set(x, y, z);

    obj.add(obj1);
}

/**
 * Creates the base for the robot, the torso, abdomen, waist and waist´s wheels.
 * 
 * @param {*} obj parent object - robot
 * @param {*} x 
 * @param {*} y 
 * @param {*} z 
 */
function createBaseForRobot(obj, x, y, z) {
    'use strict'

    var baseForRobot = new THREE.Object3D();

    materials[TORSO_INDEX] = new THREE.MeshBasicMaterial({ color: 0x00aa00, wireframe: true });
    materials[ABDOMEN_INDEX] = new THREE.MeshBasicMaterial({ color: 0xaa0000, wireframe: true });
    materials[WAIST_INDEX] = new THREE.MeshBasicMaterial({ color: 0x0000aa, wireframe: true });
    materials[WHEEL_INDEX] = new THREE.MeshBasicMaterial({ color: 0x800079, wireframe: true });

    createTorso(baseForRobot, 0, 0, 0);
    createAbdomen(baseForRobot, 0, -(Y_TORSO + Y_ABDOMEN) / 2, 0);
    createWaist(baseForRobot, 0, -(Y_TORSO + Y_ABDOMEN * 2 + Y_WAIST) / 2, 0);
    createWheel/*on waist*/(baseForRobot, (X_WAIST + H_WHEEL) / 2, -(Y_TORSO + Y_ABDOMEN * 2 + Y_WAIST) / 2, (Z_WAIST - R_WHEEL * 2) / 2);
    createWheel/*on waist*/(baseForRobot, -(X_WAIST + H_WHEEL) / 2, -(Y_TORSO + Y_ABDOMEN * 2 + Y_WAIST) / 2, (Z_WAIST - R_WHEEL * 2) / 2);

    createHead(baseForRobot, 0, Y_TORSO / 2, 0);

    createLeftArm(baseForRobot, (X_UPPER_ARM + X_TORSO) / 2, 0, 0);
    createRightArm(baseForRobot, -(X_UPPER_ARM + X_TORSO) / 2, 0, 0);

    //createLeg(baseForRobot, leftLeg, X_WAIST / 2 + X_UPPER_LEG / 2, -(Y_TORSO + Y_ABDOMEN * 2 + Y_WAIST) / 2, -(Z_UPPER_LEG / 2));
    //createLeg(baseForRobot, leftLeg, -(X_WAIST / 2 + X_UPPER_LEG / 2), -(Y_TORSO + Y_ABDOMEN * 2 + Y_WAIST) / 2, -(Z_UPPER_LEG / 2));

    obj.add(baseForRobot);
}

/**
 * Creates the robot object.
 * 
 * @param {*} x 
 * @param {*} y 
 * @param {*} z 
 */
function createRobot(x, y, z) {
    'use strict';

    var robot = new THREE.Object3D();

    createBaseForRobot(robot, 0, 0, 0);

    scene.add(robot);
    robot.position.set(x, y, z);
}


/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene() {
    'use strict';

    scene = new THREE.Scene();

    scene.add(new THREE.AxisHelper(100));
    scene.background = new THREE.Color(0xffeeff);

    createRobot(0, 0, 0);
    //createTrailer(0, 0, 0);
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////
function createCameras() {
    'use strict';

    //orthogonal cameras (1, 2, 3, 4)
    for (let i = 0; i < 4; i++) {
        cameras[i] = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2,
            window.innerHeight / 2, window.innerHeight / -2, 1, 1000);
    }
    cameras[0].position.x = 0;
    cameras[0].position.y = 0;
    cameras[0].position.z = 70;
    cameras[0].lookAt(scene.position);

    cameras[1].position.x = 70;
    cameras[1].position.y = 0;
    cameras[1].position.z = 0;
    cameras[1].lookAt(scene.position);

    cameras[2].position.x = 0;
    cameras[2].position.y = 70;
    cameras[2].position.z = 0;
    cameras[2].lookAt(scene.position);

    cameras[3].position.x = 70;
    cameras[3].position.y = 70;
    cameras[3].position.z = 70;
    cameras[3].lookAt(scene.position);

    //perspective camera (5)
    cameras[4] = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    cameras[4].position.x = 100;
    cameras[4].position.y = 100;
    cameras[4].position.z = 100;
    cameras[4].lookAt(scene.position);

}


//////////////////////
/* CHECK COLLISIONS */
//////////////////////
function checkCollisions() {
    'use strict';

}

///////////////////////
/* HANDLE COLLISIONS */
///////////////////////
function handleCollisions() {
    'use strict';

}

////////////
/* UPDATE */
////////////
function update() {
    'use strict';

    var delta = clock.getDelta();
    
    // changes the wireframe attribute of all the materials
    if (wireFramedChange && !wireFramedChanged) {
        for (let i = 0; i < materials.length; i++) {
            if (materials[i] != undefined) {
                materials[i].wireframe = !materials[i].wireframe;
            }
        }
        wireFramedChanged = true;
    }

    // moves the trailer
    var z_motion = 0, x_motion = 0;
    if (moveTrailerForward) {
        z_motion -= 1;
    }
    if (moveTrailerBack) {
        z_motion += 1;
    }
    if (moveTrailerLeft) {
        x_motion -= 1;
    }
    if (moveTrailerRight) {
        x_motion += 1;
    }
    if (z_motion != 0 || x_motion != 0) {
        trailer.translateOnAxis(new THREE.Vector3(x_motion, 0, z_motion).normalize(), TRAILER_VELOCITY_X * delta);
    }

    // moves the arms in and out the torso
    if (moveArmsIn) {
        leftArm.position.x = THREE.Math.clamp(leftArm.position.x-ARM_VELOCITY*delta, (-X_UPPER_ARM+X_TORSO)/2, (X_UPPER_ARM+X_TORSO)/2);
        rightArm.position.x = THREE.Math.clamp(rightArm.position.x+ARM_VELOCITY*delta, -(X_UPPER_ARM+X_TORSO)/2, -(-X_UPPER_ARM+X_TORSO)/2);
    }
    if (moveArmsOut) {
        leftArm.position.x = THREE.Math.clamp(leftArm.position.x+ARM_VELOCITY*delta, (-X_UPPER_ARM+X_TORSO)/2, (X_UPPER_ARM+X_TORSO)/2);
        rightArm.position.x = THREE.Math.clamp(rightArm.position.x-ARM_VELOCITY*delta, -(X_UPPER_ARM+X_TORSO)/2, -(-X_UPPER_ARM+X_TORSO)/2);
    }

    // rotates the head in or out the robot 
    if (rotateHeadIn) {
        head.translateY(-Y_HEAD_BASE / 2 - 0.05 * SIZE_SCALING);
        head.rotation.x = THREE.Math.clamp(head.rotation.x + HEAD_ROTATION_ANGLE * delta, 0, Math.PI);
        head.translateY(Y_HEAD_BASE / 2 + 0.05 * SIZE_SCALING);
    }
    if (rotateHeadOut) {
        head.translateY(-Y_HEAD_BASE / 2 - 0.05 * SIZE_SCALING);
        head.rotation.x = THREE.Math.clamp(head.rotation.x - HEAD_ROTATION_ANGLE * delta, 0, Math.PI);
        head.translateY(Y_HEAD_BASE / 2 + 0.05 * SIZE_SCALING);
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

    renderer = new THREE.WebGLRenderer({ antialias: true });
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
        for (let i = 0; i < cameras.length; i++) {
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
            wireFramedChange = true;
            wireFramedChanged = false;
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
        case 69: //E
        case 101: //e
            moveArmsIn = true;
            break;
        case 68: //D
        case 100: //d
            moveArmsOut = true;
            break;
        case 82: //R
        case 114: //r
            rotateHeadIn = true;
            break;
        case 70: //F
        case 102: //f
            rotateHeadOut = true;
            break;
    }

}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e) {
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
        case 54: //6
            wireFramedChange = false;
            break;
        case 69: //E
        case 101: //e
            moveArmsIn = false;
            break;
        case 68: //D
        case 100: //d
            moveArmsOut = false;
            break;
        case 82: //R
        case 114: //r
            rotateHeadIn = false;
            break;
        case 70: //F
        case 102: //f
            rotateHeadOut = false;
            break;
    }
}