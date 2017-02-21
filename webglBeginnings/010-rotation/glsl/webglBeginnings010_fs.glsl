// need to set default precision
precision mediump float;
varying vec4 v_color;

void main() {
  // output static color
  gl_FragColor = v_color;
}
