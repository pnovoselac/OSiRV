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
    vec3 color = vec3(0.7137, 0.7412, 0.3529);
    st *= 1.0;

    vec2 i_st = floor(st);
    vec2 f_st = 5.*fract(st);


    float m_dist = 1.;  // minimum distance

    for (int y= 0; y <= 9; y++) {
        for (int x= 0; x <= 9; x++) {

            vec2 neighbor = vec2(float(x),float(y));

            vec2 point = random2(i_st + neighbor);

			// Animacija i šum
            point = 0.2*sin(1.5*noise(f_st))+ 0.5*sin(6.5*point);

            vec2 diff = neighbor + point - f_st;
            diff=diff;
            float dist = length(diff);
            
            m_dist =min(m_dist, 3.0*dist);//doradjena min dist  
        }
    }

    color += m_dist;
    // Centar stanice
    color *= (1.-step(0.9, m_dist));

    color=1.0-color;
    color+=vec3(0.9333, 0.6353, 1.0);
    color*=vec3(0.9725, 0.9608, 0.3725);

    gl_FragColor = vec4(color, 1.0);
}
