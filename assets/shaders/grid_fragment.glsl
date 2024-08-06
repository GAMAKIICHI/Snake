precision mediump float;

varying vec2 v_texcoord;
varying vec3 color;

uniform sampler2D u_texture;

vec4 grid_color;
float pixel = 2.0;
float border_width = pixel * 0.01;

void main()
{
    vec4 texColor = texture2D(u_texture, v_texcoord);

    if(v_texcoord.x >= border_width && v_texcoord.x <= 1.0 - border_width && v_texcoord.y >= border_width && v_texcoord.y <= 1.0 - border_width)
    {
        grid_color = vec4(0.0, 0.0, 0.0, 1.0);
    }
    else
    {
        grid_color = vec4(texColor.rgb, texColor.a);
    }

    gl_FragColor = grid_color;
}