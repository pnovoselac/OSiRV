#ifdef GL_ES
precision mediump float;
#endif


uniform float u_time;
uniform vec2 u_resolution;
uniform sampler2D u_texture_2;

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;

    //šum i uzorak teksture
    float mdf = 0.1;
    float noise = fract(sin(dot(uv, vec2(12.9898, 78.233) * 2.0)) * 43758.5453);
    vec4 tex = texture2D(u_texture_2, uv);

    mdf *= 1.0;

    vec4 col = tex - noise * mdf;

    gl_FragColor = col;
}
