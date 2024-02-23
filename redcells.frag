#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform sampler2D yourTexture;

vec2 random2( vec2 p ) {
    return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}

float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    vec2 u = f*f*(3.0-2.0*f);

    return mix( mix( dot( random2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
                     dot( random2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                mix( dot( random2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
                     dot( random2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
    vec3 color = vec3(0.4627, 0.1216, 0.4392);

    st *= 8.0;

    vec2 i_st = floor(st);
    vec2 f_st = fract(st);

    float m_dist = 1.;  // minimum distance

    for (int y= -1; y <= 1; y++) {
        for (int x= -1; x <= 1; x++) {

            vec2 neighbor = vec2(float(x),float(y));

            vec2 point = random2(i_st + neighbor);

			// Animacija i šum
            point = 0.5*sin(1.5*noise(f_st))+ 0.5*sin(u_time + 6.5*point);

            vec2 diff = neighbor + point - f_st;
            float dist = length(diff);

            m_dist =min(m_dist, 3.*dist)*min(m_dist, 3.*dist);//doradjena min dist
        }
    }

    color += m_dist;

    // Centar stanice
    color += 1.0*(0.7-step(0.05, m_dist))*vec3(0.949, 0.8235, 0.9843);

    gl_FragColor = vec4(color,0.9)*vec4(0.9843, 0.9765, 0.4784, 1.0);
}