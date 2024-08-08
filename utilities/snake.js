"use strict";
import { Shape } from "./shape.js";
import { vec3 } from "./node_modules/gl-matrix/esm/index.js";

export const SnakeMovement = Object.freeze({
    FORWARD:    0,
    BACKWARD:   1,
    LEFT:       2,
    RIGHT:      3,
});

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

        this.size = size;
        this.color = color;
        this.speed = speed;
        this.health = health;
        this.position = [];
        this.direction = SnakeMovement.FORWARD;
        this.interval = 1 / this.speed; //time between moves
        this.accumulator = 0; //time passed between each move
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

    changeDirection(direction)
    {
        this.direction = direction;
    }

    move(deltaTime)
    {

        this.accumulator += deltaTime;

        if(this.accumulator >= this.interval)
        {
            this.accumulator -= this.interval; //reset accumulator back to 0

            if(this.direction === SnakeMovement.FORWARD)
            {
                this.position[0][1] += 1; //moves one grid square per interval
            }
            else if(this.direction === SnakeMovement.BACKWARD)
            {
                this.position[0][1] -= 1;
            }
            else if(this.direction === SnakeMovement.RIGHT)
            {
                this.position[0][0] += 1;
            }
            else if(this.direction === SnakeMovement.LEFT)
            {
                this.position[0][0] -= 1;
            }
        }
    }

    draw(view, projection)
    {
        const screenWidth = Math.floor((this.gl.canvas.width / 8)) * 0.1;
        const screenHeight = Math.floor((this.gl.canvas.height / 8)) * 0.1;

        for(let i = 0; i < this.position.length; i++)
        {   
            this.useProgram();
            this.gl.bindVertexArray(this.VAO);

            this.identifyModel();
            this.scale([screenWidth, screenHeight, this.size]);
            this.translate(this.position[i]);

            this.setMat4("model", this.model);
            this.setMat4("view", view);
            this.setMat4("projection", projection);
    
            this.drawShape();
        }
    }

}