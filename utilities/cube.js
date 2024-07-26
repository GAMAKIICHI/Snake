"use strict";
import { initBuffers } from "./setup.js";
import { Shader } from "./shader.js";
import { mat4, glMatrix } from "../utilities/node_modules/gl-matrix/esm/index.js";

const vertices = 
[
    //front square
    //positions         //colors
    -0.5,  0.5, 0.5,    1.0, 1.0, 1.0,
     0.5, -0.5, 0.5,    1.0, 0.0, 0.0,
     0.5,  0.5, 0.5,    0.0, 1.0, 0.0,
    -0.5, -0.5, 0.5,    0.0, 0.0, 1.0,

    //back square
    //positions         //colors
    -0.5,  0.5, -0.5,   1.0, 1.0, 1.0,
     0.5, -0.5, -0.5,   1.0, 0.0, 0.0,
     0.5,  0.5, -0.5,   0.0, 1.0, 0.0,
    -0.5, -0.5, -0.5,   0.0, 0.0, 1.0,

    //top square
    //positions         //colors
    -0.5, 0.5,  0.5,    1.0, 1.0, 1.0,
     0.5, 0.5,  0.5,    1.0, 0.0, 0.0,
     0.5, 0.5, -0.5,    0.0, 1.0, 0.0,
    -0.5, 0.5, -0.5,    0.0, 0.0, 1.0,

    //bottom square
    //positions         //colors
    -0.5, -0.5,  0.5,   1.0, 1.0, 1.0,
     0.5, -0.5,  0.5,   1.0, 0.0, 0.0,
     0.5, -0.5, -0.5,   0.0, 1.0, 0.0,
    -0.5, -0.5, -0.5,   0.0, 0.0, 1.0,

    //right square
    //positions         //colors
     0.5,  0.5,  0.5,    1.0, 1.0, 1.0,
     0.5, -0.5,  0.5,    1.0, 0.0, 0.0,
     0.5,  0.5, -0.5,    0.0, 1.0, 0.0, 
     0.5, -0.5, -0.5,    0.0, 0.0, 1.0,

    //left square
    //positions         //colors
    -0.5,  0.5,  0.5,   1.0, 1.0, 1.0,
    -0.5, -0.5,  0.5,   1.0, 0.0, 0.0,
    -0.5,  0.5, -0.5,   0.0, 1.0, 0.0,
    -0.5, -0.5, -0.5,   0.0, 0.0, 1.0,

];

const indicies = 
[
    //front square
    0, 1, 2,
    0, 1, 3,

    //back square
    4, 5, 6,
    4, 5, 7,

    //top square
    8, 9, 10,
    8, 10, 11,

    //bottom square
    12, 13, 14,
    12, 14, 15,

    //right square
    16, 17, 19,
    16, 18, 19,

    //left square
    20, 21, 23,
    20, 22, 23

];

export class Cube
{
    constructor(gl, vertexPath, fragmentPath)
    {
        this.gl = gl;
        this.vertexPath = vertexPath;
        this.fragmentPath = fragmentPath;

        this.program;
        this.buffers;
        this.model;
        this.angle;
    }

    async initCube()
    {   
        this.program = new Shader(this.gl, this.vertexPath, this.fragmentPath);
        await this.program.genProgram();

        this.buffers = initBuffers(this.gl, this.program, vertices, indicies);
        this.angle = 0.0;
    }

    identifyModel()
    {
        this.model = mat4.create();
    }

    translate(position)
    {
        mat4.translate(this.model, this.model, position);
    }

    rotate(axis)
    {
        mat4.rotate(this.model, this.model, this.angle, axis);
    }

    scale(scalar)
    {
        mat4.scale(this.model, this.model, scalar);
    }

}