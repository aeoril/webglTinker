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

  function initWebGL (canvasElem) {
    var gl = null;

    gl = canvasElem.getContext('webgl') || canvasElem.getContext('experimental-webgl');

    if (!gl) {
      throw new Error('canvasElem.getContext("webgl") returned ' + gl + ' - webgl may not be supported');
    }

    return gl;
  }

  window.addEventListener('load', function () {
    var vertexShaderSource;
    var fragmentShaderSource;

    var vertexShader;
    var fragmentShader;

    var program;

    var positionAttributeLocation;
    var resolutionUniformLocation;

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

      resizeCanvasToDisplaySize(gl);
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

      gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

      gl.drawArrays(primitiveType, drawArraysOffset, count);
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

    positionBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Single triangle vertices in (x, y) clipspace coordinates
    positions = [
      10.0, 20.0,
      80.0, 20.0,
      10.0, 30.0
    ];

    // copy strongly typed positions array to GPU
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    render();

  }, false);
}());
