"use strict";
import { genVertexArray, genBuffer, bindVertexAttrib} from "./buffers.js";
import { Shader } from "./shader.js";
import { mat4 } from "./node_modules/gl-matrix/esm/index.js";
import { Texture } from "./texture.js";

//Default shape is a square
const squareVertices = 
[
    //front square
    //positions         
    -0.5,  0.5,  0.5,
     0.5, -0.5,  0.5,
     0.5,  0.5,  0.5,
    -0.5, -0.5,  0.5,
];

const squareIndicies =
[
    0, 1, 2,
    0, 1, 3,
];

const squareTexCoordinates = [
    // Front face
    0.0, 0.0,   // Bottom-left
    1.0, 1.0,   // Top-right
    1.0, 0.0,   // Bottom-right
    0.0, 1.0,   // Top-left
];

export class Shape extends Shader
{
    constructor(gl)
    {
        super(gl);
        this.VAO;
        this.VBO;
        this.EBO;
        this.model;
        this.angle;
        this.texture = new Texture(this.gl);
    }

    async initShape(vertexPath, fragmentPath, color = [0, 0, 255, 255], texUrl = "", vertices = squareVertices, indicies = squareIndicies, texCoordinates = squareTexCoordinates)
    {   
        await this.genProgram(vertexPath, fragmentPath);

        this.VAO = genVertexArray(this.gl);
        this.VBO = genBuffer(this.gl, vertices, this.gl.ARRAY_BUFFER);
        this.EBO = genBuffer(this.gl, indicies, this.gl.ELEMENT_ARRAY_BUFFER);
        bindVertexAttrib(this.gl, this.shader_program, "a_position", 3, this.gl.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);

        //Vertex Array Buffer must be bound before generating texture
        this.texture.initTexture(color);
        this.texture.genTexture(this.shader_program, texCoordinates, texUrl);

        this.angle = 0.0;
    }

    identifyModel()
    {
        this.model = mat4.create();
    }

    translate(position)
    {
        mat4.translate(this.model, this.model, position);
    }

    rotate(axis)
    {
        mat4.rotate(this.model, this.model, this.angle, axis);
    }

    scale(scalar)
    {
        mat4.scale(this.model, this.model, scalar);
    }

    drawShape(points = 36)
    {
        this.gl.drawElements(this.gl.TRIANGLES, points, this.gl.UNSIGNED_SHORT, 0);
    }

}