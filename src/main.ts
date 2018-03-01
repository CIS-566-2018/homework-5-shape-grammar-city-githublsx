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
  'Load Scene': loadScene, // A function pointer, essentially
  color: [225, 218, 207],
  color2: [85, 80, 75],
  color3: [60, 59, 58],
  color4: [117, 92, 67],
  color5: [140, 132, 100],
  color6: [89, 54, 0],
  color7: [93, 187, 116],//[215, 183, 208],
  shader: 'fun',
  drawable: 'sphere',
};

let icosphere: Icosphere;
let square: Square;
let cube: Cube;
let roof: Objs;
let ridge: Objs;
let support: Objs;
let branches: Objs;
let leaves: Objs;

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

function loadScene() {
  icosphere = new Icosphere(vec3.fromValues(0, 0, 0), 1, controls.tesselations);
  icosphere.create();
  square = new Square(vec3.fromValues(0, 0, 0), 100, 0);
  square.create();
  roof = new Objs();
  ridge = new Objs();
  support = new Objs();
  branches = new Objs();
  leaves = new Objs();
  cube = new Cube(branch1, branch2, leaves1, leaves2, eave, vec3.fromValues(0, 0, 0), 
        roof, ridge, support, branches, leaves);
  cube.create();
  roof.create();
  ridge.create();
  support.create();
  branches.create();
  leaves.create();
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
  gui.add(controls, 'tesselations', 0, 8).step(1);
  gui.add(controls, 'Load Scene');
  gui.addColor(controls, 'color');
  gui.addColor(controls, 'color2');
  gui.addColor(controls, 'color3');
  gui.addColor(controls, 'color4');
  gui.addColor(controls, 'color5');
  gui.addColor(controls, 'color6');
  gui.addColor(controls, 'color7');
  gui.add(controls, 'shader', ['lambert','fun']);
  gui.add(controls, 'drawable', ['cube','sphere','square']);

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

  const camera = new Camera(vec3.fromValues(50, 50, 50), vec3.fromValues(0, 0, 0));

  const renderer = new OpenGLRenderer(canvas);
  renderer.setClearColor(0.9, 0.9, 0.85, 1);
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
    renderer.render(camera, shader, drawable, //[icosphere,//square,cube,], 
      vec4.fromValues(controls.color[0]/255, controls.color[1]/255, controls.color[2]/255, 1), dt/1000.0);

    renderer.render(camera, shader, [roof], //[icosphere,//square,cube,], 
      vec4.fromValues(controls.color2[0]/255, controls.color2[1]/255, controls.color2[2]/255, 1), dt/1000.0);

    renderer.render(camera, shader, [ridge], //[icosphere,//square,cube,], 
      vec4.fromValues(controls.color3[0]/255, controls.color3[1]/255, controls.color3[2]/255, 1), dt/1000.0);

    renderer.render(camera, shader, [support], //[icosphere,//square,cube,], 
      vec4.fromValues(controls.color4[0]/255, controls.color4[1]/255, controls.color4[2]/255, 1), dt/1000.0);

    renderer.render(camera, shader, [branches], //[icosphere,//square,cube,], 
      vec4.fromValues(controls.color6[0]/255, controls.color6[1]/255, controls.color6[2]/255, 1), dt/1000.0);

    renderer.render(camera, shader, [leaves], //[icosphere,//square,cube,], 
      vec4.fromValues(controls.color7[0]/255, controls.color7[1]/255, controls.color7[2]/255, 1), dt/1000.0);

    renderer.render(camera, shader, [square], //[icosphere,//square,cube,], 
      vec4.fromValues(controls.color5[0]/255, controls.color5[1]/255, controls.color5[2]/255, 1), dt/1000.0);
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
