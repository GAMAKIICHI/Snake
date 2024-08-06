"use strict";
import { genVertexArray, genBuffer, bindVertexAttrib, deleteVertexArray, deleteBuffer, unBindVertexArray, unBindBuffer } from "./buffers.js";

const level = 0;
const width = 1;
const height = 1;
const border = 0;
const pixel = new Uint8Array([0, 0, 255, 255]); // Placeholder pixel until the image is loaded

export class Texture
{
    constructor(gl)
    {
        this.gl = gl;
        this.texture = this.gl.createTexture();
        this.VBO;
    }

    initTexture()
    {
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        
        this.gl.texImage2D(this.gl.TEXTURE_2D, level, this.gl.RGBA, width, height, border, this.gl.RGBA, this.gl.UNSIGNED_BYTE, pixel);
    }

    genTexture(program, texCoordinates, url)
    {
        this.VBO = genBuffer(this.gl, texCoordinates, this.gl.ARRAY_BUFFER);
        bindVertexAttrib(this.gl, program, "a_texcoord", 2, this.gl.FLOAT, false, 0, 0);

        const image = new Image();
        image.src = url;
        image.onload = () =>
        {
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
            this.gl.texImage2D(this.gl.TEXTURE_2D, level, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);

            if(isPowerOf2(image.width) && isPowerOf2(image.height))
            {
                this.gl.generateMipmap(this.gl.TEXTURE_2D);
            }
            else
            {
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
            }
        }
    }
    
}

function isPowerOf2(value) {
    return (value & (value - 1)) === 0;
}