"use strict";
import { vec3, glMatrix} from "../utilities/node_modules/gl-matrix/esm/index.js";
import { deltaTime } from "../utilities/time.js";
import { Camera, CameraMovement } from "../utilities/camera.js"; 
import { Snake } from "../utilities/snake.js";

export async function render(gl)
{   
    const snake = new Snake(gl, 16, [0.0, 1.0, 0.0], 16, 4);
    await snake.initSnake();

    const camera = new Camera([0, 0, 6]);
    let delta_time = new deltaTime();

    const keys = handleKeyboardInputs();    
    
    function gameScene()
    {
        delta_time.startTime();

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

        snake.cube.angle += glMatrix.toRadian(55) * delta_time.getTime();

        drawScene(gl, snake.cube.program, snake.cube.buffers, camera, snake);

        requestAnimationFrame(gameScene);
    }

    gameScene();
}

export function drawScene(gl, program, buffers, camera, snake)
{
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT || gl.DEPTH_BUFFER_BIT);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.vertex_buffer);

    program.useProgram();

    for(let i = 0; i < snake.position.length; i++)
    {
        snake.cube.identifyModel();
        snake.cube.scale([1.6, 1.6, 1.6]);
        snake.cube.translate(snake.position[i]);

        program.setMat4("model", snake.cube.model);
        program.setMat4("view", camera.getViewMatrix());
        program.setMat4("projection", camera.getProjectionMatrix(gl));

        gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
    }
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