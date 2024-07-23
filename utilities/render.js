"use strict";
import { Shader } from "./shader.js";
import { mat4, glMatrix} from "../utilities/node_modules/gl-matrix/esm/index.js";
import { initBuffers } from "./setup.js";
import { deltaTime } from "../utilities/time.js";
import { Camera, CameraMovement } from "../utilities/camera.js"; 

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

export async function render(gl)
{   
    const shader_program = new Shader(gl, "../assets/shaders/vector_shader.glsl", "../assets/shaders/fragment_shader.glsl");
    await shader_program.genProgram();

    const array_buffers = initBuffers(gl, shader_program, vertices, indicies);

    const camera = new Camera();

    let delta_time = new deltaTime();
    var angle = 90.0;

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
        if(keys[' '] && keys["CONTROL"])
        {
            camera.processInput(CameraMovement.DOWN, delta_time.getTime());
        }

        angle += 55 * delta_time.getTime();
        drawScene(gl, shader_program, array_buffers, camera, angle);

        requestAnimationFrame(gameScene);
    }

    gameScene();
}

export function drawScene(gl, program, buffers, camera, angle)
{
    
    let model = mat4.create();
    let view = camera.getViewMatrix();
    let projection = mat4.create();

    mat4.rotate(model, model, glMatrix.toRadian(angle), [0, 1, 0]);
    mat4.perspective(projection, glMatrix.toRadian(55), gl.canvas.width/gl.canvas.height, 0.1, 100.0);

    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT || gl.DEPTH_BUFFER_BIT);

    program.useProgram();

    program.setMat4("model", model);
    program.setMat4("view", view);
    program.setMat4("projection", projection);

    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
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