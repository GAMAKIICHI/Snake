"use strict";
import { Cube } from "../utilities/cube.js";
import { mat4, vec3 } from "../utilities/node_modules/gl-matrix/esm/index.js";

export class Snake
{
    constructor(gl, size, color, speed, health)
    {
        this.gl = gl;
        this.size = size;
        this.color = color;
        this.speed = speed;
        this.health = health;
        this.position;

        this.cube = new Cube(this.gl, "../assets/shaders/vector_shader.glsl", "../assets/shaders/fragment_shader.glsl");
    }

    async initSnake()
    {
        this.position  = [vec3.create()];
        await this.cube.initCube();
    }

    grow(newPosition)
    {
        let lastPosition = this.position.length;
        console.log(this.position);
        this.position[lastPosition] = newPosition;
        console.log(this.position);
    }

}