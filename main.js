import * as THREE from 'three';
//import { TextureLoader } from 'three';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js';
//import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

//---------------------------------------------------------
// Renderer setup

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;

// Scene setup
const scene = new THREE.Scene();

// Camera setup
// Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, -8);

// Rotate the camera to face the opposite direction
camera.rotation.y = Math.PI; // Math.PI radians is 180 degrees
scene.add(camera);

// Controls setup for FirstPersonControls
const controls = new FirstPersonControls(camera, renderer.domElement);
controls.movementSpeed = 5;
controls.lookSpeed = 1;

// Camera movement variables
const cameraVelocity = new THREE.Vector3();
const cameraAcceleration = 1;
const deceleration = 0;
const maxSpeed = 0.1;

// Event listeners for keyboard interaction
function onDocumentKeyDown(event) {
    var keyCode = event.which;
    if (keyCode == 87) { // W key
        cameraVelocity.z += cameraAcceleration;
    } else if (keyCode == 83) { // S key
        cameraVelocity.z -= cameraAcceleration;
    } else if (keyCode == 65) { // A key
        cameraVelocity.x -= cameraAcceleration;
    } else if (keyCode == 68) { // D key
        cameraVelocity.x += cameraAcceleration;
    } else if (keyCode == 38) { // up arrow
        cameraVelocity.y += cameraAcceleration;
    } else if (keyCode == 40) { // down arrow
        cameraVelocity.y -= cameraAcceleration;
    }
    cameraVelocity.clampScalar(-maxSpeed, maxSpeed);
}
document.addEventListener("keydown", onDocumentKeyDown, false);

function onDocumentKeyUp(event) {
    cameraVelocity.multiplyScalar(deceleration);
}
document.addEventListener("keyup", onDocumentKeyUp, false);



//---------------------------------------------------------
// GLTF Model loading
const loader = new GLTFLoader();
loader.load('assets/models/maya/scene.gltf', function(gltf) {
    const model = gltf.scene;
    model.position.set(0, 1.5, 0); 
    model.scale.set(0.20, 0.20, 0.20); 
    scene.add(model);
}, undefined, function(error) {
    console.error(error);
});

const loadera = new GLTFLoader();
loadera.load('assets/models/temple/pyramid.gltf', function(gltf) {
    const model = gltf.scene;
    model.position.set(0, 0.35, 25); 
    model.scale.set(2.4, 2.4, 2.4); 
    scene.add(model);
}, undefined, function(error) {
    console.error(error);
});


//---------------------------------------------------------
// hallway setup
const hallwayLength = 20;
const hallwayWidth = 4;
const wallHeight = 3;
const wallThickness = 0.2;
const roofHeight = 3; // Height of the roof from the floor that may be needed
const roomLength = 30;
const roomWidth = 20;
const roomHeight = 6;
const doorWidth = 1.5;
const doorHeight = 2.5;
const doorPositionZ = hallwayLength / 2; // Position at the end of the hallway


// Wall geometry and material
const wallGeometry = new THREE.BoxGeometry(wallThickness, wallHeight, hallwayLength);
const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xdddddd });



//wall height should be adjusted after I set the "roof"
// Left wall
const leftWall = new THREE.Mesh(wallGeometry, wallMaterial);
leftWall.position.set(-hallwayWidth / 2 - wallThickness / 2, wallHeight / 2, 0);
leftWall.receiveShadow = true;
scene.add(leftWall);

// Right wall
const rightWall = new THREE.Mesh(wallGeometry, wallMaterial);
rightWall.position.set(hallwayWidth / 2 + wallThickness / 2, wallHeight / 2, 0);
rightWall.receiveShadow = true;
scene.add(rightWall);



// Roof setup
const roofGeometry = new THREE.PlaneGeometry(hallwayWidth, hallwayLength);
const roofMaterial = new THREE.MeshStandardMaterial({ color: 0x888888, side: THREE.DoubleSide });
const roof = new THREE.Mesh(roofGeometry, roofMaterial);
roof.position.set(0, roofHeight, 0);
roof.rotation.x = Math.PI / 2;
roof.receiveShadow = true;
scene.add(roof);
//---------------------
const textureLoader = new THREE.TextureLoader();
const floorTexture = textureLoader.load('assets/models/floor/wood.gltf');

