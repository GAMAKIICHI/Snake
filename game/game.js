"use strict";

main();

function main()
{
    let game_scene = document.getElementById("game-scene");

    /*makes sure webgl is initalized*/
    const gl = game_scene.getContext("webgl");

    if(gl === null)
    {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}