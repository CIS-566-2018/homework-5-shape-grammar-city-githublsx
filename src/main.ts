import {vec3, vec4} from 'gl-matrix';
import * as Stats from 'stats-js';
import * as DAT from 'dat-gui';
import Icosphere from './geometry/Icosphere';
import Square from './geometry/Square';
import Cube from './geometry/Cube';
import OpenGLRenderer from './rendering/gl/OpenGLRenderer';
import Camera from './Camera';
import {setGL} from './globals';
import ShaderProgram, {Shader} from './rendering/gl/ShaderProgram';
import Objs from './geometry/Objs';

// Define an object with application parameters and button callbacks
// This will be referred to by dat.GUI's functions that add GUI elements.
const controls = {
  tesselations: 6,
  'Load': loadScene, // A function pointer, essentially
  fogcolor: [230, 230, 217],
  color: [225, 218, 207],
  roofcolor1: [48, 48, 49], //[71, 73, 80],
  ridgecolor: [60, 59, 58],
  woodcolor: [117, 92, 67],
  groundcolor: [140, 132, 100],
  branchcolor: [89, 54, 0],
  leavescolor1: [93, 187, 116], //[215, 183, 208],
  roofcolor2: [142, 144, 145], //[225, 117, 94],
  rivercolor: [120, 183, 215],
  roadfacecolor: [215, 188, 139],
  roadedgecolor: [137, 106, 78],
  wallcolor: [210, 162, 119],
  shader: 'fun',
  drawable: 'sphere',
  minroof: 1.0,
  totalnumber: 35,
  fogdensity:0.3,
};

let icosphere: Icosphere;
let square: Square;
let cube: Cube;
let roof: Objs;
let ridge: Objs;
let support: Objs;
let branches: Objs;
let leaves: Objs;
let river: Objs;
let edge: Objs;
let face: Objs;
let walls: Objs;

function readTextFile(file: string): string
{
    var allTest = "";
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                allTest = rawFile.responseText;
                return allTest;
            }
        }
    }
    rawFile.send(null);
    return allTest;
}

var eave = readTextFile("./src/mesh/eave.obj");
var branch1 = readTextFile("./src/mesh/branch1.obj");
var branch2 = readTextFile("./src/mesh/branch2.obj");
var leaves1 = readTextFile("./src/mesh/leaves1.obj");
var leaves2 = readTextFile("./src/mesh/leaves2.obj");
var riverfront = readTextFile("./src/mesh/riverfront.obj");
var riverleft = readTextFile("./src/mesh/riverleft.obj");
var road = readTextFile("./src/mesh/roadedge.obj");
var bridgestart = readTextFile("./src/mesh/bridgestartedge.obj");
var bridge = readTextFile("./src/mesh/bridgeedge.obj");
var bridgeinter = readTextFile("./src/mesh/bridgeinteredge.obj");
var roadface = readTextFile("./src/mesh/roadface.obj");
var bridgestartface = readTextFile("./src/mesh/bridgestartface.obj");
var bridgeface = readTextFile("./src/mesh/bridgeface.obj");
var bridgeinterface = readTextFile("./src/mesh/bridgeinterface.obj");
var wall = readTextFile("./src/mesh/wall.obj");
var gate = readTextFile("./src/mesh/gate.obj");
var cornerwall = readTextFile("./src/mesh/cornerwall.obj");
//var test2 = readTextFile("./src/mesh/test2.obj");

function loadScene() {
  icosphere = new Icosphere(vec3.fromValues(0, 0, 0), 1, controls.tesselations);
  icosphere.create();
  square = new Square(vec3.fromValues(-1.25, 0, -1.25), (controls.totalnumber + 3) * 2.5 / 2.0);
  square.create();
  roof = new Objs();
  ridge = new Objs();
  support = new Objs();
  branches = new Objs();
  leaves = new Objs();
  river = new Objs();
  edge = new Objs();
  face = new Objs();
  walls = new Objs();
  cube = new Cube(controls.totalnumber, cornerwall, gate, wall, riverfront, riverleft, 
    road, bridgestart, bridge, bridgeinter, 
    roadface, bridgestartface, bridgeface, bridgeinterface,
    branch1, branch2, leaves1, leaves2, 
    eave, vec3.fromValues(0, 0, 0), 
    roof, ridge, support, branches, leaves, river, edge, face, walls);
  cube.create();
  roof.create();
  ridge.create();
  support.create();
  branches.create();
  leaves.create();
  river.create();
  edge.create();
  face.create();
  walls.create();
}

