"use strict";
import { genVertexArray, genBuffer, bindVertexAttrib, deleteVertexArray, deleteBuffer, unBindVertexArray, unBindBuffer } from "./buffers.js";
import { Shader } from "./shader.js";
import { mat4 } from "./node_modules/gl-matrix/esm/index.js";

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
    }

    async initShape(vertexPath, fragmentPath, vertex, indicies)
    {   
        await this.genProgram(vertexPath, fragmentPath);

        this.VAO = genVertexArray(this.gl);

        this.VBO = genBuffer(this.gl, vertex, this.gl.ARRAY_BUFFER);
        this.EBO = genBuffer(this.gl, indicies, this.gl.ELEMENT_ARRAY_BUFFER);
        bindVertexAttrib(this.gl, this.shader_program, "a_position", 3, this.gl.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);

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