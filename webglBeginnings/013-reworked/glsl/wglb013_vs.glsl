/**
 * @author aeoril | https://www.ic3dimensions.com
 * Copyright © 2017 by IC3 Dimensions.  MIT License. See LICENSE.md
 * Portions Copyright © 2012 by Gregg Tavares.  See LICENSE-webfundamentals.md
 */

attribute vec2 a_position;
attribute vec4 a_color;

uniform vec2 u_centerTranslation;
uniform vec2 u_rotation;
uniform vec2 u_translation;
uniform vec2 u_resolution;
uniform vec2 u_scale;

varying vec4 v_color;

void main() {

  vec2 transformedPosition = a_position * u_scale;

  transformedPosition =  vec2(
    transformedPosition.x * u_rotation.y + transformedPosition.y * u_rotation.x,
    transformedPosition.y * u_rotation.y - transformedPosition.x * u_rotation.x);

  transformedPosition = transformedPosition + u_centerTranslation + u_translation;

  // convert the position from pixels to 0.0 to 1.0
  vec2 zeroToOne = transformedPosition / u_resolution;

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
