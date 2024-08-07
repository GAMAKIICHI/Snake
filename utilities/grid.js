"use strict"
import { mat4 } from "./node_modules/gl-matrix/esm/index.js";
import { Shape } from "./shape.js";
import { Texture } from "./texture.js";

const vertices = 
[
    //front square
    //positions      
    -0.5,  0.5,  0.5,
     0.5, -0.5,  0.5,
     0.5,  0.5,  0.5,
    -0.5, -0.5,  0.5,
];

const indicies =
[
    0, 1, 2,
    0, 1, 3,
];

const texCoordinates = [
    // Front face
    0.0, 0.0,   // Bottom-left
    1.0, 1.0,   // Top-right
    1.0, 0.0,   // Bottom-right
    0.0, 1.0,   // Top-left
];

export class Grid extends Shape
{
    constructor(gl, width = 8, height = 8, size, color = [0.0, 1.0, 0.0])
    {
        super(gl);

        this.width = width;
        this.height = height;
        this.size = size;
        this.color = color;
        this.texture;
    }

    async initGrid(vertexPath, fragmentPath, texturePath = "")
    {
        await this.initShape(vertexPath, fragmentPath, vertices, indicies);

        //Vertex Array Buffer must be bound before generating texture
        this.texture = new Texture(this.gl);
        this.texture.initTexture();
        this.texture.genTexture(this.shader_program, texCoordinates, texturePath);
    }

    identifyModel()
    {
        this.model = mat4.create();
    }

    draw(view, projection)
    {

        this.useProgram();
        this.gl.bindVertexArray(this.VAO);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture.texture);

        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture.texture);

        const screenWidth = Math.floor((this.gl.canvas.width / 8)) * 0.1;
        const screenHeight = Math.floor((this.gl.canvas.height / 8)) * 0.1;

        //These are so we can render grid in the center of the screen
        const halfWidth = Math.floor(this.width/2);
        const halfHeight = Math.floor(this.height/2);

        for(let w = -halfWidth; w < halfWidth; w++)
        {
            for(let h = -halfHeight; h < halfHeight; h++)
            {
                this.identifyModel();
                this.scale([screenWidth, screenHeight, this.size]);
                this.translate([w, h, 0]);

                this.setMat4("model", this.model);
                this.setMat4("view", view);
                this.setMat4("projection", projection);

                this.drawShape(6);
            }
        }
    }
}