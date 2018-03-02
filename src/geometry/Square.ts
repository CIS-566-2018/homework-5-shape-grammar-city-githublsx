import {vec3, vec4} from 'gl-matrix';
import Drawable from '../rendering/gl/Drawable';
import {gl} from '../globals';

class Square extends Drawable {
  indices: Uint32Array;
  positions: Float32Array;
  normals: Float32Array;
  center: vec4;
  scale: number;
  down: number;

  constructor(center: vec3, scale: number) {
    super(); // Call the constructor of the super class. This is required.
    this.center = vec4.fromValues(center[0], center[1], center[2], 1);
    this.scale = scale;
    //this.down = down;
  }

  create() {

  this.indices = new Uint32Array([0, 2, 1,
                                  0, 3, 2]);
  this.normals = new Float32Array([0, 1, 0, 0,
                                   0, 1, 0, 0,
                                   0, 1, 0, 0,
                                   0, 1, 0, 0]);
  this.positions = new Float32Array([-this.scale + this.center[0], this.center[1], -this.scale + this.center[2], 1,
                                      this.scale + this.center[0], this.center[1], -this.scale + this.center[2], 1,
                                      this.scale + this.center[0], this.center[1], this.scale + this.center[2], 1,
                                     -this.scale + this.center[0], this.center[1], this.scale + this.center[2], 1]);

    this.generateIdx();
    this.generatePos();
    this.generateNor();

    this.count = this.indices.length;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufIdx);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufNor);
    gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufPos);
    gl.bufferData(gl.ARRAY_BUFFER, this.positions, gl.STATIC_DRAW);

    console.log(`Created square`);
  }
};

export default Square;
