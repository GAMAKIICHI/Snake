"use strict";
import { mat4, glMatrix} from "./node_modules/gl-matrix/esm/index.js";
import { deltaTime } from "./time.js";
import { Camera, CameraMovement } from "./camera.js"; 
import { Snake } from "./snake.js";
import { Grid } from "./grid.js";

export async function render(gl)
{   
    const camera = new Camera([0.5, 0, 5]);
    let delta_time = new deltaTime();
    
    const snake = new Snake(gl, 16, [0.0, 1.0, 0.0], 16, 4);
    await snake.initSnake("../assets/shaders/vertex_shader.glsl", "../assets/shaders/cube_fragment.glsl");

    const grid = new Grid(gl, 8, 8, 16);
    await grid.initGrid("../assets/shaders/vertex_shader.glsl", "../assets/shaders/grid_fragment.glsl");

    const keys = handleKeyboardInputs();    

    function gameScene()
    {
        delta_time.startTime();
        snake.angle += glMatrix.toRadian(55) * delta_time.getTime();


        if(keys['W'])
        {
            camera.processInput(CameraMovement.FORWARD, delta_time.getTime());
        }
        if(keys['S'])
        {
            camera.processInput(CameraMovement.BACKWARD, delta_time.getTime());
        }
        if(keys['D'])
        {
            camera.processInput(CameraMovement.RIGHT, delta_time.getTime());
        }
        if(keys['A'])
        {
            camera.processInput(CameraMovement.LEFT, delta_time.getTime());
        }
        if(keys[' '])
        {
            camera.processInput(CameraMovement.UP, delta_time.getTime());
        }
        if(keys["CONTROL"])
        {
            camera.processInput(CameraMovement.DOWN, delta_time.getTime());
        }

        drawScene(gl, snake, grid, camera);

        requestAnimationFrame(gameScene);
    }

    gameScene();
}

function drawScene(gl, snake, grid, camera)
{
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT || gl.DEPTH_BUFFER_BIT);

    snake.draw(camera.getViewMatrix(), camera.getProjectionMatrix(gl));

    grid.draw(camera.getViewMatrix(), camera.getProjectionMatrix(gl));
}

function handleKeyboardInputs()
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