(function () {

  'use strict';

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

  function resizeCanvasToDisplaySize (canvas) {
    var realToCSSPixels = window.devicePixelRatio;

    var displayWidth  = Math.floor(canvas.clientWidth * realToCSSPixels);
    var displayHeight = Math.floor(canvas.clientHeight * realToCSSPixels);

    if (canvas.width !== displayWidth ||
        canvas.height !== displayHeight) {

      canvas.width = displayWidth;
      canvas.height = displayHeight;
    }
  }

  window.addEventListener('load', function () {
    var vertexShaderSource;
    var fragmentShaderSource;

    var vertexShader;
    var fragmentShader;

    var program;

    var positionAttributeLocation;
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
      var count = 3;

      resizeCanvasToDisplaySize(gl.canvas);
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

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

      gl.drawArrays(primitiveType, drawArraysOffset, count);
    }

    canvasElem = document.getElementById('canvas');
    gl = canvasElem.getContext('webgl');

    if (!gl) {
      throw new Error('canvasElem.getContext("webgl") returned null - webgl may not be supported');
    }

    vertexShaderSource = document.getElementById('shader-vs').text;
    fragmentShaderSource = document.getElementById('shader-fs').text;

    vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    program = createProgram(gl, vertexShader, fragmentShader);

    positionAttributeLocation = gl.getAttribLocation(program, 'a_position');

    positionBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Single triangle vertices in (x, y) clipspace coordinates
    positions = [
      0.0, 0.0,
      0.0, 0.5,
      0.7, 0.0
    ];

    // copy strongly typed positions array to GPU
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    render();

  }, false);
}());
