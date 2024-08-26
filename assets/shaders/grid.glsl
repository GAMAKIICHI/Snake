precision mediump float;

varying vec2 v_texcoord;

uniform sampler2D u_texture;
uniform float u_gridOpacity;

float pixel = 2.0;
float border_width = pixel * 0.01;

void main()
{
    vec4 texColor = texture2D(u_texture, v_texcoord);

    // Use a smoothstep function to create anti-aliased grid lines.
    float lineX = smoothstep(border_width, border_width + 0.01, v_texcoord.x) * smoothstep(1.0 - border_width, 1.0 - (border_width + 0.01), v_texcoord.x);
    float lineY = smoothstep(border_width, border_width + 0.01, v_texcoord.y) * smoothstep(1.0 - border_width, 1.0 - (border_width + 0.01), v_texcoord.y);
    float gridLine = lineX * lineY;

    // Mix the texture color with the grid line color
    vec4 gridColor = mix(texColor, vec4(0.0, 0.0, 0.0, u_gridOpacity), gridLine);

    gl_FragColor = gridColor;
}