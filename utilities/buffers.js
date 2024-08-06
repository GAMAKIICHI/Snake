"use strict"

export function bindVertexAttrib(gl, program, attribLocationName, size, type, normalized, stride, offset)
{
    let attribLocation = gl.getAttribLocation(program, attribLocationName);

    gl.vertexAttribPointer(attribLocation, size, type, normalized, stride, offset);
    gl.enableVertexAttribArray(attribLocation);
}

export function genVertexArray(gl)
{
    try
    {
        const VAO = gl.createVertexArray();
        if(VAO === undefined)
        {
            throw new TypeError("Error Creating VAO");
        }

        gl.bindVertexArray(VAO);

        return VAO;
    }
    catch({name, message})
    {
        console.error(`${name}: ${message}`);
    }
}

export function genBuffer(gl, positions, type)
{
    
    try
    {
        const buffer = gl.createBuffer();

        if(type !== gl.ARRAY_BUFFER && type !== gl.ELEMENT_ARRAY_BUFFER)
        {
            throw new TypeError("Error! Invalid type. Type must be ARRAY_BUFFER or ELEMENT_ARRAY_BUFFER")
        }
        if(buffer === undefined)
        {
            throw new TypeError("Error! Unable to create buffer");
        }

        gl.bindBuffer(type, buffer);

        const dataType = type === gl.ARRAY_BUFFER ? new Float32Array(positions) : new Uint16Array(positions);

        gl.bufferData(type, dataType, gl.STATIC_DRAW);

        return buffer;
    }
    catch({name, message})
    {
        console.error(`${name}: ${message}`);
    }
}

export function unBindVertexArray(gl)
{
    gl.bindVertexArray(null);
}

export function unBindBuffer(gl, type)
{
    try
    {
        if(type !== gl.ARRAY_BUFFER && type !== gl.ELEMENT_ARRAY_BUFFER)
        {
            throw new TypeError("Error! Invalid type. Type must be ARRAY_BUFFER or ELEMENT_ARRAY_BUFFER")
        }

        gl.bindBuffer(type, null);
    }
    catch({name, message})
    {
        console.error(`${name}: ${message}`);
    }
}

export function deleteVertexArray(gl, vertexArray)
{
    try
    {
        if(gl.deleteVertexArray(vertexArray))
        {
            throw new TypeError("Error Deleting Vertex Array");
        }
    }
    catch({name, message})
    {
        console.error(`${name}: ${message}`);
    }
}

export function deleteBuffer(gl, buffer)
{
    try
    {
        if(gl.deleteBuffer(buffer) !== undefined)
        {
            throw new TypeError("Error Deleting Buffer");
        }
    }
    catch({name, message})
    {
        console.error(`${name}: ${message}`);
    }

}