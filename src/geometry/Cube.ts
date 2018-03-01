import {vec2, vec3, vec4, mat4} from 'gl-matrix';
import Drawable from '../rendering/gl/Drawable';
import {gl} from '../globals';
import * as OBJLOADER from 'webgl-obj-loader';
import Objs from '../geometry/Objs'

class Symbol{
  mark: number;
  randomness: number;
  constructor(mark: number = 0, randomness: number = 0)
  {
    this.mark = mark;
    this.randomness = randomness;
  }
}

class Section{
  halfweight: number;
  halfheight: number;
  halfdepth: number;
  translateweight: number;
  translateheight: number;
  translatedepth: number;
  left: boolean = true;
  right: boolean = true;
  front: boolean = true;
  back: boolean = true;
  up: boolean = true;

  leftgenerated: boolean = false; 
  rightgenerated: boolean = false; 
  frontgenerated: boolean = false; 
  backgenerated: boolean = false; 
  upgenerated: boolean = false; 
  isroot: boolean = false;
  intobaclony: boolean = false;


  constructor(halfweight: number = 1.0, halfheight: number = 1.0, halfdepth: number = 1.0,
    translateweight: number = 0.0, translateheight: number = 1.0, translatedepth: number = 0.0)
  {
      
      this.halfweight = halfweight;
      this.halfheight = halfheight;
      this.halfdepth = halfdepth;
      this.translateweight = translateweight;
      this.translateheight = translateheight;
      this.translatedepth = translatedepth;
  }
}

class Cube extends Drawable {
  indices: Uint32Array;
  positions: Float32Array;
  normals: Float32Array;
  center: vec4;
  
  eavestring: string;
  eavemesh: any;

  branch1tring: string;
  branch1mesh: any;
  leaves1tring: string;
  leaves1mesh: any;

  branch2tring: string;
  branch2mesh: any;
  leaves2tring: string;
  leaves2mesh: any;

  riverfrontstring: string;
  riverfrontmesh: any;

  riverleftstring: string;
  riverleftmesh: any;

  riverrightstring: string;
  riverrightmesh: any;

  roof: Objs;
  ridge: Objs;
  support: Objs;
  branches: Objs;
  leaves: Objs;

  maxroof: number = 0;
  minroof: number = 100.0;

  constructor(riverfrontstring: string, riverleftstring: string, riverrightstring: string, 
    branch1tring: string, branch2tring: string, leaves1tring: string, leaves2tring: string, eavestring: string, 
    center: vec3, roof: Objs, ridge: Objs, support: Objs, branches: Objs, leaves: Objs) {
    super(); // Call the constructor of the super class. This is required.
    this.center = vec4.fromValues(center[0], center[1], center[2], 1);
    this.eavestring = eavestring;
    this.eavemesh = new OBJLOADER.Mesh(this.eavestring);
    this.roof = roof;
    this.ridge = ridge;
    this.support = support;
    this.branch1tring = branch1tring;
    this.branch1mesh = new OBJLOADER.Mesh(this.branch1tring); 
    this.branch2tring = branch2tring;
    this.branch2mesh = new OBJLOADER.Mesh(this.branch2tring);
    this.leaves1tring = leaves1tring;
    this.leaves1mesh = new OBJLOADER.Mesh(this.leaves1tring); 
    this.leaves2tring = leaves2tring;
    this.leaves2mesh = new OBJLOADER.Mesh(this.leaves2tring); 
    this.riverfrontstring = riverfrontstring;
    this.riverfrontmesh = new OBJLOADER.Mesh(this.riverfrontstring); 
    this.riverleftstring = riverleftstring;
    this.riverleftmesh = new OBJLOADER.Mesh(this.riverleftstring); 
    this.riverrightstring = riverrightstring;
    this.riverrightmesh = new OBJLOADER.Mesh(this.riverrightstring); 
    this.branches = branches;
    this.leaves = leaves;
  }

  pushnormal(numberarray: number[], vector: vec4)
  {
    numberarray.push(vector[0]);
    numberarray.push(vector[1]);
    numberarray.push(vector[2]);
    numberarray.push(vector[3]);
  }

  pushposition(numberarray: number[], vector: vec4)
  {
    numberarray.push(vector[0]);
    numberarray.push(vector[1]);
    numberarray.push(vector[2]);
    numberarray.push(vector[3]);
  }

  getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }

  createtriangularprism(indices: number[], positions: number[], normals: number[], 
    scalingVector: vec3, translationVector: vec3, rad: number)
  {
    var translationMatrix = mat4.create();
    mat4.fromTranslation(translationMatrix, translationVector);
    var rotationMatrix = mat4.create();
    
    mat4.fromYRotation(rotationMatrix, rad);
    var scaleMatrix = mat4.create();
    mat4.fromScaling(scaleMatrix, scalingVector);
  
    var transformMatrix = mat4.create();
    mat4.multiply(transformMatrix, rotationMatrix, scaleMatrix);
    mat4.multiply(transformMatrix, translationMatrix, transformMatrix);
    var inverseTransformMatrix = mat4.create();
    mat4.transpose(inverseTransformMatrix, transformMatrix);
    mat4.invert(inverseTransformMatrix, inverseTransformMatrix);

    var offset = positions.length/4;
  
    indices.push(0 + offset, 1 + offset, 2 + offset, 0 + offset, 2 + offset, 3 + offset, //button
                  4 + offset, 5 + offset, 6 + offset,  //front
                  7 + offset, 9 + offset, 8 + offset, 7 + offset, 10 + offset, 9 + offset, //right
                  11 + offset, 13 + offset, 12 + offset,  //back
                  14 + offset, 15 + offset, 16 + offset, 14 + offset, 16 + offset, 17 + offset) //left
  
    var vector = vec4.create();
    vec4.transformMat4(vector, vec4.fromValues(0, -1, 0, 0), inverseTransformMatrix);//buttom
    this.pushnormal(normals, vector); this.pushnormal(normals, vector); this.pushnormal(normals, vector); this.pushnormal(normals, vector);

    vec4.transformMat4(vector, vec4.fromValues(0, 0, 1, 0), inverseTransformMatrix);//front
    this.pushnormal(normals, vector); this.pushnormal(normals, vector); this.pushnormal(normals, vector);
  
    vector = vec4.fromValues(1, 1, 0, 0);
    vec4.normalize(vector, vector);
    vec4.transformMat4(vector, vector, inverseTransformMatrix);//right
    this.pushnormal(normals, vector); this.pushnormal(normals, vector); this.pushnormal(normals, vector); this.pushnormal(normals, vector);
  
    vec4.transformMat4(vector, vec4.fromValues(0, 0, -1, 0), inverseTransformMatrix);//back
    this.pushnormal(normals, vector); this.pushnormal(normals, vector); this.pushnormal(normals, vector);
  
    vector = vec4.fromValues(-1, 1, 0, 0);
    vec4.normalize(vector, vector);
    vec4.transformMat4(vector, vector, inverseTransformMatrix);//left
    this.pushnormal(normals, vector); this.pushnormal(normals, vector); this.pushnormal(normals, vector); this.pushnormal(normals, vector);
  
    //pos
    var vector2 = vec4.create();
      
    vec4.transformMat4(vector2, vec4.fromValues(-1.0, -1.0, -1.0, 1.0), transformMatrix);//buttom
    this.pushposition(positions, vector2);
    vec4.transformMat4(vector2, vec4.fromValues(1.0, -1.0, -1.0, 1.0), transformMatrix);
    this.pushposition(positions, vector2);
    vec4.transformMat4(vector2, vec4.fromValues(1.0, -1.0, 1.0, 1.0), transformMatrix);
    this.pushposition(positions, vector2);
    vec4.transformMat4(vector2, vec4.fromValues(-1.0, -1.0, 1.0, 1.0), transformMatrix);
    this.pushposition(positions, vector2);    

    vec4.transformMat4(vector2, vec4.fromValues(-1.0, -1.0, 1.0, 1.0), transformMatrix);//front
    this.pushposition(positions, vector2);
    vec4.transformMat4(vector2, vec4.fromValues(1.0, -1.0, 1.0, 1.0), transformMatrix);
    this.pushposition(positions, vector2);
    vec4.transformMat4(vector2, vec4.fromValues(0.0, 1.0, 1.0, 1.0), transformMatrix);
    this.pushposition(positions, vector2);
  
    vec4.transformMat4(vector2, vec4.fromValues(0.0, 1.0, 1.0, 1.0), transformMatrix);//right
    this.pushposition(positions, vector2);
    vec4.transformMat4(vector2, vec4.fromValues(0.0, 1.0, -1.0, 1.0), transformMatrix);
    this.pushposition(positions, vector2);
    vec4.transformMat4(vector2, vec4.fromValues(1.0, -1.0, -1.0, 1.0), transformMatrix);
    this.pushposition(positions, vector2);
    vec4.transformMat4(vector2, vec4.fromValues(1.0, -1.0, 1.0, 1.0), transformMatrix);
    this.pushposition(positions, vector2);
  
    vec4.transformMat4(vector2, vec4.fromValues(-1.0, -1.0, -1.0, 1.0), transformMatrix);//back
    this.pushposition(positions, vector2);
    vec4.transformMat4(vector2, vec4.fromValues(1.0, -1.0, -1.0, 1.0), transformMatrix);
    this.pushposition(positions, vector2);
    vec4.transformMat4(vector2, vec4.fromValues(0.0, 1.0, -1.0, 1.0), transformMatrix);
    this.pushposition(positions, vector2);
  
    vec4.transformMat4(vector2, vec4.fromValues(-1.0, -1.0, -1.0, 1.0), transformMatrix);//left
    this.pushposition(positions, vector2);
    vec4.transformMat4(vector2, vec4.fromValues(-1.0, -1.0, 1.0, 1.0), transformMatrix);
    this.pushposition(positions, vector2);
    vec4.transformMat4(vector2, vec4.fromValues(0.0, 1.0, 1.0, 1.0), transformMatrix);
    this.pushposition(positions, vector2);
    vec4.transformMat4(vector2, vec4.fromValues(0.0, 1.0, -1.0, 1.0), transformMatrix);
    this.pushposition(positions, vector2);

  }

  createtriangularroof(indices: number[], positions: number[], normals: number[], 
    scalingVector: vec3, translationVector: vec3, scalingVector2: vec3, 
     rad: number)
  {
    var translationMatrix = mat4.create();
    mat4.fromTranslation(translationMatrix, translationVector);
    var rotationMatrix = mat4.create();
    
    mat4.fromYRotation(rotationMatrix, rad);
    var scaleMatrix = mat4.create();
    mat4.fromScaling(scaleMatrix, scalingVector);
  
    var transformMatrix = mat4.create();
    mat4.multiply(transformMatrix, rotationMatrix, scaleMatrix);
    mat4.multiply(transformMatrix, translationMatrix, transformMatrix);
    var inverseTransformMatrix = mat4.create();
    mat4.transpose(inverseTransformMatrix, transformMatrix);
    mat4.invert(inverseTransformMatrix, inverseTransformMatrix);

    var offset = positions.length/4;

      
    indices.push(0 + offset, 2 + offset, 1 + offset, 0 + offset, 3 + offset, 2 + offset, //rightup
      4 + offset, 5 + offset, 6 + offset, 4 + offset, 6 + offset, 7 + offset, //leftup
      8 + offset, 9 + offset, 10 + offset, 8 + offset, 10 + offset, 11 + offset, //rightdown
      12 + offset, 14 + offset, 13 + offset, 12 + offset, 15 + offset, 14 + offset); //leftdown
    offset += 16;
    indices.push(0 + offset, 1 + offset, 2 + offset, 
                0 + offset, 2 + offset, 3 + offset, 
                0 + offset, 3 + offset, 4 + offset, 
                0 + offset, 4 + offset, 5 + offset);
    offset += 6;
    indices.push(0 + offset, 2 + offset, 1 + offset, 
                0 + offset, 3 + offset, 2 + offset, 
                0 + offset, 4 + offset, 3 + offset, 
                0 + offset, 5 + offset, 4 + offset);
    offset += 6;
    indices.push(0 + offset, 2 + offset, 1 + offset, 
                1 + offset, 2 + offset, 3 + offset);

    offset += 4;
    indices.push(0 + offset, 1 + offset, 2 + offset, 
                1 + offset, 3 + offset, 2 + offset);

    //up
    var upfront =  vec4.fromValues(0.0, 1.0, 1.0, 1.0);
    vec4.transformMat4(upfront, upfront, transformMatrix);
    
    if(upfront[1]>this.maxroof)
    {
      this.maxroof = upfront[1];
    }

    var upback =  vec4.fromValues(0.0, 1.0, -1.0, 1.0);
    vec4.transformMat4(upback, upback, transformMatrix);

    //right
    var rightback = vec4.fromValues(1.0, -1.0, -1.0, 1.0);
    vec4.transformMat4(rightback, rightback, transformMatrix);

    if(rightback[1]>this.minroof)
    {
      this.minroof = upfront[1];
    }

    var rightfront = vec4.fromValues(1.0, -1.0, 1.0, 1.0);
    vec4.transformMat4(rightfront, rightfront, transformMatrix);

    //left
    var leftback = vec4.fromValues(-1.0, -1.0, -1.0, 1.0);
    vec4.transformMat4(leftback, leftback, transformMatrix);
    var leftfront = vec4.fromValues(-1.0, -1.0, 1.0, 1.0);
    vec4.transformMat4(leftfront, leftfront, transformMatrix);

    var vector = vec4.create();

    //normal
    //roofrightup
    vector = vec4.fromValues(1, 1, 0, 0);
    vec4.normalize(vector, vector);
    vec4.transformMat4(vector, vector, inverseTransformMatrix);//right
    this.pushnormal(normals, vector); this.pushnormal(normals, vector); this.pushnormal(normals, vector); this.pushnormal(normals, vector);

    //roofleftup
    vector = vec4.fromValues(-1, 1, 0, 0);
    vec4.normalize(vector, vector);
    vec4.transformMat4(vector, vector, inverseTransformMatrix);//left
    this.pushnormal(normals, vector); this.pushnormal(normals, vector); this.pushnormal(normals, vector); this.pushnormal(normals, vector);

    //roofrightdown
    vector = vec4.fromValues(-1, -1, 0, 0);
    vec4.normalize(vector, vector);
    vec4.transformMat4(vector, vector, inverseTransformMatrix);//right
    this.pushnormal(normals, vector); this.pushnormal(normals, vector); this.pushnormal(normals, vector); this.pushnormal(normals, vector);

    //roofleftdown
    vector = vec4.fromValues(1, -1, 0, 0);
    vec4.normalize(vector, vector);
    vec4.transformMat4(vector, vector, inverseTransformMatrix);//right
    this.pushnormal(normals, vector); this.pushnormal(normals, vector); this.pushnormal(normals, vector); this.pushnormal(normals, vector);

    //front 6 times
    vec4.transformMat4(vector, vec4.fromValues(0, 0, 1, 0), inverseTransformMatrix);
    this.pushnormal(normals, vector); this.pushnormal(normals, vector); this.pushnormal(normals, vector); 
    this.pushnormal(normals, vector); this.pushnormal(normals, vector); this.pushnormal(normals, vector);

    //back 6 times
    vec4.transformMat4(vector, vec4.fromValues(0, 0, -1, 0), inverseTransformMatrix);
    this.pushnormal(normals, vector); this.pushnormal(normals, vector); this.pushnormal(normals, vector);
    this.pushnormal(normals, vector); this.pushnormal(normals, vector); this.pushnormal(normals, vector);

    //right 4 times
    vec4.transformMat4(vector, vec4.fromValues(1, 0, 0, 0), inverseTransformMatrix);
    this.pushnormal(normals, vector); this.pushnormal(normals, vector); this.pushnormal(normals, vector); this.pushnormal(normals, vector);
    
    //left 4 times
    vec4.transformMat4(vector, vec4.fromValues(-1, 0, 0, 0), inverseTransformMatrix);
    this.pushnormal(normals, vector); this.pushnormal(normals, vector); this.pushnormal(normals, vector); this.pushnormal(normals, vector); 
  
    //pos
    var upfrontoffset = vec4.fromValues(0.0, scalingVector2[1], scalingVector2[2], 0.0);
    vec4.transformMat4(upfrontoffset, upfrontoffset, rotationMatrix);
    var upbackoffset = vec4.fromValues(0.0, scalingVector2[1], -scalingVector2[2], 0.0);
    vec4.transformMat4(upbackoffset, upbackoffset, rotationMatrix);
    var rightdownfront = vec4.fromValues(scalingVector2[0], scalingVector2[1] - scalingVector[1]*2/scalingVector[0]*scalingVector2[0], scalingVector2[2], 0.0);
    vec4.transformMat4(rightdownfront, rightdownfront, rotationMatrix);
    var rightdownback = vec4.fromValues(scalingVector2[0], scalingVector2[1] - scalingVector[1]*2/scalingVector[0]*scalingVector2[0], -scalingVector2[2], 0.0);
    vec4.transformMat4(rightdownback, rightdownback, rotationMatrix);
    var leftdownfront = vec4.fromValues(-scalingVector2[0], scalingVector2[1] - scalingVector[1]*2/scalingVector[0]*scalingVector2[0], scalingVector2[2], 0.0);
    vec4.transformMat4(leftdownfront, leftdownfront, rotationMatrix);
    var leftdownback = vec4.fromValues(-scalingVector2[0], scalingVector2[1] - scalingVector[1]*2/scalingVector[0]*scalingVector2[0], -scalingVector2[2], 0.0);
    vec4.transformMat4(leftdownback, leftdownback, rotationMatrix);
    var vector2 = vec4.create();

    //right
    vec4.add(vector2, upfront, upfrontoffset);
    this.pushposition(positions, vector2);
    vec4.add(vector2, upback, upbackoffset);
    this.pushposition(positions, vector2);
    vec4.add(vector2, rightback, rightdownback);
    this.pushposition(positions, vector2);
    vec4.add(vector2, rightfront, rightdownfront);
    this.pushposition(positions, vector2);

    //left
    vec4.add(vector2, leftback, leftdownback);
    this.pushposition(positions, vector2);
    vec4.add(vector2, leftfront, leftdownfront);
    this.pushposition(positions, vector2);
    vec4.add(vector2, upfront, upfrontoffset);
    this.pushposition(positions, vector2);
    vec4.add(vector2, upback, upbackoffset);
    this.pushposition(positions, vector2);

    var upfrontoffset2 = vec4.fromValues(0.0, 0.0, scalingVector2[2], 0.0);
    vec4.transformMat4(upfrontoffset2, upfrontoffset2, rotationMatrix);
    var upbackoffset2 = vec4.fromValues(0.0, 0.0, -scalingVector2[2], 0.0);
    vec4.transformMat4(upbackoffset2, upbackoffset2, rotationMatrix);
    var rightdownfront2 = vec4.fromValues(scalingVector2[0], - scalingVector[1]*2/scalingVector[0]*scalingVector2[0], scalingVector2[2], 0.0);
    vec4.transformMat4(rightdownfront2, rightdownfront2, rotationMatrix);
    var rightdownback2 = vec4.fromValues(scalingVector2[0], - scalingVector[1]*2/scalingVector[0]*scalingVector2[0], -scalingVector2[2], 0.0);
    vec4.transformMat4(rightdownback2, rightdownback2, rotationMatrix);
    var leftdownfront2 = vec4.fromValues(-scalingVector2[0], - scalingVector[1]*2/scalingVector[0]*scalingVector2[0], scalingVector2[2], 0.0);
    vec4.transformMat4(leftdownfront2, leftdownfront2, rotationMatrix);
    var leftdownback2 = vec4.fromValues(-scalingVector2[0], - scalingVector[1]*2/scalingVector[0]*scalingVector2[0], -scalingVector2[2], 0.0);
    vec4.transformMat4(leftdownback2, leftdownback2, rotationMatrix);

    //rightdown
    vec4.add(vector2, upfront, upfrontoffset2);
    this.pushposition(positions, vector2);
    vec4.add(vector2, upback, upbackoffset2);
    this.pushposition(positions, vector2);
    vec4.add(vector2, rightback, rightdownback2);
    this.pushposition(positions, vector2);
    vec4.add(vector2, rightfront, rightdownfront2);
    this.pushposition(positions, vector2);

    //leftdown
    vec4.add(vector2, leftback, leftdownback2);
    this.pushposition(positions, vector2);
    vec4.add(vector2, leftfront, leftdownfront2);
    this.pushposition(positions, vector2);
    vec4.add(vector2, upfront, upfrontoffset2);
    this.pushposition(positions, vector2);
    vec4.add(vector2, upback, upbackoffset2);
    this.pushposition(positions, vector2);

    //front
    vec4.add(vector2, upfront, upfrontoffset);
    this.pushposition(positions, vector2);
    vec4.add(vector2, leftfront, leftdownfront);
    this.pushposition(positions, vector2);
    vec4.add(vector2, leftfront, leftdownfront2);
    this.pushposition(positions, vector2);
    vec4.add(vector2, upfront, upfrontoffset2);
    this.pushposition(positions, vector2);
    vec4.add(vector2, rightfront, rightdownfront2);
    this.pushposition(positions, vector2);
    vec4.add(vector2, rightfront, rightdownfront);
    this.pushposition(positions, vector2);

    //back
    vec4.add(vector2, upback, upbackoffset);
    this.pushposition(positions, vector2);
    vec4.add(vector2, leftback, leftdownback);
    this.pushposition(positions, vector2);
    vec4.add(vector2, leftback, leftdownback2);
    this.pushposition(positions, vector2);
    vec4.add(vector2, upback, upbackoffset2);
    this.pushposition(positions, vector2);
    vec4.add(vector2, rightback, rightdownback2);
    this.pushposition(positions, vector2);
    vec4.add(vector2, rightback, rightdownback);
    this.pushposition(positions, vector2);

    //right
    vec4.add(vector2, rightfront, rightdownfront2);
    this.pushposition(positions, vector2);
    vec4.add(vector2, rightfront, rightdownfront);
    this.pushposition(positions, vector2);
    vec4.add(vector2, rightback, rightdownback2);
    this.pushposition(positions, vector2);
    vec4.add(vector2, rightback, rightdownback);
    this.pushposition(positions, vector2);

    //left
    vec4.add(vector2, leftfront, leftdownfront2);
    this.pushposition(positions, vector2);
    vec4.add(vector2, leftfront, leftdownfront);
    this.pushposition(positions, vector2);
    vec4.add(vector2, leftback, leftdownback2);
    this.pushposition(positions, vector2);
    vec4.add(vector2, leftback, leftdownback);
    this.pushposition(positions, vector2);
  }

  createeave(indices: number[], positions: number[], normals: number[], scalingVector: vec3, translationVector: vec3, rad: number)
  {
    var translationMatrix = mat4.create();
    mat4.fromTranslation(translationMatrix, translationVector);
    var rotationMatrix = mat4.create();
    mat4.fromYRotation(rotationMatrix, rad);
    var scaleMatrix = mat4.create();
    mat4.fromScaling(scaleMatrix, scalingVector);
  
    var transformMatrix = mat4.create();
    mat4.multiply(transformMatrix, rotationMatrix, scaleMatrix);
    mat4.multiply(transformMatrix, translationMatrix, transformMatrix);
    var inverseTransformMatrix = mat4.create();
    mat4.transpose(inverseTransformMatrix, transformMatrix);
    mat4.invert(inverseTransformMatrix, inverseTransformMatrix);

    var offset = positions.length/4;
  
    for(let i = 0; i < this.eavemesh.indices.length; i++)
    {
      indices.push(this.eavemesh.indices[i] + offset);
    }

    for(let i = 0; i < this.eavemesh.vertices.length; i+=3)
    {
      var vector = vec4.create();
      vec4.transformMat4(vector, vec4.fromValues(this.eavemesh.vertexNormals[i], this.eavemesh.vertexNormals[i+1], this.eavemesh.vertexNormals[i+2], 0), inverseTransformMatrix);
      this.pushnormal(normals, vector); 
      vec4.transformMat4(vector, vec4.fromValues(this.eavemesh.vertices[i], this.eavemesh.vertices[i+1], this.eavemesh.vertices[i+2], 1), transformMatrix);
      this.pushposition(positions, vector); 
    }
  }

  createobj(mesh: any, indices: number[], positions: number[], normals: number[], scalingVector: vec3, translationVector: vec3, rad: number)
  {
    var translationMatrix = mat4.create();
    mat4.fromTranslation(translationMatrix, translationVector);
    var rotationMatrix = mat4.create();
    mat4.fromYRotation(rotationMatrix, rad);
    var scaleMatrix = mat4.create();
    mat4.fromScaling(scaleMatrix, scalingVector);
  
    var transformMatrix = mat4.create();
    mat4.multiply(transformMatrix, rotationMatrix, scaleMatrix);
    mat4.multiply(transformMatrix, translationMatrix, transformMatrix);
    var inverseTransformMatrix = mat4.create();
    mat4.transpose(inverseTransformMatrix, transformMatrix);
    mat4.invert(inverseTransformMatrix, inverseTransformMatrix);

    var offset = positions.length/4;
  
    for(let i = 0; i < mesh.indices.length; i++)
    {
      indices.push(mesh.indices[i] + offset);
    }

    for(let i = 0; i < mesh.vertices.length; i+=3)
    {
      var vector = vec4.create();
      vec4.transformMat4(vector, vec4.fromValues(mesh.vertexNormals[i], mesh.vertexNormals[i+1], mesh.vertexNormals[i+2], 0), inverseTransformMatrix);
      this.pushnormal(normals, vector); 
      vec4.transformMat4(vector, vec4.fromValues(mesh.vertices[i], mesh.vertices[i+1], mesh.vertices[i+2], 1), transformMatrix);
      this.pushposition(positions, vector); 
    }
  }

  createcube(indices: number[], positions: number[], normals: number[], scalingVector: vec3, translationVector: vec3, rad: number)
  {
    var translationMatrix = mat4.create();
    mat4.fromTranslation(translationMatrix, translationVector);
    var rotationMatrix = mat4.create();
    mat4.fromYRotation(rotationMatrix, rad);
    var scaleMatrix = mat4.create();
    mat4.fromScaling(scaleMatrix, scalingVector);
  
    var transformMatrix = mat4.create();
    mat4.multiply(transformMatrix, rotationMatrix, scaleMatrix);
    mat4.multiply(transformMatrix, translationMatrix, transformMatrix);
    var inverseTransformMatrix = mat4.create();
    mat4.transpose(inverseTransformMatrix, transformMatrix);
    mat4.invert(inverseTransformMatrix, inverseTransformMatrix);

    var offset = positions.length/4;
  
    indices.push(0 + offset, 1 + offset, 2 + offset, 0 + offset, 2 + offset, 3 + offset, //front
                  4 + offset, 6 + offset, 5 + offset, 4 + offset, 7 + offset, 6 + offset, //right
                  8 + offset, 10 + offset, 9 + offset, 8 + offset, 11 + offset, 10 + offset, //back
                  12 + offset, 13 + offset, 14 + offset, 12 + offset, 14 + offset, 15 + offset, //left
                  16 + offset, 18 + offset, 17 + offset, 16 + offset, 19 + offset, 18 + offset, //upper
                  20 + offset, 21 + offset, 22 + offset, 20 + offset, 22 + offset, 23 + offset); // button
  
    var vector = vec4.create();
    vec4.transformMat4(vector, vec4.fromValues(0, 0, 1, 0), inverseTransformMatrix);//front
    this.pushnormal(normals, vector); this.pushnormal(normals, vector); this.pushnormal(normals, vector); this.pushnormal(normals, vector);
  
    vec4.transformMat4(vector, vec4.fromValues(1, 0, 0, 0), inverseTransformMatrix);//right
    this.pushnormal(normals, vector); this.pushnormal(normals, vector); this.pushnormal(normals, vector); this.pushnormal(normals, vector);
  
    vec4.transformMat4(vector, vec4.fromValues(0, 0, -1, 0), inverseTransformMatrix);//back
    this.pushnormal(normals, vector); this.pushnormal(normals, vector); this.pushnormal(normals, vector); this.pushnormal(normals, vector);
  
    vec4.transformMat4(vector, vec4.fromValues(-1, 0, 0, 0), inverseTransformMatrix);//left
    this.pushnormal(normals, vector); this.pushnormal(normals, vector); this.pushnormal(normals, vector); this.pushnormal(normals, vector);
  
    vec4.transformMat4(vector, vec4.fromValues(0, 1, 0, 0), inverseTransformMatrix);//up
    this.pushnormal(normals, vector); this.pushnormal(normals, vector); this.pushnormal(normals, vector); this.pushnormal(normals, vector);
  
    vec4.transformMat4(vector, vec4.fromValues(0, -1, 0, 0), inverseTransformMatrix);//buttom
    this.pushnormal(normals, vector); this.pushnormal(normals, vector); this.pushnormal(normals, vector); this.pushnormal(normals, vector);
  
    //pos
    var vector2 = vec4.create();
    vec4.transformMat4(vector2, vec4.fromValues(-1.0, -1.0, 1.0, 1.0), transformMatrix);//front
    this.pushposition(positions, vector2);
    vec4.transformMat4(vector2, vec4.fromValues(1.0, -1.0, 1.0, 1.0), transformMatrix);
    this.pushposition(positions, vector2);
    vec4.transformMat4(vector2, vec4.fromValues(1.0, 1.0, 1.0, 1.0), transformMatrix);
    this.pushposition(positions, vector2);
    vec4.transformMat4(vector2, vec4.fromValues(-1.0, 1.0, 1.0, 1.0), transformMatrix);
    this.pushposition(positions, vector2);
  
    vec4.transformMat4(vector2, vec4.fromValues(1.0, 1.0, 1.0, 1.0), transformMatrix);//right
    this.pushposition(positions, vector2);
    vec4.transformMat4(vector2, vec4.fromValues(1.0, 1.0, -1.0, 1.0), transformMatrix);
    this.pushposition(positions, vector2);
    vec4.transformMat4(vector2, vec4.fromValues(1.0, -1.0, -1.0, 1.0), transformMatrix);
    this.pushposition(positions, vector2);
    vec4.transformMat4(vector2, vec4.fromValues(1.0, -1.0, 1.0, 1.0), transformMatrix);
    this.pushposition(positions, vector2);
  
    vec4.transformMat4(vector2, vec4.fromValues(-1.0, -1.0, -1.0, 1.0), transformMatrix);//back
    this.pushposition(positions, vector2);
    vec4.transformMat4(vector2, vec4.fromValues(1.0, -1.0, -1.0, 1.0), transformMatrix);
    this.pushposition(positions, vector2);
    vec4.transformMat4(vector2, vec4.fromValues(1.0, 1.0, -1.0, 1.0), transformMatrix);
    this.pushposition(positions, vector2);
    vec4.transformMat4(vector2, vec4.fromValues( -1.0, 1.0, -1.0, 1.0), transformMatrix);
    this.pushposition(positions, vector2);
  
    vec4.transformMat4(vector2, vec4.fromValues(-1.0, -1.0, -1.0, 1.0), transformMatrix);//left
    this.pushposition(positions, vector2);
    vec4.transformMat4(vector2, vec4.fromValues(-1.0, -1.0, 1.0, 1.0), transformMatrix);
    this.pushposition(positions, vector2);
    vec4.transformMat4(vector2, vec4.fromValues(-1.0, 1.0, 1.0, 1.0), transformMatrix);
    this.pushposition(positions, vector2);
    vec4.transformMat4(vector2, vec4.fromValues(-1.0, 1.0, -1.0, 1.0), transformMatrix);
    this.pushposition(positions, vector2);
  
    vec4.transformMat4(vector2, vec4.fromValues(1.0, 1.0, 1.0, 1.0), transformMatrix);//up
    this.pushposition(positions, vector2);
    vec4.transformMat4(vector2, vec4.fromValues(-1.0, 1.0, 1.0, 1.0), transformMatrix);
    this.pushposition(positions, vector2);
    vec4.transformMat4(vector2, vec4.fromValues(-1.0, 1.0, -1.0, 1.0), transformMatrix);
    this.pushposition(positions, vector2);
    vec4.transformMat4(vector2, vec4.fromValues(1.0, 1.0, -1.0, 1.0), transformMatrix);
    this.pushposition(positions, vector2);
  
    vec4.transformMat4(vector2, vec4.fromValues(-1.0, -1.0, -1.0, 1.0), transformMatrix);//buttom
    this.pushposition(positions, vector2);
    vec4.transformMat4(vector2, vec4.fromValues(1.0, -1.0, -1.0, 1.0), transformMatrix);
    this.pushposition(positions, vector2);
    vec4.transformMat4(vector2, vec4.fromValues(1.0, -1.0, 1.0, 1.0), transformMatrix);
    this.pushposition(positions, vector2);
    vec4.transformMat4(vector2, vec4.fromValues(-1.0, -1.0, 1.0, 1.0), transformMatrix);
    this.pushposition(positions, vector2);  
  }


  createcubes(indices: number[], positions: number[], normals: number[], iteration: number, 
    sections: Section[], allsections: Section[],
    moveup: number, randomness: number, 
    boundx: number, boundy: number, boundz: number,
    bigi: number, bigj: number, rad: number)
  {
    var supportstep = 0.15;
    var supportwidth = 0.01;
    var roofthickness = 0.07;
    var balconyrailingheight = 0.1;
    var offsetforgeneration = 0.05;
    var randomness2 = 0.5;//transform into balcony
    var randomness3 = 0.5;//after transform into balcony, got a prism or not

    for(let i = 0; i < iteration; i++)
    {
      var sectionssize = sections.length;
      for(let j = 0; j < sectionssize; j++)
      {
        //create cube
        var tempsection = sections.shift();
        var scalingVector = vec3.fromValues(tempsection.halfweight, tempsection.halfheight, tempsection.halfdepth);
        var translationVector = vec3.fromValues(tempsection.translateweight, tempsection.translateheight + moveup, tempsection.translatedepth);
        
        //roof scaling and translation
        scalingVector[1] *= Math.random() * 0.25 + 0.25;
        var translationVector2 = translationVector;
        translationVector2[1] += tempsection.halfheight + scalingVector[1];
        var scalingVector2 = vec3.fromValues(roofthickness, roofthickness, roofthickness);
        
        var randomint = this.getRandomInt(0, 2);
        if(randomint==1)
        {
          let temp = scalingVector[0];
          scalingVector[0] = scalingVector[2];
          scalingVector[2] = temp;
          temp = scalingVector2[0];
          scalingVector2[0] = scalingVector2[2];
          scalingVector2[2] = temp;
        }

        //transform it into balcony
        //balconyrailingheight < tempsection.halfheight
        if(!tempsection.isroot && balconyrailingheight < tempsection.halfheight && Math.random()<randomness2)
        {
          //is a balcony
          tempsection.intobaclony = true;
          
          //create roof
          this.createtriangularroof(this.roof.indices, this.roof.positions, this.roof.normals, 
            scalingVector, translationVector2, scalingVector2, rad + randomint * Math.PI * 0.5);

          //create prism
          if(Math.random()<randomness3)
          {
            this.createtriangularprism(indices, positions, normals, scalingVector, translationVector2, rad + randomint * Math.PI * 0.5);
          }

          //create railing
          var ratio = scalingVector[1] / scalingVector[0];
          var offset = roofthickness * 2 * ratio;
          var railingscalingVector = vec3.fromValues(tempsection.halfweight, balconyrailingheight, tempsection.halfdepth);
          var railingtranslationVector = vec3.fromValues(tempsection.translateweight, tempsection.translateheight + moveup - (tempsection.halfheight - balconyrailingheight), tempsection.translatedepth);
          this.createcube(indices, positions, normals, railingscalingVector, railingtranslationVector, rad);

          //railngpillars
          var pillarscalingVector = vec3.fromValues(supportwidth, tempsection.halfheight + 1 / 2 * offset, supportwidth);
          var pillartranslationVector = vec3.fromValues(tempsection.translateweight - tempsection.halfweight + roofthickness, tempsection.translateheight + moveup + 1 / 2 * offset, tempsection.translatedepth - tempsection.halfdepth + roofthickness);
          this.createcube(this.support.indices, this.support.positions, this.support.normals, pillarscalingVector, pillartranslationVector, rad);
          pillartranslationVector = vec3.fromValues(tempsection.translateweight + tempsection.halfweight - roofthickness, tempsection.translateheight + moveup + 1 / 2 * offset, tempsection.translatedepth - tempsection.halfdepth + roofthickness);
          this.createcube(this.support.indices, this.support.positions, this.support.normals, pillarscalingVector, pillartranslationVector, rad);
          pillartranslationVector = vec3.fromValues(tempsection.translateweight - tempsection.halfweight + roofthickness, tempsection.translateheight + moveup + 1 / 2 * offset, tempsection.translatedepth + tempsection.halfdepth - roofthickness);
          this.createcube(this.support.indices, this.support.positions, this.support.normals, pillarscalingVector, pillartranslationVector, rad);
          pillartranslationVector = vec3.fromValues(tempsection.translateweight + tempsection.halfweight - roofthickness, tempsection.translateheight + moveup + 1 / 2 * offset, tempsection.translatedepth + tempsection.halfdepth - roofthickness);
          this.createcube(this.support.indices, this.support.positions, this.support.normals, pillarscalingVector, pillartranslationVector, rad);
        }
        else
        {
          //create roof
          this.createtriangularroof(this.roof.indices, this.roof.positions, this.roof.normals, 
            scalingVector, translationVector2, scalingVector2, rad + randomint * Math.PI * 0.5);
          this.createtriangularprism(indices, positions, normals, scalingVector, translationVector2, rad + randomint * Math.PI * 0.5);

          //create cube
          this.createcube(indices, positions, normals, vec3.fromValues(tempsection.halfweight, tempsection.halfheight, tempsection.halfdepth), 
          vec3.fromValues(tempsection.translateweight, tempsection.translateheight + moveup, tempsection.translatedepth), rad);
        }


        var eavetranslationVector = vec3.fromValues(translationVector2[0], translationVector2[1], translationVector2[2]);
        //add eave
        if(randomint==1)
        {
          eavetranslationVector[1] += scalingVector[1] + roofthickness;
          eavetranslationVector[0] += scalingVector[2] + roofthickness;
          this.createeave(this.ridge.indices, this.ridge.positions, this.ridge.normals, scalingVector2, eavetranslationVector, rad + randomint * Math.PI * 0.5);
          eavetranslationVector[0] -= 2 * (scalingVector[2] + roofthickness);
          this.createeave(this.ridge.indices, this.ridge.positions, this.ridge.normals, scalingVector2, eavetranslationVector, rad + Math.PI + randomint * Math.PI * 0.5);
        }
        else
        {
          eavetranslationVector[1] += scalingVector[1] + roofthickness;
          eavetranslationVector[2] += scalingVector[2] + roofthickness;
          this.createeave(this.ridge.indices, this.ridge.positions, this.ridge.normals, scalingVector2, eavetranslationVector, rad + randomint * Math.PI * 0.5);
          eavetranslationVector[2] -= 2 * (scalingVector[2] + roofthickness);
          this.createeave(this.ridge.indices, this.ridge.positions, this.ridge.normals, scalingVector2, eavetranslationVector, rad + Math.PI + randomint * Math.PI * 0.5);
        }

        //add rooftop
        var rooftoptranslationVector = vec3.fromValues(translationVector2[0], translationVector2[1] + scalingVector[1] + roofthickness, translationVector2[2]);
        var rooftopscalingVector = vec3.fromValues(roofthickness / 3.0, roofthickness / 3.0, scalingVector[2]+ 2.0 * roofthickness);
        this.createcube(this.ridge.indices, this.ridge.positions, this.ridge.normals, rooftopscalingVector, rooftoptranslationVector, rad + randomint * Math.PI * 0.5);


        //create support
        if(tempsection.rightgenerated)
        {
          let widescalingVector = vec3.fromValues(tempsection.halfweight + roofthickness, roofthickness / 2.0, tempsection.halfdepth + roofthickness);
          let widetranslationVector = vec3.fromValues(tempsection.translateweight, tempsection.translateheight + moveup - tempsection.halfheight, tempsection.translatedepth);
          this.createcube(this.support.indices, this.support.positions, this.support.normals, widescalingVector, widetranslationVector, rad);
          var numofsupports = Math.floor(tempsection.halfdepth * 2 / supportstep);
          var newsupportstep = tempsection.halfdepth * 2 / numofsupports;
          for(var index = -tempsection.halfdepth; index <= tempsection.halfdepth; index += newsupportstep)
          {
            var xdist = tempsection.halfweight - supportwidth * 2.0;
            var ydist = -((tempsection.translateheight + moveup - tempsection.halfheight) * 0.5 + tempsection.halfheight);
            var zdist = index;
            let translationVector3 = vec3.fromValues(xdist, ydist, zdist);
            vec3.add(translationVector3, translationVector3, vec3.fromValues(tempsection.translateweight, tempsection.translateheight + moveup, tempsection.translatedepth));
            let scalingVector3 = vec3.fromValues(supportwidth, (tempsection.translateheight + moveup - tempsection.halfheight) * 0.5, supportwidth);
            this.createcube(this.support.indices, this.support.positions, this.support.normals, scalingVector3, translationVector3, 0.0);
          }
        }

        if(tempsection.leftgenerated)
        {
          let widescalingVector = vec3.fromValues(tempsection.halfweight + roofthickness, roofthickness / 2.0, tempsection.halfdepth + roofthickness);
          let widetranslationVector = vec3.fromValues(tempsection.translateweight, tempsection.translateheight + moveup - tempsection.halfheight, tempsection.translatedepth);
          this.createcube(this.support.indices, this.support.positions, this.support.normals, widescalingVector, widetranslationVector, rad);
          var numofsupports = Math.floor(tempsection.halfdepth * 2 / supportstep);
          var newsupportstep = tempsection.halfdepth * 2 / numofsupports;
          for(var index = -tempsection.halfdepth; index <= tempsection.halfdepth; index += newsupportstep)
          {
            var xdist = - tempsection.halfweight + supportwidth * 2.0;
            var ydist = -((tempsection.translateheight + moveup - tempsection.halfheight) * 0.5 + tempsection.halfheight);
            var zdist = index;
            let translationVector3 = vec3.fromValues(xdist, ydist, zdist);
            vec3.add(translationVector3, translationVector3, vec3.fromValues(tempsection.translateweight, tempsection.translateheight + moveup, tempsection.translatedepth));
            let scalingVector3 = vec3.fromValues(supportwidth, (tempsection.translateheight + moveup - tempsection.halfheight) * 0.5, supportwidth);
            this.createcube(this.support.indices, this.support.positions, this.support.normals, scalingVector3, translationVector3, 0.0);
          }
        }

        if(tempsection.frontgenerated)
        {
          let widescalingVector = vec3.fromValues(tempsection.halfweight + roofthickness, roofthickness / 2.0, tempsection.halfdepth + roofthickness);
          let widetranslationVector = vec3.fromValues(tempsection.translateweight, tempsection.translateheight + moveup - tempsection.halfheight, tempsection.translatedepth);
          this.createcube(this.support.indices, this.support.positions, this.support.normals, widescalingVector, widetranslationVector, rad);
          var numofsupports = Math.floor(tempsection.halfweight * 2 / supportstep);
          var newsupportstep = tempsection.halfweight * 2 / numofsupports;
          for(var index = -tempsection.halfweight; index <= tempsection.halfweight; index += newsupportstep)
          {
            var xdist = index;
            var ydist = -((tempsection.translateheight + moveup - tempsection.halfheight) * 0.5 + tempsection.halfheight);
            var zdist = tempsection.halfdepth - supportwidth * 2.0;
            let translationVector3 = vec3.fromValues(xdist, ydist, zdist);
            vec3.add(translationVector3, translationVector3, vec3.fromValues(tempsection.translateweight, tempsection.translateheight + moveup, tempsection.translatedepth));
            let scalingVector3 = vec3.fromValues(supportwidth, (tempsection.translateheight + moveup - tempsection.halfheight) * 0.5, supportwidth);
            this.createcube(this.support.indices, this.support.positions, this.support.normals, scalingVector3, translationVector3, 0.0);
          }
        }

        if(tempsection.backgenerated)
        {
          let widescalingVector = vec3.fromValues(tempsection.halfweight + roofthickness, roofthickness / 2.0, tempsection.halfdepth + roofthickness);
          let widetranslationVector = vec3.fromValues(tempsection.translateweight, tempsection.translateheight + moveup - tempsection.halfheight, tempsection.translatedepth);
          this.createcube(this.support.indices, this.support.positions, this.support.normals, widescalingVector, widetranslationVector, rad);
          var numofsupports = Math.floor(tempsection.halfweight * 2 / supportstep);
          var newsupportstep = tempsection.halfweight * 2 / numofsupports;
          for(var index = -tempsection.halfweight; index <= tempsection.halfweight; index += newsupportstep)
          {
            var xdist = index;
            var ydist = -((tempsection.translateheight + moveup - tempsection.halfheight) * 0.5 + tempsection.halfheight);
            var zdist = -tempsection.halfdepth + supportwidth * 2.0;
            let translationVector3 = vec3.fromValues(xdist, ydist, zdist);
            vec3.add(translationVector3, translationVector3, vec3.fromValues(tempsection.translateweight, tempsection.translateheight + moveup, tempsection.translatedepth));
            let scalingVector3 = vec3.fromValues(supportwidth, (tempsection.translateheight + moveup - tempsection.halfheight) * 0.5, supportwidth);
            this.createcube(this.support.indices, this.support.positions, this.support.normals, scalingVector3, translationVector3, 0.0);
          }
        }

        //Add attachment, not a baclony
        if(Math.random()<randomness && tempsection.right && !tempsection.intobaclony)
        {
          let temphalfdepth = Math.random() * 0.5 * tempsection.halfdepth + 0.25 * tempsection.halfdepth;
          let temphalfheight = Math.random() * 0.5 * tempsection.halfheight + 0.25 * tempsection.halfheight;
          let temphalfweight = Math.random() * 0.5 * tempsection.halfweight + 0.25 * tempsection.halfweight;
          temphalfweight = Math.min(boundx + bigi - (tempsection.translateweight + tempsection.halfweight), temphalfweight);
          let rangedtrans = tempsection.halfdepth - temphalfdepth;
          let rangehtrans = tempsection.halfheight - temphalfheight;
          let dtrans = Math.random() * rangedtrans * 2.0 - rangedtrans;
          let htrans = Math.random() * rangehtrans * 2.0 - rangehtrans;
          let tempsection2 = new Section(temphalfweight, temphalfheight, temphalfdepth, 
                                             tempsection.translateweight + tempsection.halfweight, tempsection.translateheight + htrans, tempsection.translatedepth + dtrans);
          if(temphalfweight==boundx + bigi - (tempsection.translateweight + tempsection.halfweight))
          {
            tempsection2.right = false;
          }
          tempsection2.left = false;
          tempsection2.rightgenerated = true;
          sections.push(tempsection2);
          tempsection.right = false;
        }
  
        if(Math.random()<randomness && tempsection.left && !tempsection.intobaclony)
        {
          let temphalfdepth = Math.random() * 0.5 * tempsection.halfdepth + 0.25 * tempsection.halfdepth;
          let temphalfheight = Math.random() * 0.5 * tempsection.halfheight + 0.25 * tempsection.halfheight;
          let temphalfweight = Math.random() * 0.5 * tempsection.halfweight + 0.25 * tempsection.halfweight;
          temphalfweight = Math.min(boundx + bigi - (tempsection.translateweight + tempsection.halfweight), temphalfweight);
          let rangedtrans = tempsection.halfdepth - temphalfdepth;
          let rangehtrans = tempsection.halfheight - temphalfheight;
          let dtrans = Math.random() * rangedtrans * 2.0 - rangedtrans;
          let htrans = Math.random() * rangehtrans * 2.0 - rangehtrans;
          let tempsection2 = new Section(temphalfweight, temphalfheight, temphalfdepth, 
                                             tempsection.translateweight - tempsection.halfweight, tempsection.translateheight + htrans, tempsection.translatedepth + dtrans);
          if(temphalfweight==boundx + bigi - (tempsection.translateweight + tempsection.halfweight))
          {
            tempsection2.left = false;
          }
          tempsection2.right = false;
          tempsection2.leftgenerated = true;
          sections.push(tempsection2);
          tempsection.left = false;
        }
  
        if(Math.random()<randomness && tempsection.front && !tempsection.intobaclony)
        {
          let temphalfdepth = Math.random() * 0.5 * tempsection.halfdepth + 0.25 * tempsection.halfdepth;
          let temphalfheight = Math.random() * 0.5 * tempsection.halfheight + 0.25 * tempsection.halfheight;
          let temphalfweight = Math.random() * 0.5 * tempsection.halfweight + 0.25 * tempsection.halfweight;
          temphalfdepth = Math.min(boundz + bigj - (tempsection.translatedepth + tempsection.halfdepth), temphalfdepth);
          let rangewtrans = tempsection.halfweight - temphalfweight;
          let rangehtrans = tempsection.halfheight - temphalfheight;
          let wtrans = Math.random() * rangewtrans * 2.0 - rangewtrans;
          let htrans = Math.random() * rangehtrans * 2.0 - rangehtrans;
          let tempsection2 = new Section(temphalfweight, temphalfheight, temphalfdepth, 
                                             tempsection.translateweight + wtrans, tempsection.translateheight + htrans, tempsection.translatedepth + tempsection.halfdepth);
          if(temphalfdepth==boundz + bigj - (tempsection.translatedepth + tempsection.halfdepth))
          {
            tempsection2.front = false;
          }
          tempsection2.back = false;
          tempsection2.frontgenerated = true;
          sections.push(tempsection2);
          tempsection.front = false;
        }
  
        if(Math.random()<randomness && tempsection.back && !tempsection.intobaclony)
        {
          let temphalfdepth = Math.random() * 0.5 * tempsection.halfdepth + 0.25 * tempsection.halfdepth;
          let temphalfheight = Math.random() * 0.5 * tempsection.halfheight + 0.25 * tempsection.halfheight;
          let temphalfweight = Math.random() * 0.5 * tempsection.halfweight + 0.25 * tempsection.halfweight;
          temphalfdepth = Math.min(boundz + bigj - (tempsection.translatedepth + tempsection.halfdepth), temphalfdepth);
          let rangewtrans = tempsection.halfweight - temphalfweight;
          let rangehtrans = tempsection.halfheight - temphalfheight;
          let wtrans = Math.random() * rangewtrans * 2.0 - rangewtrans;
          let htrans = Math.random() * rangehtrans * 2.0 - rangehtrans;
          let tempsection2 = new Section(temphalfweight, temphalfheight, temphalfdepth, 
                                             tempsection.translateweight + wtrans, tempsection.translateheight + htrans, tempsection.translatedepth - tempsection.halfdepth);
          if(temphalfdepth==boundz + bigj - (tempsection.translatedepth + tempsection.halfdepth))
          {
            tempsection2.back = false;
          }
          tempsection2.front = false;
          tempsection2.backgenerated = true;
          sections.push(tempsection2);
          tempsection.back = false;
        }
  
        if(Math.random()<randomness && tempsection.up && !tempsection.intobaclony)
        {
          let temphalfdepth = Math.random() * 0.5 * tempsection.halfdepth + 0.25 * tempsection.halfdepth;
          let temphalfheight = Math.random() * 0.5 * tempsection.halfheight + 0.25 * tempsection.halfheight;
          let temphalfweight = Math.random() * 0.5 * tempsection.halfweight + 0.25 * tempsection.halfweight;
          let rangewtrans = tempsection.halfweight - temphalfweight;
          let rangedtrans = tempsection.halfdepth - temphalfdepth;
          let wtrans = Math.random() * rangewtrans * 2.0 - rangewtrans;
          let dtrans = Math.random() * rangedtrans * 2.0 - rangedtrans;
          let tempsection2 = new Section(temphalfweight, temphalfheight, temphalfdepth, 
                                             tempsection.translateweight + wtrans, tempsection.translateheight + tempsection.halfheight, tempsection.translatedepth + dtrans);
          tempsection2.upgenerated = true;
          sections.push(tempsection2);
          tempsection.up = false;
        }
  
        allsections.push(tempsection);
      }
    }
  }

  fract(x: number)
  {
    return x - Math.floor(x);
  }

  random (st: vec2) {
    return this.fract(Math.sin(vec2.dot(st, vec2.fromValues(12.9898,78.233)))* 43758.5453123);
  }

  mix(x: number, y: number, a: number){
    return x * (1 - a) + y * a;
  }

  noise (st: vec2) {
    var i = vec2.create();
    vec2.floor(i, st);
    var f = vec2.create();
    vec2.subtract(f, st, i);

    // Four corners in 2D of a tile
    var a = this.random(i);
    var b = this.random(vec2.fromValues(i[0]+1.0, i[1]));
    var c = this.random(vec2.fromValues(i[0], i[1]+1.0));
    var d = this.random(vec2.fromValues(i[0]+1.0, i[1]+1.0));

    var u = vec2.create();
    u = vec2.fromValues(f[0]*f[0]*(3.0-2.0*f[0]), f[1]*f[1]*(3.0-2.0*f[1]));

    return this.mix(a, b, u[0]) +
            (c - a)* u[1] * (1.0 - u[0]) +
            (d - b) * u[0] * u[1];
    }

  fbm(st: vec2)
  {
      // Initial values
      var value = 0.0;
      var amplitude = .5;
      var frequency = 0.;
      var OCTAVES = 6;
      //
      // Loop of octaves
      for (var i = 0; i < OCTAVES; i++) {
          value += amplitude * this.noise(st);
          vec2.scale(st, st, 2.0);
          amplitude *= .5;
      }
      return value;  
  }

  create() {

  //http://in2gpu.com/2015/07/09/drawing-cube-with-indices/
  var indices = new Array<number>();
  var positions = new Array<number>();
  var normals = new Array<number>();

  var sections = new Array<Section>();
  var allsections = new Array<Section>();

  var step = 2.5;
  var totalnumber = 30;
  var halfrange = totalnumber * step / 2.0;
  var scaleofnoise = totalnumber / 10.0;

  //initialization
  var symbols = new Array<Array<Symbol>>();
  for(let i = 0; i < totalnumber; i++)
  {
    symbols.push([]);
    for(let j = 0; j < totalnumber; j++)
    {
      symbols[i][j] = new Symbol();
    }
  }
  //river
  var ri = 1;
  var rj = Math.floor(Math.random() * totalnumber)-1;
  //symbols[ri][rj].mark = 6;
  console.log("rj"+rj);
  //can to right or to left
  var rjplus = false;
  var rjminus = false;
  //for tiles
  var direction = 0;
  var tile = 0;
  //for world
  var riverrad = 0.0;
  //var tempindex = 0.0
  while(ri<totalnumber-1 && ri>=1 && rj<totalnumber-1 && rj>=1)
  {
    symbols[ri][rj].mark = 6;
    //tempindex++;
    //record ri and rj
    let oldri = ri;
    let oldrj = rj;
    let randomroad = Math.random();
    //to front 0
    if(randomroad<0.33 && symbols[ri+1][rj].mark!=6)
    {
      ri++;
      if(direction == 0)
      {
        tile = 0;
      }
      if(direction == 1)
      {
        tile = 2;
      }
      if(direction == 2)
      {
        tile = 5;
      }
      rjplus = false;
      rjminus = false;
      direction = 0;
    }
    //to right 1
    else if(randomroad>=0.33 && randomroad<0.66&& rjminus == false && symbols[ri][rj+1].mark!=6)
    {
      rj++;
      if(direction == 0)
      {
        tile = 4;
      }
      if(direction == 1)
      {
        tile = 1;
      }
      rjplus = true;
      rjminus = false;
      direction = 1;
    }
    //to left
    else if(randomroad>=0.66 && randomroad<1.0 && rjplus == false && symbols[ri][rj-1].mark!=6)
    {
      rj--;
      if(direction == 0)
      {
        tile = 3;
      }
      if(direction == 2)
      {
        tile = 1;
      }
      rjplus = false;
      rjminus = true;
      direction = 2;
    }

    if(ri!=oldri || rj!= oldrj)
    {
      let bigi = -halfrange + oldri * 2.5;
      let bigj = -halfrange + oldrj * 2.5;
      let riverscalingVector = vec3.fromValues(1.0, 1.0, 1.0);
      let rivertranslationVector = vec3.fromValues(bigi, 0.0, bigj);
      if(tile == 0)
      {
        this.createobj(this.riverfrontmesh, this.branches.indices, this.branches.positions, this.branches.normals, riverscalingVector, rivertranslationVector, 0);      
      }
      else if(tile == 1)
      {
        this.createobj(this.riverfrontmesh, this.branches.indices, this.branches.positions, this.branches.normals, riverscalingVector, rivertranslationVector, 1/2 * Math.PI); 
      }
      else if(tile == 2)
      {
        this.createobj(this.riverleftmesh, this.branches.indices, this.branches.positions, this.branches.normals, riverscalingVector, rivertranslationVector, -1/2 * Math.PI); 
      }
      else if(tile == 3)
      {
        this.createobj(this.riverleftmesh, this.branches.indices, this.branches.positions, this.branches.normals, riverscalingVector, rivertranslationVector, 0); 
      }
      else if(tile == 4)
      {
        this.createobj(this.riverleftmesh, this.branches.indices, this.branches.positions, this.branches.normals, riverscalingVector, rivertranslationVector, 1/2 * Math.PI); 
      }
      else if(tile == 5)
      {
        this.createobj(this.riverleftmesh, this.branches.indices, this.branches.positions, this.branches.normals, riverscalingVector, rivertranslationVector, Math.PI); 
      }
      // else if(toleft)
      // {
      //   this.createobj(this.riverleftmesh, this.branches.indices, this.branches.positions, this.branches.normals, riverscalingVector, rivertranslationVector, riverrad); 
      // }
    }
    

    
    // let randomroad = Math.random();
    // if(randomroad<0.33 && symbols[ri+1][rj].mark!=6)
    // {
      
    //   let bigi = -halfrange + ri * 2.5;
    //   let bigj = -halfrange + rj * 2.5;
    //   let riverscalingVector = vec3.fromValues(1.0, 1.0, 1.0);
    //   let rivertranslationVector = vec3.fromValues(bigi, 0.0, bigj);

    //   ri++;
    //   rjplus = false;
    //   rjminus = false;


    //   this.createobj(this.riverfrontmesh, this.branches.indices, this.branches.positions, this.branches.normals, riverscalingVector, rivertranslationVector, riverrad);
    // }
    // else if(randomroad>=0.33 && randomroad<0.66 && rjminus == false && symbols[ri][rj+1].mark!=6)
    // {
    //   let bigi = -halfrange + ri * 2.5;
    //   let bigj = -halfrange + rj * 2.5;
    //   let riverscalingVector = vec3.fromValues(1.0, 1.0, 1.0);
    //   let rivertranslationVector = vec3.fromValues(bigi, 0.0, bigj);

    //   rj++;
    //   rjplus = true;
    //   rjminus = false;

    //   this.createobj(this.riverrightmesh, this.branches.indices, this.branches.positions, this.branches.normals, riverscalingVector, rivertranslationVector, riverrad);
    //   riverrad -= 1/2 * Math.PI;
    // }
    // else if(rjplus == false && symbols[ri][rj-1].mark!=6)
    // {
    //   let bigi = -halfrange + (ri) * 2.5;
    //   let bigj = -halfrange + (rj+1) * 2.5;
    //   let riverscalingVector = vec3.fromValues(1.0, 1.0, 1.0);
    //   let rivertranslationVector = vec3.fromValues(bigi, 0.0, bigj);

    //   rj--;
    //   rjplus = false;
    //   rjminus = true;  

    //   this.createobj(this.riverleftmesh, this.branches.indices, this.branches.positions, this.branches.normals, riverscalingVector, rivertranslationVector, riverrad);    
    //   riverrad += 1/2 * Math.PI;
    // }
  }

  //perlin noise
  var randonoffsetx = Math.random() * 50.0 - 25.0;//0.1;
  var randonoffsetz = Math.random() * 50.0 - 25.0;//-2.8;
  console.log("x" + randonoffsetx);
  console.log("z" + randonoffsetz);
  var mid1 = 0.5 + 2.0 / 3.0 + 0.05;
  var mid2 = 0.5 + 4.0 / 3.0 - 0.05;
  for(let i = 0; i < totalnumber; i++)
  {
    for(let j = 0; j < totalnumber; j++)
    {
      var randomnumber = 0.5 + 2.0 * this.fbm(vec2.fromValues((i/totalnumber + randonoffsetx) * scaleofnoise, 
                                                              (j/totalnumber + randonoffsetz) * scaleofnoise));
      //console.log("randomnumber" + randomnumber);
      if(randomnumber>=0.5 && randomnumber<mid1 && symbols[i][j].mark!=6)
      {
        let symbol = new Symbol(0, randomnumber);
        symbols[i][j] = symbol;
      }
      else if(randomnumber>=mid1 && randomnumber<mid2 && symbols[i][j].mark!=6)
      {
        let symbol = new Symbol(1, randomnumber);
        symbols[i][j] = symbol;
      }
      else if(randomnumber>=mid2 && randomnumber<0.5 + 2.0 && symbols[i][j].mark!=6)
      {
        let symbol = new Symbol(2, randomnumber);
        symbols[i][j] = symbol;
        if(i-1>=0 && j-1>=0 && symbols[i-1][j].mark!=-2 && symbols[i][j-1].mark!=-2 && symbols[i-1][j-1].mark!=-2
          && symbols[i-1][j].mark!=6 && symbols[i][j-1].mark!=6 && symbols[i-1][j-1].mark!=6)
        {
          symbols[i-1][j].mark = -2;
          symbols[i-1][j].randomness = randomnumber;
          symbols[i][j-1].mark = -2;
          symbols[i][j-1].randomness = randomnumber;
          symbols[i-1][j-1].mark = -2;
          symbols[i-1][j-1].randomness = randomnumber;
          symbols[i][j].mark = -2;
        }
      }
    }
  }


  //begin draw mesh
  for(let i = 0; -halfrange + i * 2.5 < halfrange; i++)
  {
    for(let j = 0; -halfrange + j * 2.5 < halfrange; j++)
    {

      //console.log("i "+i/totalnumber+ " j "+j/totalnumber);
      //add trees
      if(symbols[i][j].mark == 0)
      {
        for(let treeindex = symbols[i][j].randomness; treeindex <= mid1; treeindex += 0.05)
        {
          if(Math.random()<0.5)
          {
            let bigi = -halfrange + i * 2.5 + Math.random() * 1.5-0.5* 1.5;
            let bigj = -halfrange + j * 2.5 + Math.random() * 1.5-0.5* 1.5;
            let treescalingVector = vec3.fromValues(1.0, 1.0, 1.0);
            let treetranslationVector = vec3.fromValues(bigi, 0.0, bigj);
            this.createobj(this.branch2mesh, this.branches.indices, this.branches.positions, this.branches.normals, treescalingVector, treetranslationVector, Math.random() * 2 * Math.PI);
            this.createobj(this.leaves2mesh, this.leaves.indices, this.leaves.positions, this.leaves.normals, treescalingVector, treetranslationVector, Math.random() * 2 * Math.PI);
          }
          else
          {
            let bigi = -halfrange + i * 2.5 + Math.random() * 1.5-0.5* 1.5;
            let bigj = -halfrange + j * 2.5 + Math.random() * 1.5-0.5* 1.5;
            let treescalingVector = vec3.fromValues(1.0, 1.0, 1.0);
            let treetranslationVector = vec3.fromValues(bigi, 0.0, bigj);
            let treerandom = Math.random();
            this.createobj(this.branch1mesh, this.branches.indices, this.branches.positions, this.branches.normals, treescalingVector, treetranslationVector, treerandom * 2 * Math.PI);
            this.createobj(this.leaves1mesh, this.leaves.indices, this.leaves.positions, this.leaves.normals, treescalingVector, treetranslationVector, treerandom * 2 * Math.PI);
          }
        }
      }
      else if(symbols[i][j].mark == 1 || symbols[i][j].mark == 2 )
      {
        var bigi = -halfrange + i * 2.5 + Math.random()-0.5;
        var bigj = -halfrange + j * 2.5 + Math.random()-0.5;
        var boundx = 1.0;
        var boundy = symbols[i][j].randomness;
        var boundz = 1.0;
      
        var iteration = 2.0;
      
        var halfweight = (Math.random() * 0.25 + 0.5) * boundx; // X
        var halfheight = (Math.random() * 0.25 + 0.5) * boundy; // Y
        var halfdepth = (Math.random() * 0.25 + 0.5) * boundz;  // Z
      
        var randomness = 0.8;//for each surface, add another cube
      
        var root = new Section(halfweight, halfheight, halfdepth, bigi, 0, bigj);
        root.isroot = true;
        var moveup = halfheight;
      
        sections = [];
        sections.push(root);
      
        var scalingVector = vec3.fromValues(1.0, 1.0, 1.0);
        var translationVector = vec3.fromValues(0.0, 0.0, 0.0);
        this.createcubes(indices, positions, normals, 
          iteration, sections, allsections, moveup, randomness, 
          boundx, boundy, boundz, 
          bigi, bigj, 0.0);
      }
      else if(symbols[i][j].mark == -2)
      {
        symbols[i+1][j].mark = -10;
        symbols[i][j+1].mark = -10;
        symbols[i+1][j+1].mark = -10;

        //generate a random tree
        if(Math.random()<0.8)
        {
          if(Math.random()<0.5)
          {
            let bigi = -halfrange + (i+0.5) * 2.5 + 1.2 + Math.random() * 1.5-0.5*1.5;
            let bigj = -halfrange + (j+0.5) * 2.5 + 1.2 + Math.random() * 1.5-0.5*1.5;
            let treescalingVector = vec3.fromValues(1.0, 1.0, 1.0);
            let treetranslationVector = vec3.fromValues(bigi, 0.0, bigj);
            this.createobj(this.branch2mesh, this.branches.indices, this.branches.positions, this.branches.normals, treescalingVector, treetranslationVector, Math.random() * 2 * Math.PI);
            this.createobj(this.leaves2mesh, this.leaves.indices, this.leaves.positions, this.leaves.normals, treescalingVector, treetranslationVector, Math.random() * 2 * Math.PI);
          }
          else
          {
            let bigi = -halfrange + (i+0.5) * 2.5 + -1.2 + Math.random() * 1.5-0.5*1.5;
            let bigj = -halfrange + (j+0.5) * 2.5 + -1.2 + Math.random() * 1.5-0.5*1.5;
            let treescalingVector = vec3.fromValues(1.0, 1.0, 1.0);
            let treetranslationVector = vec3.fromValues(bigi, 0.0, bigj);
            let treerandom = Math.random();
            this.createobj(this.branch1mesh, this.branches.indices, this.branches.positions, this.branches.normals, treescalingVector, treetranslationVector, treerandom * 2 * Math.PI);
            this.createobj(this.leaves1mesh, this.leaves.indices, this.leaves.positions, this.leaves.normals, treescalingVector, treetranslationVector, treerandom * 2 * Math.PI);
          }
        }


        var bigi = -halfrange + (i+0.5) * 2.5;
        var bigj = -halfrange + (j+0.5) * 2.5;
        var boundx = 2.0;
        var boundy = symbols[i][j].randomness * 1.5;
        var boundz = 2.0;
      
        var iteration = 3.0;
      
        var halfweight = (Math.random() * 0.25 + 0.5) * boundx; // X
        var halfheight = (Math.random() * 0.25 + 0.5) * boundy; // Y
        var halfdepth = (Math.random() * 0.25 + 0.5) * boundz;  // Z
      
        var randomness = 0.8;//for each surface, add another cube
      
        var root = new Section(halfweight, halfheight, halfdepth, bigi, 0, bigj);
        root.isroot = true;
        var moveup = halfheight;
      
        sections = [];
        sections.push(root);
      
        var scalingVector = vec3.fromValues(1.0, 1.0, 1.0);
        var translationVector = vec3.fromValues(0.0, 0.0, 0.0);
        this.createcubes(indices, positions, normals, 
          iteration, sections, allsections, moveup, randomness, 
          boundx, boundy, boundz, 
          bigi, bigj, 0.0);
      }
    }

  }

  //  var scalingVector = vec3.fromValues(1.0, 1.0, 1.0);
  // var translationVector = vec3.fromValues(0.0, 1.0, 0.0);
  // this.createeave(indices, positions, normals, scalingVector, translationVector, 0);
  
  // var step = 4.0
  // var ring = 50.0;

  // for(let index = 1.0; index < step * ring; index+=step)
  // {
  //   var radius = (index-1) * 0.5;
  //   for(let k = 0.0; k<=1.0; k+=1.0/index)
  //   {
  //     var rad = k * 2 * Math.PI;
  //     var change = Math.max(5.0 - (index - 1.0)/(4.0 * ring / 4.0), 1.0);
  //     var i = radius * Math.cos(rad) * 1.5;
  //     var j = radius * Math.sin(rad) * 1.5;
  //     var boundx = change;
  //     var boundy = change;
  //     var boundz = change;
    
  //     var iteration = 2.0;
    
  //     var halfweight = (Math.random() * 0.25 + 0.5) * boundx; // X
  //     var halfheight = (Math.random() * 0.25 + 0.5) * boundy; // Y
  //     var halfdepth = (Math.random() * 0.25 + 0.5) * boundz;  // Z
    
  //     var randomness = 0.8;
  
  //     var bigi = i + Math.random()-0.5;
  //     var bigj = j + Math.random()-0.5;
  //     var bigk = Math.max(0, (step * ring * 0.5 - radius) * (change - 1.0) * 0.3 + Math.random()-0.5);
    
  //     var root = new Section(halfweight, halfheight, halfdepth, bigi, bigk, bigj);
  //     var moveup = halfheight;
    
  //     sections = [];
  //     sections.push(root);
    
  //     var scalingVector = vec3.fromValues(1.0, 1.0, 1.0);
  //     var translationVector = vec3.fromValues(0.0, 0.0, 0.0);
  //     this.createcubes(indices, positions, normals, iteration, sections, allsections, moveup, randomness, boundx, boundy, boundz, bigi, bigj, -rad);
  //   }
  // }

  // var scalingVector = vec3.fromValues(1.0, 1.0, 1.0);
  // var translationVector = vec3.fromValues(1.0, 1.0, 1.0);
  // var scalingVector2 = vec3.fromValues(0.5, 0.5, 0.5);

  // this.createtriangularprism(indices, positions, normals, scalingVector, translationVector, 1);
  // this.createtriangularroof(indices, positions, normals, scalingVector, translationVector, scalingVector2, 1);

  this.indices = new Uint32Array(indices);
  this.positions = new Float32Array(positions);
  this.normals = new Float32Array(normals);
    
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

    console.log(`Created cube`);
  }
};

export default Cube;
