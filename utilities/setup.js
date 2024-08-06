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