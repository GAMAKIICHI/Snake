"use strict";
import { Shape } from "./shape.js";
import { vec3 } from "./node_modules/gl-matrix/esm/index.js";

export class Food extends Shape
{
    constructor(gl, color = [0.0, 0.0, 0.0])
    {
        super(gl);
        this.position;
        this.sceneSize;
    }

    async initFood(vertex_path, fragment_path, cameraZ, color = [0, 0, 255, 255], texUrl = "")
    {
        this.sceneSize = cameraZ;
        this.updatePosition();
        await this.initShape(vertex_path, fragment_path, color, texUrl);
    
    }

    updatePosition()
    {
        const possibleScenePos = Math.floor(this.sceneSize / 2);
        const randomPositionX = getRandomNumber(-possibleScenePos, possibleScenePos);
        const randomPositionY = getRandomNumber(-possibleScenePos, possibleScenePos);

        this.position = vec3.set(vec3.create(), randomPositionX, randomPositionY, 0);
    }

    draw(view, projection)
    {
        this.useProgram();
        this.gl.bindVertexArray(this.VAO);

        this.identifyModel();
        this.translate(this.position);

        this.setMat4("model", this.model);
        this.setMat4("view", view);
        this.setMat4("projection", projection);
        this.drawShape(6);
    }

}

function getRandomNumber(min, max)
{
    return Math.floor(Math.random() * (max - min) + min);
}