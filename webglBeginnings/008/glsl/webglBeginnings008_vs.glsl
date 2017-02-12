// attribute to receive position data from buffer
attribute vec2 a_position;
attribute vec4 a_color;

uniform vec2 u_resolution;

varying vec4 v_color;

void main() {
  // convert the position from pixels to 0.0 to 1.0
  vec2 zeroToOne = a_position / u_resolution;

  // convert from 0->1 to 0->2
  vec2 zeroToTwo = zeroToOne * 2.0;

  // convert from 0->2 to -1->+1 (clipspace)
  vec2 clipSpace = zeroToTwo - 1.0;

  vec2 clipSpaceFlipped = clipSpace * vec2(1.0, -1.0);

  // output position data
  gl_Position = vec4(clipSpaceFlipped, 0.0, 1.0);

  // go from -1->+1 (clipspace) to 0->+1 (colorspace)
  v_color = a_color;
}
