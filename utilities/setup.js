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

export function glError(gl)
    {   
        const error_value = gl.getError();

        switch(error_value)
        {
            case gl.NO_ERROR:
                console.error("No error has been recorded. The value of this constant is 0.");
                break;
            case gl.INVALID_ENUM:
                console.error("An unacceptable value has been specified for an enumerated argument.");
                break;
            case gl.INVALID_VALUE:
                console.error("A numeric argument is out of range.");
                break;
            case gl.INVALID_OPERATION:
                console.error("The specified command is not allowed for the current state.");
                break;
            case gl.INVALID_FRAMEBUFFER_OPERATION:
                console.error("The currently bound framebuffer is not framebuffer complete when trying to render to or to read from it.");
                break;
            case gl.OUT_OF_MEMORY:
                console.error("Not enough memory is left to execute the command.");
                break;
            case gl.CONTEXT_LOST_WEBGL:
                console.error("WebGL context is lost.");
                break;
        }
    }