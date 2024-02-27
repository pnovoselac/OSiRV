precision mediump float;

uniform vec2 u_resolution;
uniform sampler2D u_texture_0;

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution;
  st.x = st.x * u_resolution.x / u_resolution.y;

  vec3 color = vec3(0.0);
  color = vec3(st, 0.0);

  vec4 texture = texture2D(u_texture_0, st);
  color = texture.rgb;

  vec2 imageResolution = vec2(2532, 1544);
  imageResolution = imageResolution / 10.0;
  vec2 texelSize = 1.0 / imageResolution;

  const float kernelSize = 1.0;
  vec3 boxBlurColor = vec3(0.0);

  float boxBlurDivisor=9.0;

  for (float i = -kernelSize; i <= kernelSize; i++) {
    for (float j = -kernelSize; j <= kernelSize; j++) {
      vec4 texture = texture2D(u_texture_0, st + vec2(i, j) * texelSize);
      boxBlurColor = boxBlurColor + texture.rgb;
    }
  }
  boxBlurColor = boxBlurColor / boxBlurDivisor;
  color = boxBlurColor;

  float gaussianDivisor = 16.0;
  vec3 gaussianBlurColor = vec3(0.0);
  gaussianBlurColor += texture2D(u_texture_0, st + vec2(-1, 1) * texelSize).rgb * 1.0;//[0][0] gauss matrice
  gaussianBlurColor += texture2D(u_texture_0, st + vec2(0, 1) * texelSize).rgb * 2.0;//[0][1]red gauss matrice
  gaussianBlurColor += texture2D(u_texture_0, st + vec2(1, 1) * texelSize).rgb * 1.0;//[0][2]red gauss matrice
  gaussianBlurColor += texture2D(u_texture_0, st + vec2(-1, 0) * texelSize).rgb * 2.0;//[1][0]red gauss matrice
  gaussianBlurColor += texture2D(u_texture_0, st + vec2(0, 0) * texelSize).rgb * 4.0;//[1][1]red gauss matrice
  gaussianBlurColor += texture2D(u_texture_0, st + vec2(1, 0) * texelSize).rgb * 2.0;//[1][2]red gauss matrice
  gaussianBlurColor += texture2D(u_texture_0, st + vec2(-1, -1) * texelSize).rgb * 1.0;//[2][0]red gauss matrice
  gaussianBlurColor += texture2D(u_texture_0, st + vec2(0, -1) * texelSize).rgb * 2.0;//[2][1]red gauss matrice
  gaussianBlurColor += texture2D(u_texture_0, st + vec2(1, -1) * texelSize).rgb * 1.0;//[2][2]red gauss matrice
  gaussianBlurColor = gaussianBlurColor / gaussianDivisor; //matrica/16.0==1/16*matrica
  color = gaussianBlurColor;

  gl_FragColor = vec4(color, 1.0);
}