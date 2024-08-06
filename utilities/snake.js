"use strict";
import { Shape } from "./shape.js";
import { vec3 } from "./node_modules/gl-matrix/esm/index.js";

const cube_vertices = 
[
    //front square
    //positions      
    -0.5,  0.5,  0.5,
     0.5, -0.5,  0.5,
     0.5,  0.5,  0.5,
    -0.5, -0.5,  0.5,

    //back square
    //positions      
    -0.5,  0.5, -0.5,
     0.5, -0.5, -0.5,
     0.5,  0.5, -0.5,
    -0.5, -0.5, -0.5,

    //top square
    //positions     
    -0.5, 0.5,  0.5,
     0.5, 0.5,  0.5,
     0.5, 0.5, -0.5,
    -0.5, 0.5, -0.5,

    //bottom square
    //positions      
    -0.5, -0.5,  0.5,
     0.5, -0.5,  0.5,
     0.5, -0.5, -0.5,
    -0.5, -0.5, -0.5,

    //right square
    //positions      
     0.5,  0.5,  0.5,
     0.5, -0.5,  0.5,
     0.5,  0.5, -0.5,
     0.5, -0.5, -0.5,

    //left square
    //positions      
    -0.5,  0.5,  0.5,
    -0.5, -0.5,  0.5,
    -0.5,  0.5, -0.5,
    -0.5, -0.5, -0.5,

];

const cube_indicies = 
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

    // //right square
    16, 17, 19,
    16, 18, 19,

    //left square
    20, 21, 23,
    20, 22, 23

];

export class Snake extends Shape
{
    constructor(gl, size, color, speed, health)
    {
        super(gl);

        this.size = size * 0.1;
        this.color = color;
        this.speed = speed;
        this.health = health;
        this.position;
    }

    async initSnake(vertexPath, fragmentPath)
    {
        this.position  = [vec3.create()];
        await this.initShape(vertexPath, fragmentPath, cube_vertices, cube_indicies);
    }

    grow(newPosition)
    {
        let lastPosition = this.position.length;
        this.position[lastPosition] = newPosition;
    }

    draw(view, projection)
    {
        for(let i = 0; i < this.position.length; i++)
        {   
            this.useProgram();
            this.gl.bindVertexArray(this.VAO);

            this.identifyModel();
            this.scale([this.size, this.size, this.size]);
            this.translate(this.position[i]);

            this.setMat4("model", this.model);
            this.setMat4("view", view);
            this.setMat4("projection", projection);
    
            this.drawShape();
        }
    }

}