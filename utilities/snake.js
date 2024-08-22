"use strict";
import { Shape } from "./shape.js";
import { vec3 } from "./node_modules/gl-matrix/esm/index.js";

export const SnakeMovement = Object.freeze({
    FORWARD:    0,
    BACKWARD:   1,
    LEFT:       2,
    RIGHT:      3,
});

export class Snake extends Shape
{
    constructor(gl, size, speed)
    {
        super(gl);

        this.size = size;
        this.speed = speed;
        this.score = 0;
        this.position = [];
        this.direction = SnakeMovement.FORWARD;
        this.interval = 1 / this.speed; //time between moves
        this.accumulator = 0; //time passed between each move
    }

    async initSnake(vertexPath, fragmentPath, color = [0, 0, 255, 255], texUrl = "")
    {
        this.position  = [vec3.create()];
        await this.initShape(vertexPath, fragmentPath, color, texUrl);
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

            this.updateTail();

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

    grow()
    {
        this.position[this.position.length] = vec3.set(vec3.create(), 100, 100, 0);
    }

    updateTail()
    {
        if(this.position.length === 1)
            return false;

        for(let i = this.position.length - 1; i > 0; i--)
        {
            // Copy the position of the segment ahead of it
            vec3.copy(this.position[i], this.position[i - 1]);
        }
    }

    draw(view, projection)
    {
        for(let i = 0; i < this.position.length; i++)
        {   
            this.useProgram();
            this.gl.bindVertexArray(this.VAO);

            this.identifyModel();
            this.translate(this.position[i]);

            this.setMat4("model", this.model);
            this.setMat4("view", view);
            this.setMat4("projection", projection);
    
            this.drawShape(6);
        }
    }

    reset()
    {
        this.position = [vec3.create()];
        this.score = 0;
        this.accumulator = 0;
        this.direction = SnakeMovement.FORWARD;
    }
}