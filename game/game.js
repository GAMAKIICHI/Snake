"use strict";

import { Shader_t } from "../utilities/shaderUtil.js";
import { Camera_t, CameraMovement_t } from "../utilities/cameraUtil.js";
import { mat4, vec3} from "../utilities/node_modules/gl-matrix/esm/index.js";

main();

let delta_time = 0.0;
let last_frame = 0.0;

let camera = new Camera_t();

async function main()
{

    let game_scene = document.getElementById("game-scene");

    /*makes sure webgl is initalized*/
    const gl = game_scene.getContext("webgl2");

    if(gl === null)
    {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }

    gl.viewport(0, 0, game_scene.width, game_scene.height);

    let shader_program = new Shader_t(gl, "../assets/shaders/vector_shader.glsl", "../assets/shaders/fragment_shader.glsl");
    await shader_program.genProgram();

    const vertices = 
    [
        -0.5,  0.5, 0.0, // top left corner
         0.5, -0.5, 0.0, // bottom right corner
         0.5,  0.5, 0.0, // top right corner
        -0.5, -0.5, 0.0, // bottom left corner

    ];

    const indicies = 
    [
        0, 1, 2,
        0, 1, 3

    ];

    const VAO = gl.createVertexArray();
    gl.bindVertexArray(VAO);

    const VBO = gl.createBuffer();
    const EBO = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, EBO);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indicies), gl.STATIC_DRAW);

    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    function deltaTime()
    {
        let current_frame = performance.now();
        delta_time = current_frame - last_frame;
        last_frame = current_frame;

        requestAnimationFrame(deltaTime);
    }

    deltaTime();

    let model = mat4.create();
    let view = mat4.create();
    let projection = mat4.create();

    mat4.identity(model);
    mat4.identity(view);
    mat4.identity(projection);

    let rotation_axis = vec3.create();

    let color = vec3.create();
    color[1] = 1.0;

    gl.useProgram(shader_program.getProgram());

    processInput();

    function render()
    {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        rotation_axis[2] = 1.0;

        mat4.copy(view, camera.getViewMatrix());
        mat4.perspective(projection, 45.0, 1920.0/ 1080.0, 0.1, 100.0);

        shader_program.setMat4("model", model);
        shader_program.setMat4("view", view);
        shader_program.setMat4("projection", projection);

        gl.bindVertexArray(VAO);

        shader_program.setVec3("color", color);

        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

        requestAnimationFrame(render);

    }
    render();

}

function processInput()
{
    window.addEventListener("keydown", function(event)
    {
        const key_name = event.key.toLowerCase();

        if(key_name == "w")
        {
            camera.processKeyboard(CameraMovement_t.FORWARD, delta_time);
        }
        if(key_name == "s")
        {
            camera.processKeyboard(CameraMovement_t.BACKWARD, delta_time);
        }
        if(key_name == "a")
        {
            camera.processKeyboard(CameraMovement_t.LEFT, delta_time);
        }
        if(key_name == "d")
        {
            camera.processKeyboard(CameraMovement_t.RIGHT, delta_time);
        }
    });
}