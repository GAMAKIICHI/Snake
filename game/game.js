"use strict";
import { initGL } from "../utilities/setup.js"
import { Render } from "../utilities/render.js"

main();

async function main()
{

    let game_scene = document.getElementById("game-scene");

    const gl = initGL(game_scene);

    const renderer = new Render(gl);
    await renderer.initRender();

    renderer.gameState();
    renderer.gameScene();
}