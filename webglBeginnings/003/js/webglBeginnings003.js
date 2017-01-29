(function () {

  'use strict';

  function initWebGL (canvasElem) {
    var gl = null;

    gl = canvasElem.getContext('webgl') || canvasElem.getContext('experimental-webgl');

    if (!gl) {
      throw new Error('canvasElem.getContext("webgl") returned ' + gl + ' - webgl may not be supported');
    }

    return gl;
  }

  function createShader (gl, type, source) {
    var success;
    var shaderInfoLog;
    var shader = gl.createShader(type);

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

    if (!success) {
      shaderInfoLog = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error(shaderInfoLog);
    }
    return shader;
  }

  function createProgram (gl, vertexShader, fragmentShader) {
    var success;
    var programInfoLog;
    var program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    success = gl.getProgramParameter(program, gl.LINK_STATUS);

    if (!success) {
      programInfoLog = gl.getProgramInfoLog(program);
      gl.deleteProgram(program);
      throw new Error(programInfoLog);
    }

    return program;
  }

  function randomInt (range) {
    return Math.floor(Math.random() * range);
  }

  function setRectangle (gl, x1, y1, x2, y2) {
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      x1, y1,
      x2, y1,
      x1, y2,
      x1, y2,
      x2, y1,
      x2, y2
    ]), gl.STATIC_DRAW);
  }

  function resizeCanvasToDisplaySize (gl) {
    var realToCSSPixels = window.devicePixelRatio;

    var displayWidth  = Math.floor(gl.canvas.clientWidth * realToCSSPixels);
    var displayHeight = Math.floor(gl.canvas.clientHeight * realToCSSPixels);

    if (gl.canvas.width !== displayWidth ||
        gl.canvas.height !== displayHeight) {

      gl.canvas.width = displayWidth;
      gl.canvas.height = displayHeight;
    }
  }

  window.addEventListener('load', function () {
    var vertexShaderSource;
    var fragmentShaderSource;

    var vertexShader;
    var fragmentShader;

    var program;

    var positionAttributeLocation;
    var resolutionUniformLocation;
    var colorUniformLocation;

    var positionBuffer;
    var positions;

    var canvasElem;
    var gl;

    function render () {

      var size = 2;
      var type = gl.FLOAT;
      var normalize = false;
      var stride = 0;
      var offset = 0;

      var primitiveType = gl.TRIANGLES;
      var drawArraysOffset = 0;
      var count = 6;

      var ii;

      var width;
      var height;

      resizeCanvasToDisplaySize(gl);

      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

      width = gl.canvas.width;
      height = gl.canvas.height;

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);

      gl.enableVertexAttribArray(positionAttributeLocation);

      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

      // specify format of positionBuffer position attributes in GPU
      // also, bind current ARRAY_BUFFER (positionBuffer) to the position
      // attribute (a_position on shader, positiionAttributeLocation here)
      // freeing up ARRAY_BUFFER bind point to bind to something else
      // the attribute (a_position) will continue to use positionBuffer
      gl.vertexAttribPointer(
        positionAttributeLocation, size, type, normalize, stride, offset);

      gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

      for (ii = 0; ii < 50; ++ii) {
        setRectangle(
          gl, randomInt(width), randomInt(height), randomInt(width), randomInt(height));
        gl.uniform4f(
          colorUniformLocation, Math.random(), Math.random(), Math.random(), 1);
        gl.drawArrays(gl.TRIANGLES, drawArraysOffset, count);
      }
    }

    canvasElem = document.getElementById('canvas');

    gl = initWebGL(canvasElem);

    vertexShaderSource = document.getElementById('shader-vs').text;
    fragmentShaderSource = document.getElementById('shader-fs').text;

    vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    program = createProgram(gl, vertexShader, fragmentShader);

    positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
    resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');
    colorUniformLocation = gl.getUniformLocation(program, 'u_color');

    positionBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    window.addEventListener('resize', render, false);

    render();

  }, false);
}());
