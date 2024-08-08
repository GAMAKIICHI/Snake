"use strict";
import { mat4, glMatrix} from "./node_modules/gl-matrix/esm/index.js";
import { deltaTime } from "./time.js";
import { Camera, CameraMovement } from "./camera.js"; 
import { Snake, SnakeMovement } from "./snake.js";
import { Grid } from "./grid.js";

export class Render
{
    constructor(gl)
    {
        this.gl = gl;
        this.camera = new Camera([0.0, 0.0, 100.0]);
        this.delta_time = new deltaTime();
        this.snake = new Snake(this.gl, 16, [0.0, 1.0, 0.0], 5, 4);
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
        this.snake.angle += glMatrix.toRadian(55) * this.delta_time.time;

        //Snake Movement
        if(this.keys["ARROWUP"])
        {
            this.snake.changeDirection(SnakeMovement.FORWARD);
        }
        else if(this.keys["ARROWDOWN"])
        {
            this.snake.changeDirection(SnakeMovement.BACKWARD);
        }
        else if(this.keys["ARROWRIGHT"])
        {
            this.snake.changeDirection(SnakeMovement.RIGHT);
        }
        else if(this.keys["ARROWLEFT"])
        {
            this.snake.changeDirection(SnakeMovement.LEFT);
        }

        this.snake.move(this.delta_time.time);

        requestAnimationFrame(this.gameState);

    }

    gameScene()
    {
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT || this.gl.DEPTH_BUFFER_BIT);

        this.snake.draw(this.camera.getViewMatrix(), this.camera.getProjectionMatrix(this.gl));
        this.grid.draw(this.camera.getViewMatrix(), this.camera.getProjectionMatrix(this.gl), this.camera.fov, this.camera.cameraPos);

        requestAnimationFrame(this.gameScene);
    }
}