import {vec3, vec4} from 'gl-matrix';
import Drawable from '../rendering/gl/Drawable';
import {gl} from '../globals';

class Objs extends Drawable {
  indices: number[];
  positions: number[];
  normals: number[];

  
  constructor() {
    super(); // Call the constructor of the super class. This is required.
    this.indices = new Array<number>();
    this.positions = new Array<number>();
    this.normals = new Array<number>();
  }

  create() {

  var indicesarray = new Uint32Array(this.indices);
  var normalsarray = new Float32Array(this.normals);
  var positionsarray = new Float32Array(this.positions);

    this.generateIdx();
    this.generatePos();
    this.generateNor();

    this.count = this.indices.length;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufIdx);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indicesarray, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufNor);
    gl.bufferData(gl.ARRAY_BUFFER, normalsarray, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufPos);
    gl.bufferData(gl.ARRAY_BUFFER, positionsarray, gl.STATIC_DRAW);

    console.log(`Created square`);
  }
};

export default Objs;
