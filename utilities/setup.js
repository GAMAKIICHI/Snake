"use strict";

export function initGL(element)
{
    const gl = element.getContext("webgl2");

    if(gl === null)
    {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }

    resizeCanvasToDisplaySize(element);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    return gl;
}

export function initBuffers(gl, program, verticies, indicies)
{
    try
    {
        const VBO = initBuffer(gl, verticies, gl.ARRAY_BUFFER);
        const EBO = initBuffer(gl, indicies, gl.ELEMENT_ARRAY_BUFFER);


        let positionAttributeLocaiton = gl.getAttribLocation(program.getProgram(), "a_position");
        let colorAttributeLocation = gl.getAttribLocation(program.getProgram(), "a_color");

        gl.vertexAttribPointer(positionAttributeLocaiton, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 0);
        gl.enableVertexAttribArray(positionAttributeLocaiton);
        gl.vertexAttribPointer(colorAttributeLocation, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
        gl.enableVertexAttribArray(colorAttributeLocation);

        return {
        vertex_buffer: VBO,
        element_buffer: EBO
        };
    }
    catch(error)
    {
        console.error(error);
    }

}

export function initBuffer(gl, positions, type)
{
    try
    {
        const buffer = gl.createBuffer();

        gl.bindBuffer(type, buffer);

        if(type === gl.ARRAY_BUFFER)
        {
            gl.bufferData(type, new Float32Array(positions), gl.STATIC_DRAW);
        }
        else if(type == gl.ELEMENT_ARRAY_BUFFER)
        {
            gl.bufferData(type, new Uint16Array(positions), gl.STATIC_DRAW);
        }

        return buffer;
    }
    catch(error)
    {
        console.error(error);
    }
}

export function resizeCanvasToDisplaySize(canvas)
{
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    const needResize = canvas.width !== displayWidth || canvas.height !== displayHeight;

    if(needResize)
    {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
    }

    return needResize;
}