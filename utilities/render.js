"use strict";
import { mat4, glMatrix} from "./node_modules/gl-matrix/esm/index.js";
import { deltaTime } from "./time.js";
import { Camera, CameraMovement } from "./camera.js"; 
import { Snake } from "./snake.js";
import { Grid } from "./grid.js";

export class Render
{
    constructor(gl)
    {
        this.gl = gl;
        this.camera = new Camera([0.0, 0.0, 100.0]);
        this.delta_time = new deltaTime();
        this.snake = new Snake(this.gl, 16, [0.0, 1.0, 0.0], 16, 4);
        this.grid = new Grid(gl, 25, 25, 16);
        this.keys = this.KeyboardInputs();

        this.gameState = this.gameState.bind(this);
        this.gameScene = this.gameScene.bind(this);
    }

    async initRender()
    {
        await this.snake.initSnake("../assets/shaders/vertex_shader.glsl", "../assets/shaders/cube_fragment.glsl");
        await this.grid.initGrid("../assets/shaders/vertex_shader.glsl", "../assets/shaders/grid_fragment.glsl");
    }

    KeyboardInputs()
    {
        const keys = {};

        window.addEventListener("keydown", (event) =>
        {
            keys[event.key.toUpperCase()] = true;
        });


        window.addEventListener("keyup", (event) =>
        {
            keys[event.key.toUpperCase()] = false;
        });

        return keys;
    }

    gameState()
    {
        this.delta_time.startTime();
        this.snake.angle += glMatrix.toRadian(55) * this.delta_time.getTime();

        if(this.keys['W'])
        {
            this.camera.processInput(CameraMovement.FORWARD, this.delta_time.getTime());
        }
        if(this.keys['S'])
        {
            this.camera.processInput(CameraMovement.BACKWARD, this.delta_time.getTime());
        }
        if(this.keys['D'])
        {
            this.camera.processInput(CameraMovement.RIGHT, this.delta_time.getTime());
        }
        if(this.keys['A'])
        {
            this.camera.processInput(CameraMovement.LEFT, this.delta_time.getTime());
        }
        if(this.keys[' '])
        {
            this.camera.processInput(CameraMovement.UP, this.delta_time.getTime());
        }
        if(this.keys["CONTROL"])
        {
            this.camera.processInput(CameraMovement.DOWN, this.delta_time.getTime());
        }

        requestAnimationFrame(this.gameState);

    }

    gameScene()
    {
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT || this.gl.DEPTH_BUFFER_BIT);

        this.snake.draw(this.camera.getViewMatrix(), this.camera.getProjectionMatrix(this.gl));
        this.grid.draw(this.camera.getViewMatrix(), this.camera.getProjectionMatrix(this.gl));

        requestAnimationFrame(this.gameScene);
    }
}