function main() {
  // Initial display for framerate
  const stats = Stats();
  stats.setMode(0);
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  document.body.appendChild(stats.domElement);

  // Add controls to the gui
  const gui = new DAT.GUI();
  gui.add(controls, 'totalnumber', 10, 70).step(1);
  gui.add(controls, 'minroof', -5.0, 5.0).step(0.01);
  gui.add(controls, 'fogdensity', 0, 1.0).step(0.01);
  var f1 = gui.addFolder('Color');
  f1.addColor(controls, 'fogcolor');
  f1.addColor(controls, 'color');
  f1.addColor(controls, 'roofcolor1');
  f1.addColor(controls, 'ridgecolor');
  f1.addColor(controls, 'woodcolor');
  f1.addColor(controls, 'groundcolor');
  f1.addColor(controls, 'branchcolor');
  f1.addColor(controls, 'leavescolor1');
  f1.addColor(controls, 'roofcolor2');
  f1.addColor(controls, 'rivercolor');
  f1.addColor(controls, 'roadfacecolor');
  f1.addColor(controls, 'roadedgecolor');
  f1.addColor(controls, 'wallcolor');
  gui.add(controls, 'Load');

  // get canvas and webgl context
  const canvas = <HTMLCanvasElement> document.getElementById('canvas');
  const gl = <WebGL2RenderingContext> canvas.getContext('webgl2');
  if (!gl) {
    alert('WebGL 2 not supported!');
  }
  // `setGL` is a function imported above which sets the value of `gl` in the `globals.ts` module.
  // Later, we can import `gl` from `globals.ts` to access it
  setGL(gl);

  // Initial call to load scene
  loadScene();

  const camera = new Camera(vec3.fromValues(40, 40, 40), vec3.fromValues(0, 0, 0));

  const renderer = new OpenGLRenderer(canvas);
  renderer.setClearColor(controls.fogcolor[0]/255, controls.fogcolor[1]/255, controls.fogcolor[2]/255, 1);
  gl.enable(gl.DEPTH_TEST);
  gl.cullFace(gl.BACK);
  gl.enable(gl.CULL_FACE);

  const lambert = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/lambert-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/lambert-frag.glsl')),
  ]);

  const lambert2 = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/lambert-vert2.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/lambert-frag2.glsl')),
  ]);

  const lambert3 = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/lambert-vert3.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/lambert-frag3.glsl')),
  ]);

  var lastUpdate = Date.now();

  // This function will be called every frame
  function tick() {
    //loadScene();
    
    camera.update();
    stats.begin();
    gl.viewport(0, 0, window.innerWidth, window.innerHeight);
    renderer.clear();
    let shader = lambert;
    let drawable = [cube];
    var now = Date.now();
    var dt = now - lastUpdate;
    //lastUpdate = now;
    // if(controls.shader == 'fun')
    // {
    //   shader = lambert2;
    // }
    // if(controls.drawable == 'square')
    // {
    //   drawable = [square];
    // }
    // else if(controls.drawable == 'sphere')
    // {
    //   drawable = [icosphere];
    // }
    lambert.setFogDensity(controls.fogdensity);
    lambert.setGeometryColor3(vec4.fromValues(controls.fogcolor[0]/255, controls.fogcolor[1]/255, controls.fogcolor[2]/255, 1));
    lambert3.setGeometryColor3(vec4.fromValues(controls.fogcolor[0]/255, controls.fogcolor[1]/255, controls.fogcolor[2]/255, 1));
    lambert3.setGeometryColor2(vec4.fromValues(controls.roofcolor2[0]/255, controls.roofcolor2[1]/255, controls.roofcolor2[2]/255, 1));
    lambert3.setMaxRoof(cube.maxroof);
    lambert3.setMinRoof(controls.minroof);
    lambert3.setFogDensity(controls.fogdensity);
    renderer.render(camera, shader, drawable, //[icosphere,//square,cube,], 
      vec4.fromValues(controls.color[0]/255, controls.color[1]/255, controls.color[2]/255, 1), dt/1000.0);

    renderer.render(camera, lambert3, [roof], //[icosphere,//square,cube,], 
      vec4.fromValues(controls.roofcolor1[0]/255, controls.roofcolor1[1]/255, controls.roofcolor1[2]/255, 1), dt/1000.0);

    renderer.render(camera, shader, [ridge], //[icosphere,//square,cube,], 
      vec4.fromValues(controls.ridgecolor[0]/255, controls.ridgecolor[1]/255, controls.ridgecolor[2]/255, 1), dt/1000.0);

    renderer.render(camera, shader, [support], //[icosphere,//square,cube,], 
      vec4.fromValues(controls.woodcolor[0]/255, controls.woodcolor[1]/255, controls.woodcolor[2]/255, 1), dt/1000.0);

    renderer.render(camera, shader, [branches], //[icosphere,//square,cube,], 
      vec4.fromValues(controls.branchcolor[0]/255, controls.branchcolor[1]/255, controls.branchcolor[2]/255, 1), dt/1000.0);

    renderer.render(camera, shader, [leaves], //[icosphere,//square,cube,], 
      vec4.fromValues(controls.leavescolor1[0]/255, controls.leavescolor1[1]/255, controls.leavescolor1[2]/255, 1), dt/1000.0);

    renderer.render(camera, shader, [river], //[icosphere,//square,cube,], 
      vec4.fromValues(controls.rivercolor[0]/255, controls.rivercolor[1]/255, controls.rivercolor[2]/255, 1), dt/1000.0);

    renderer.render(camera, shader, [edge], //[icosphere,//square,cube,], 
      vec4.fromValues(controls.roadedgecolor[0]/255, controls.roadedgecolor[1]/255, controls.roadedgecolor[2]/255, 1), dt/1000.0);

    renderer.render(camera, shader, [face], //[icosphere,//square,cube,], 
      vec4.fromValues(controls.roadfacecolor[0]/255, controls.roadfacecolor[1]/255, controls.roadfacecolor[2]/255, 1), dt/1000.0); 

    renderer.render(camera, shader, [square], //[icosphere,//square,cube,], 
      vec4.fromValues(controls.groundcolor[0]/255, controls.groundcolor[1]/255, controls.groundcolor[2]/255, 1), dt/1000.0);

    renderer.render(camera, shader, [walls], //[icosphere,//square,cube,], 
      vec4.fromValues(controls.wallcolor[0]/255, controls.wallcolor[1]/255, controls.wallcolor[2]/255, 1), dt/1000.0);    
    
      stats.end();

    // Tell the browser to call `tick` again whenever it renders a new frame
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.setAspectRatio(window.innerWidth / window.innerHeight);
    camera.updateProjectionMatrix();
  }, false);

  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.setAspectRatio(window.innerWidth / window.innerHeight);
  camera.updateProjectionMatrix();

  // Start the render loop
  tick();
}

main();
