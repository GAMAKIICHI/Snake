"use strict";
import { initGL } from "../utilities/setup.js"
import { Render } from "../utilities/render.js"

main();

async function main()
{

    const game_scene = document.getElementById("game-scene");
    const menu = document.getElementById("menu");

    const gl = initGL(game_scene);

    const renderer = new Render(gl);
    await renderer.initRender();

    renderer.menuState();
    renderer.menuScene();
    renderer.gameState();
    renderer.gameScene();
}