attribute vec4 a_position;
attribute vec3 a_color;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

varying lowp vec3 color;

void main()
{
    gl_Position = projection * view * model * a_position;
    color = a_color;
}