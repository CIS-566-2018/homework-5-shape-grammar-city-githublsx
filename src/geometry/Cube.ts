import {vec3, vec4, mat4} from 'gl-matrix';
import Drawable from '../rendering/gl/Drawable';
import {gl} from '../globals';

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

  constructor(center: vec3) {
    super(); // Call the constructor of the super class. This is required.
    this.center = vec4.fromValues(center[0], center[1], center[2], 1);
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

  createtriangularprism(indices: number[], positions: number[], normals: number[], scalingVector: vec3, translationVector: vec3)
  {
    var translationMatrix = mat4.create();
    mat4.fromTranslation(translationMatrix, translationVector);
    var rotationMatrix = mat4.create();
    var randomint = this.getRandomInt(0, 2);
    mat4.fromYRotation(rotationMatrix, randomint * Math.PI * 0.5);
    var scaleMatrix = mat4.create();
    if(randomint==1)
    {
      let temp = scalingVector[0];
      scalingVector[0] = scalingVector[2];
      scalingVector[2] = temp;
    }
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

  createtriangularroof(indices: number[], positions: number[], normals: number[], scalingVector: vec3, translationVector: vec3, scalingVector2: vec3)
  {
    var translationMatrix = mat4.create();
    mat4.fromTranslation(translationMatrix, translationVector);
    var rotationMatrix = mat4.create();
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

  createcube(indices: number[], positions: number[], normals: number[], scalingVector: vec3, translationVector: vec3)
  {
    var translationMatrix = mat4.create();
    mat4.fromTranslation(translationMatrix, translationVector);
    var rotationMatrix = mat4.create();
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
    bigi: number, bigj: number)
  {
    for(let i = 0; i < iteration; i++)
    {
      var sectionssize = sections.length;
      for(let j = 0; j < sectionssize; j++)
      {
        var tempsection = sections.shift();
        var scalingVector = vec3.fromValues(tempsection.halfweight, tempsection.halfheight, tempsection.halfdepth);
        var translationVector = vec3.fromValues(tempsection.translateweight, tempsection.translateheight + moveup, tempsection.translatedepth);
        this.createcube(indices, positions, normals, scalingVector, translationVector);
        scalingVector[1] *= Math.random() * 0.25 + 0.25;
        translationVector[1] += tempsection.halfheight + scalingVector[1];
        this.createtriangularprism(indices, positions, normals, scalingVector, translationVector);
        if(Math.random()>randomness && tempsection.right)
        {
          let temphalfdepth = Math.random() * 0.5 * tempsection.halfdepth + 0.25 * tempsection.halfdepth;
          let temphalfheight = Math.random() * 0.5 * tempsection.halfheight + 0.25 * tempsection.halfheight;
          let temphalfweight = Math.random() * 0.5 * tempsection.halfweight + 0.25 * tempsection.halfweight;
          temphalfweight = Math.min(boundx + bigi - (tempsection.translateweight + tempsection.halfweight), temphalfweight);
          let rangedtrans = tempsection.halfdepth - temphalfdepth;
          let rangehtrans = tempsection.halfheight - temphalfheight;
          let dtrans = Math.random() * rangedtrans * 2.0 - rangedtrans;
          let htrans = Math.random() * rangehtrans * 2.0 - rangehtrans;
          let temprightsection = new Section(temphalfweight, temphalfheight, temphalfdepth, 
                                             tempsection.translateweight + tempsection.halfweight, tempsection.translateheight + htrans, tempsection.translatedepth + dtrans);
          if(temphalfweight==boundx - (tempsection.translateweight + tempsection.halfweight))
          {
            temprightsection.right = false;
          }
          temprightsection.left = false;
          sections.push(temprightsection);
          tempsection.right = false;
        }
  
        if(Math.random()>randomness && tempsection.left)
        {
          let temphalfdepth = Math.random() * 0.5 * tempsection.halfdepth + 0.25 * tempsection.halfdepth;
          let temphalfheight = Math.random() * 0.5 * tempsection.halfheight + 0.25 * tempsection.halfheight;
          let temphalfweight = Math.random() * 0.5 * tempsection.halfweight + 0.25 * tempsection.halfweight;
          temphalfweight = Math.min(boundx + bigi - (tempsection.translateweight + tempsection.halfweight), temphalfweight);
          let rangedtrans = tempsection.halfdepth - temphalfdepth;
          let rangehtrans = tempsection.halfheight - temphalfheight;
          let dtrans = Math.random() * rangedtrans * 2.0 - rangedtrans;
          let htrans = Math.random() * rangehtrans * 2.0 - rangehtrans;
          let temprightsection = new Section(temphalfweight, temphalfheight, temphalfdepth, 
                                             tempsection.translateweight - tempsection.halfweight, tempsection.translateheight + htrans, tempsection.translatedepth + dtrans);
          if(temphalfweight==boundx - (tempsection.translateweight + tempsection.halfweight))
          {
            temprightsection.left = false;
          }
          temprightsection.right = false;
          sections.push(temprightsection);
          tempsection.left = false;
        }
  
        if(Math.random()>randomness && tempsection.front)
        {
          let temphalfdepth = Math.random() * 0.5 * tempsection.halfdepth + 0.25 * tempsection.halfdepth;
          let temphalfheight = Math.random() * 0.5 * tempsection.halfheight + 0.25 * tempsection.halfheight;
          let temphalfweight = Math.random() * 0.5 * tempsection.halfweight + 0.25 * tempsection.halfweight;
          temphalfdepth = Math.min(boundz + bigj - (tempsection.translatedepth + tempsection.halfdepth), temphalfdepth);
          let rangewtrans = tempsection.halfweight - temphalfweight;
          let rangehtrans = tempsection.halfheight - temphalfheight;
          let wtrans = Math.random() * rangewtrans * 2.0 - rangewtrans;
          let htrans = Math.random() * rangehtrans * 2.0 - rangehtrans;
          let temprightsection = new Section(temphalfweight, temphalfheight, temphalfdepth, 
                                             tempsection.translateweight + wtrans, tempsection.translateheight + htrans, tempsection.translatedepth + tempsection.halfdepth);
          if(temphalfdepth==boundz - (tempsection.translatedepth + tempsection.halfdepth))
          {
            temprightsection.front = false;
          }
          temprightsection.back = false;
          sections.push(temprightsection);
          tempsection.front = false;
        }
  
        if(Math.random()>randomness && tempsection.back)
        {
          let temphalfdepth = Math.random() * 0.5 * tempsection.halfdepth + 0.25 * tempsection.halfdepth;
          let temphalfheight = Math.random() * 0.5 * tempsection.halfheight + 0.25 * tempsection.halfheight;
          let temphalfweight = Math.random() * 0.5 * tempsection.halfweight + 0.25 * tempsection.halfweight;
          temphalfdepth = Math.min(boundz + bigj - (tempsection.translatedepth + tempsection.halfdepth), temphalfdepth);
          let rangewtrans = tempsection.halfweight - temphalfweight;
          let rangehtrans = tempsection.halfheight - temphalfheight;
          let wtrans = Math.random() * rangewtrans * 2.0 - rangewtrans;
          let htrans = Math.random() * rangehtrans * 2.0 - rangehtrans;
          let temprightsection = new Section(temphalfweight, temphalfheight, temphalfdepth, 
                                             tempsection.translateweight + wtrans, tempsection.translateheight + htrans, tempsection.translatedepth - tempsection.halfdepth);
          if(temphalfdepth==boundz - (tempsection.translatedepth + tempsection.halfdepth))
          {
            temprightsection.back = false;
          }
          temprightsection.front = false;
          sections.push(temprightsection);
          tempsection.back = false;
        }
  
        if(Math.random()>randomness && tempsection.up)
        {
          let temphalfdepth = Math.random() * 0.5 * tempsection.halfdepth + 0.25 * tempsection.halfdepth;
          let temphalfheight = Math.random() * 0.5 * tempsection.halfheight + 0.25 * tempsection.halfheight;
          let temphalfweight = Math.random() * 0.5 * tempsection.halfweight + 0.25 * tempsection.halfweight;
          let rangewtrans = tempsection.halfweight - temphalfweight;
          let rangedtrans = tempsection.halfdepth - temphalfdepth;
          let wtrans = Math.random() * rangewtrans * 2.0 - rangewtrans;
          let dtrans = Math.random() * rangedtrans * 2.0 - rangedtrans;
          let temprightsection = new Section(temphalfweight, temphalfheight, temphalfdepth, 
                                             tempsection.translateweight + wtrans, tempsection.translateheight + tempsection.halfheight, tempsection.translatedepth + dtrans);
          sections.push(temprightsection);
          tempsection.up = false;
        }
  
        allsections.push(tempsection);
      }
    }
  }

  create() {

  //http://in2gpu.com/2015/07/09/drawing-cube-with-indices/

  var indices = new Array<number>();
  var positions = new Array<number>();
  var normals = new Array<number>();

  var sections = new Array<Section>();
  var allsections = new Array<Section>();

  var halfrange = 50;

  for(let i = -halfrange; i < halfrange; i+=2)
  {
    for(let j = -halfrange; j < halfrange; j+=2)
    {
      var boundx = 1.0;
      var boundy = 1.0;
      var boundz = 1.0;
    
      var iteration = 2.0;
    
      var halfweight = (Math.random() * 0.25 + 0.5) * boundx; // X
      var halfheight = (Math.random() * 0.25 + 0.5) * boundy; // Y
      var halfdepth = (Math.random() * 0.25 + 0.5) * boundz;  // Z
    
      var randomness = 0.2;
    
      var root = new Section(halfweight, halfheight, halfdepth, i, 0, j);
      var moveup = halfheight;
    
      sections = [];
      sections.push(root);
    
      var scalingVector = vec3.fromValues(1.0, 1.0, 1.0);
      var translationVector = vec3.fromValues(0.0, 0.0, 0.0);
      this.createcubes(indices, positions, normals, iteration, sections, allsections, moveup, randomness, boundx, boundy, boundz, i, j);
    }
  }

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
