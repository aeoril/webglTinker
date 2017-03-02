/**
 * @author aeoril | https://www.ic3dimensions.com
 * Copyright © 2017 by IC3 Dimensions.  MIT License. See LICENSE.md
 * Portions Copyright © 2012 by Gregg Tavares.  See LICENSE-webfundamentals.md
 */

// need to set default precision
precision mediump float;
varying vec4 v_color;

void main() {
  // output static color
  gl_FragColor = v_color;
}
