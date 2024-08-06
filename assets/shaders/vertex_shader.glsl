attribute vec4 a_position;
attribute vec2 a_texcoord;

varying vec2 v_texcoord;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

varying vec3 color;

void main()
{
    gl_Position = projection * view * model * a_position;
    v_texcoord = a_texcoord;
}