var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.001, 10000);

let light =  new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
scene.add(light);

camera.position.set(2, 2, 2)

cameraControls = new THREE.OrbitControls(camera);
cameraControls.target.set(0, 0, 0);
cameraControls.update();

var gridHelper = new THREE.GridHelper(10, 50);
scene.add(gridHelper);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x2b2b2b, 1);
document.body.appendChild(renderer.domElement);

window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}, false);



function animate() {
  requestAnimationFrame(animate);


  renderer.render(scene, camera);
}

animate();



let last = null;
function addObject(vert, ind) {
  if (last) {
    scene.remove(last);
    last = null;
  }

  var geometry = new THREE.Geometry();

  for (let i = 0; i < vert.length; i++) {
    geometry.vertices.push(new THREE.Vector3(vert[i].x, vert[i].y, vert[i].z));
  }


  for (let i = 0; i < ind.length; i += 3) {
    geometry.faces.push(new THREE.Face3(ind[i], ind[i + 1], ind[i + 2]));
  }

  geometry.computeBoundingSphere();
  geometry.computeFaceNormals();
  geometry.computeVertexNormals();

  var material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0x111111 
  });
  var cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  last = cube;
}
