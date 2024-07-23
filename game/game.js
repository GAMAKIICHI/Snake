"use strict";
import { initGL } from "../utilities/setup.js"
import { render } from "../utilities/render.js"

main();

function main()
{

    let game_scene = document.getElementById("game-scene");

    const gl = initGL(game_scene);

    render(gl);
}