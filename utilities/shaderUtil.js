"use strict";

export class Shader_t
{

    static shader_program;

    constructor(gl_context, vector_path, fragment_path)
    {
        this.vector_path = vector_path;
        this.fragment_path = fragment_path;
        this.gl = gl_context;
    }

    getProgram()
    {
        return this.shader_program;
    }

    loadShaderSource(type)
    {

        return new Promise((resolve, reject) =>
        {
            var xhr = new XMLHttpRequest();

            try
            {
                if(type === this.gl.VERTEX_SHADER) 
                {
                    xhr.open("GET", this.vector_path);
                }
                else if(type === this.gl.FRAGMENT_SHADER)
                {
                    xhr.open("GET", this.fragment_path);
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

    async genProgram()
    {
        console.log("Generating Program...");

        this.shader_program = this.gl.createProgram();
        
        const vertex_source = await this.loadShaderSource(this.gl.VERTEX_SHADER);
        const fragment_source = await this.loadShaderSource(this.gl.FRAGMENT_SHADER);

        const vertex_shader = this.genShader(this.gl.VERTEX_SHADER, vertex_source);
        const fragment_shader = this.genShader(this.gl.FRAGMENT_SHADER, fragment_source);

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

    setFloat(uniform, value)
    {
        let uniform_location = this.gl.getUniformLocation(this.shader_program, uniform);
        if(uniform_location === null)
        {
            console.error(this.gl.getError());
        }

        this.gl.uniform1fv(uniform_location, value);
    }

    setVec3(uniform, value)
    {
        let uniform_location = this.gl.getUniformLocation(this.shader_program, uniform);
        if(uniform_location === null)
        {
            console.error(this.gl.getError());
        }
        
        this.gl.uniform3fv(uniform_location, value);
    }

    setMat4(uniform, value)
    {
        let uniform_location = this.gl.getUniformLocation(this.shader_program, uniform);
        if(uniform_location === null)
        {
            console.error(this.gl.getError());
        }
        
        this.gl.uniformMatrix4fv(uniform_location, false, value);
    }
}