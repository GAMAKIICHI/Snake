"use strict";

export class Shader
{
    constructor(gl_context)
    {
        this.gl = gl_context;
        this.shader_program;
    }

    loadShaderSource(type, source_path)
    {

        return new Promise((resolve, reject) =>
        {
            var xhr = new XMLHttpRequest();

            try
            { 
                if(type === this.gl.VERTEX_SHADER) 
                {
                    xhr.open("GET", source_path);
                }
                else if(type === this.gl.FRAGMENT_SHADER)
                {
                    xhr.open("GET", source_path);
                }
            }        
            catch(error)
            {
                console.error("Error! Invalid type. Must be type VERTEX_SHADER OR FRAGMENT_SHADER");
            }

            xhr.responseType = "";

            xhr.onload = () =>
            {
                resolve(xhr.response);
            }

            xhr.onerror = () =>
            {
                reject("Error! Unable to Load Shader");
            }

            xhr.send();
        });
    }

    genShader(type, source)
    {
        let shader = this.gl.createShader(type);

        this.gl.shaderSource(shader, source);

        this.gl.compileShader(shader);

        let success = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS);

        if(!success)
        {
            console.error(this.gl.getShaderInfoLog(shader));
        }

        return shader;

    }

    async genProgram(vertex_path, fragment_path)
    {
        console.log("Generating Program...");

        this.shader_program = this.gl.createProgram();
        
        this.vertex_source = await this.loadShaderSource(this.gl.VERTEX_SHADER, vertex_path);
        this.fragment_source = await this.loadShaderSource(this.gl.FRAGMENT_SHADER, fragment_path);

        const vertex_shader = this.genShader(this.gl.VERTEX_SHADER, this.vertex_source);
        const fragment_shader = this.genShader(this.gl.FRAGMENT_SHADER, this.fragment_source);

        this.gl.attachShader(this.shader_program, vertex_shader);
        this.gl.attachShader(this.shader_program, fragment_shader);
        this.gl.linkProgram(this.shader_program);

        let success = this.gl.getProgramParameter(this.shader_program, this.gl.LINK_STATUS);

        if(success)
        {
            console.log("Program Generated!");
            this.gl.deleteShader(vertex_shader);
            this.gl.deleteShader(fragment_shader);
            return 1;
        }
        else if(!success)
        {
            console.error(this.gl.getProgramInfoLog(this.shader_program));

            return null;
        }

    }

    useProgram()
    {
        this.gl.useProgram(this.shader_program);
    }

    setFloat(uniform, value)
    {
        let uniform_location = this.gl.getUniformLocation(this.shader_program, uniform);
        if(uniform_location === undefined)
        {
            this.glError(this.gl);
        }

        this.gl.uniform1fv(uniform_location, value);
    }

    setVec3(uniform, value)
    {
        let uniform_location = this.gl.getUniformLocation(this.shader_program, uniform);
        if(uniform_location === undefined)
        {
            this.glError(this.gl);
        }
        
        this.gl.uniform3fv(uniform_location, value);
    }

    setMat4(uniform, value)
    {
        let uniform_location = this.gl.getUniformLocation(this.shader_program, uniform);
        if(uniform_location === undefined)
        {
            this.glError(this.gl);
        }
        
        this.gl.uniformMatrix4fv(uniform_location, false, value);
    }

    glError(gl)
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
}