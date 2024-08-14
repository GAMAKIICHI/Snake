"use strict"
import { mat4 } from "./node_modules/gl-matrix/esm/index.js";
import { Shape } from "./shape.js";
import { Texture } from "./texture.js";
import { visibleWidthAtZDepth, visibleHeightAtZDepth} from "./camera.js"

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
    constructor(gl, color = [0.0, 1.0, 0.0])
    {
        super(gl);
        this.size;
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

    draw(view, projection, camera)
    {
        this.useProgram();
        this.gl.bindVertexArray(this.VAO);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture.texture);

        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture.texture);

        const screenWidth = Math.floor(visibleHeightAtZDepth(0, camera));
        const screenHeight = Math.floor(visibleWidthAtZDepth(0, camera));

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