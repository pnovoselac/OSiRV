#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;
varying vec2 v_texcoord;
uniform sampler2D u_texture_0;

vec2 random2( vec2 p ) {
    return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    vec2 u = f*f*(3.0-2.0*f);

    return mix( mix( dot( random2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
                     dot( random2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                mix( dot( random2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
                     dot( random2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
}

float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                        0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                        -0.577350269189626,  // -1.0 + 2.0 * C.x
                        0.024390243902439); // 1.0 / 41.0
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i); // Avoid truncation effects in permutation
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));

    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 100.0 * dot(m, g);
}

void main() {

    vec2 center = u_resolution.xy*0.5;
    vec2 nucleusCenter =u_resolution.xy*0.48;
    float radius = 0.2 * u_resolution.x; 
    float nucleusRadius = 0.13 * (u_resolution.x); 

    float dist = distance(v_texcoord * u_resolution, center);
    float nucleusDist = distance(v_texcoord * u_resolution, nucleusCenter);

    float snoiseValue =snoise(v_texcoord * 25.0);
    float noiseValue = noise(v_texcoord * 15.0);
    radius += noiseValue * 25.0;
    nucleusRadius += noiseValue * 45.0;

    float blob = smoothstep(radius+1.0, radius, dist);
    float nucleusBlob = smoothstep(nucleusRadius + 10.0, nucleusRadius, nucleusDist);
    
    if(blob==1.0){
        blob += 1.-snoiseValue *.7;
    }
    else{

        vec4 redCellColor = texture2D(u_texture_0, v_texcoord);
        gl_FragColor = redCellColor;
        return;
    }
    vec4 nucleusColor = vec4(0.41, 0.15, 0.39, 1.0);
    vec4 finalColor = mix(vec4(vec3(blob)*vec3(0.5216, 0.3608, 0.498), 1.0), nucleusColor, nucleusBlob);

    gl_FragColor = finalColor*vec4(0.9765, 0.9725, 0.6588, 1.0);
}