const floorMaterial = new THREE.MeshStandardMaterial({ map: floorTexture });

//---------------------

// Floor setup
const floorGeometry = new THREE.PlaneGeometry(40, 100);
const floor = new THREE.Mesh(floorGeometry, floorMaterial); // Replace floorMaterial with the new one
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);


// Pedestal setup or just a place holder


const pedestalGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
const pedestalMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
const pedestal = new THREE.Mesh(pedestalGeometry, pedestalMaterial);
pedestal.position.set(0, 0.5, 0);
pedestal.receiveShadow = true;
scene.add(pedestal);
//end caps
//---------------------------------------------------------
// Front wall of the hallway
const hallwayFrontWallGeometry = new THREE.BoxGeometry(hallwayWidth, wallHeight, wallThickness);
const hallwayFrontWall = new THREE.Mesh(hallwayFrontWallGeometry, wallMaterial);
hallwayFrontWall.position.set(0, wallHeight / 2, -hallwayLength / 2);
hallwayFrontWall.receiveShadow = true;
scene.add(hallwayFrontWall);

// Back wall of the room
const roomBackWallGeometry = new THREE.BoxGeometry(roomWidth, roomHeight, wallThickness);
const roomBackWall = new THREE.Mesh(roomBackWallGeometry, wallMaterial);
roomBackWall.position.set(0, roomHeight / 2, hallwayLength / 2 + roomLength);
roomBackWall.receiveShadow = true;
scene.add(roomBackWall);

//--------------------------------------------------------
// Front wall - Left part
const frontWallLeftGeometry = new THREE.BoxGeometry((roomWidth / 2 - doorWidth / 2), roomHeight, wallThickness);
const frontWallLeft = new THREE.Mesh(frontWallLeftGeometry, wallMaterial);
frontWallLeft.position.set(-(doorWidth / 2 + roomWidth / 4), roomHeight / 2, doorPositionZ);
frontWallLeft.receiveShadow = true;
scene.add(frontWallLeft);

// Front wall - Right part
const frontWallRightGeometry = new THREE.BoxGeometry((roomWidth / 2 - doorWidth / 2), roomHeight, wallThickness);
const frontWallRight = new THREE.Mesh(frontWallRightGeometry, wallMaterial);
frontWallRight.position.set(doorWidth / 2 + roomWidth / 4, roomHeight / 2, doorPositionZ);
frontWallRight.receiveShadow = true;
scene.add(frontWallRight);


// Room's left and right walls
const roomSideWallGeometry = new THREE.BoxGeometry(wallThickness, roomHeight, roomLength);
const roomLeftWall = new THREE.Mesh(roomSideWallGeometry, wallMaterial);
roomLeftWall.position.set(-roomWidth / 2 - wallThickness / 2, roomHeight / 2, hallwayLength / 2 + roomLength / 2);
roomLeftWall.receiveShadow = true;
scene.add(roomLeftWall);

const roomRightWall = new THREE.Mesh(roomSideWallGeometry, wallMaterial);
roomRightWall.position.set(roomWidth / 2 + wallThickness / 2, roomHeight / 2, hallwayLength / 2 + roomLength / 2);
roomRightWall.receiveShadow = true;
scene.add(roomRightWall);

// Room floor and ceiling
const roomFloorCeilingGeometry = new THREE.PlaneGeometry(roomWidth, roomLength);
const roomFloor = new THREE.Mesh(roomFloorCeilingGeometry, floorMaterial);
roomFloor.position.set(0, 0, hallwayLength / 2 + roomLength / 2);
roomFloor.rotation.x = -Math.PI / 2;
roomFloor.receiveShadow = true;
scene.add(roomFloor);

const roomCeiling = new THREE.Mesh(roomFloorCeilingGeometry, roofMaterial);
roomCeiling.position.set(0, roomHeight, hallwayLength / 2 + roomLength / 2);
roomCeiling.rotation.x = Math.PI / 2;
roomCeiling.receiveShadow = true;
scene.add(roomCeiling);

