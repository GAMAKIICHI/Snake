"use strict";
import { glMatrix} from "./node_modules/gl-matrix/esm/index.js";
import { deltaTime } from "./time.js";
import { Camera } from "./camera.js"; 
import { Snake, SnakeMovement } from "./snake.js";
import { Grid } from "./grid.js";
import { Food } from "./food.js";

export class Render
{
    constructor(gl)
    {
        this.gl = gl;
        //camera z index must be odd or grid will squares will render uneven
        this.camera = new Camera([0.0, 0.0, 15]);
        this.delta_time = new deltaTime();

        this.snake = new Snake(this.gl, 16, [0.0, 1.0, 0.0], 5, 4);
        this.grid = new Grid(gl, 15, 15);
        this.food = new Food(gl);
        this.keys = KeyboardInputs();

        this.gameState = this.gameState.bind(this);
        this.gameScene = this.gameScene.bind(this);

    }

    async initRender()
    {
        await this.snake.initSnake("../assets/shaders/vertex_shader.glsl", "../assets/shaders/cube_fragment.glsl");
        await this.grid.initGrid("../assets/shaders/vertex_shader.glsl", "../assets/shaders/grid_fragment.glsl");
        await this.food.initFood("../assets/shaders/vertex_shader.glsl", "../assets/shaders/cube_fragment.glsl", this.camera.cameraPos[2]);
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
        this.food.draw(this.camera.getViewMatrix(), this.camera.getProjectionMatrix(this.gl));
        this.grid.draw(this.camera.getViewMatrix(), this.camera.getProjectionMatrix(this.gl), this.camera);

        requestAnimationFrame(this.gameScene);
    }
}

function KeyboardInputs()
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

function isCollision(position1, position2)
{
    if(position1.length != position2.length)
    {
        return false;
    }

    for(var i = 0; i < position1.length; i++)
    {
        if(position1[i] != position2[i])
        {
            return false;
        }
    }

    return true;
}