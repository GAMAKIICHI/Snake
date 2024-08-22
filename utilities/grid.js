"use strict"
import { mat4 } from "./node_modules/gl-matrix/esm/index.js";
import { Shape } from "./shape.js";

export class Grid extends Shape
{
    constructor(gl)
    {
        super(gl);
        this.size;
    }

    async initGrid(vertexPath, fragmentPath, color = [0, 0, 255, 255], texturePath = "")
    {
        await this.initShape(vertexPath, fragmentPath, color, texturePath);
    }

    identifyModel()
    {
        this.model = mat4.create();
    }

    draw(view, projection, camera)
    {
        this.useProgram();
        this.gl.bindVertexArray(this.VAO);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture.texture);

        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture.texture);

        const screenWidth = camera.screenWidth;
        const screenHeight = camera.screenHeight;

        for(let w = -screenWidth; w < screenWidth; w++)
        {
            for(let h = -screenHeight; h < screenHeight; h++)
            {
                this.identifyModel();
                this.translate([w, h, 0]);

                this.setMat4("model", this.model);
                this.setMat4("view", view);
                this.setMat4("projection", projection);

                this.drawShape(6);
            }
        }
    }
}