//---------------------------------------------------------
// Lights setup and main number 
const lights = [];
const numLights = 10;
const bulbGeometry = new THREE.SphereGeometry(0.03, 8, 8);
const bulbMaterial = new THREE.MeshStandardMaterial({ emissive: 0xffffee, emissiveIntensity: 1, color: 0x000000 });
const roomLights = [];
const lightIntensity = 1;
const lightDistance = 25;
const lightColor = 0xffffff; // White light
const bulbGeometryR = new THREE.SphereGeometry(0.1, 16, 16);// The letter R is the representation for the room lights thus giving myself the ability to change the lights in two rooms
const bulbMaterialR = new THREE.MeshStandardMaterial({ emissive: lightColor, color: lightColor });

//room lights in corner area but should be more center than corner for effects purposes
const lightPositions = [
    { x: roomWidth / 4, z: hallwayLength / 2 + roomLength / 4 },
    { x: -roomWidth / 4, z: hallwayLength / 2 + roomLength / 4 },
    { x: roomWidth / 4, z: hallwayLength / 2 + (3 * roomLength) / 4 },
    { x: -roomWidth / 4, z: hallwayLength / 2 + (3 * roomLength) / 4 }
];

// position lights in room
lightPositions.forEach((pos) => {
    const light = new THREE.PointLight(lightColor, lightIntensity, lightDistance);
    light.position.set(pos.x, roomHeight - 0.5, pos.z); // below the ceiling
    light.castShadow = true;
    roomLights.push(light);
    scene.add(light);
});

roomLights.forEach(light => {
    const bulb = new THREE.Mesh(bulbGeometryR, bulbMaterialR);
    bulb.position.copy(light.position);
    scene.add(bulb);
});
// lights along the hallway and may need more for wall shadows if wanted 
for (let i = 4; i < numLights; i++) {
  lights[i] = new THREE.PointLight(0xffffee, 3, 50);//color and extras for hall lights 
  lights[i].position.set(0, 2.75, i * 3 - (hallwayLength / 4 + 15));
  lights[i].castShadow = true;
  scene.add(lights[i]);
  

  lights[i].shadow.mapSize.width = 1024;
  lights[i].shadow.mapSize.height = 1024;
  lights[i].shadow.camera.near = 0.1;
  lights[i].shadow.camera.far = 20;

  // Bulb mesh
  const bulb = new THREE.Mesh(bulbGeometry, bulbMaterial);
  lights[i].add(bulb);
}


// Scene background
scene.background = new THREE.Color(0x343425);

//---------------------------------------------------------
// Animation loop
function animate() {
    requestAnimationFrame(animate);
  
    // new position
    let newX = camera.position.x + cameraVelocity.x;
    let newY = camera.position.y + cameraVelocity.y;
    let newZ = camera.position.z + cameraVelocity.z;
  
      //  collision with walls, including new front and back walls
      if (newX > -hallwayWidth / 2 && newX < roomWidth / 2) {
        camera.position.x = newX;
    }
    if (newX > -hallwayWidth / 2 && newX < roomWidth / 2) {
        camera.position.x = newX;
    }
    if (newY > 0 && newY < roomHeight) {
        camera.position.y = newY;
    }

    // Allows passage through the door
    let inDoorway = newZ > doorPositionZ - 0.5 && newZ < doorPositionZ + 0.5;
    if ((newZ > -hallwayLength / 2 && newZ < hallwayLength / 2 + roomLength) && (!inDoorway || newY < doorHeight)) {
        camera.position.z = newZ;
        if (newZ > -hallwayLength / 2 - wallThickness && newZ < hallwayLength / 2 + roomLength + wallThickness) {
            camera.position.z = newZ;
        }
    }
  
    controls.update(0.005);
    renderer.render(scene, camera);
  }
// Window resize handler
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize, false);

// Initialize velocity to zero
cameraVelocity.set(0, 0, 0);

// Start the animation loop
animate();