(function () {

  'use strict';

  function setGeometry (gl) {

    var width = gl.canvas.width;
    var height = gl.canvas.height;

    var indices = [
      width * 0.2, height * 0.2,
      width * 0.2, height * 0.8,
      width * 0.8, height * 0.2,
      width * 0.8, height * 0.2,
      width * 0.8, height * 0.8,
      width * 0.2, height * 0.8
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(indices), gl.STATIC_DRAW);

    return Math.round(indices.length / 2);
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

    var urlObjs = [
      {key: 'VSSource', url: 'glsl/webglBeginnings006_vs.glsl'},
      {key: 'FSSource', url: 'glsl/webglBeginnings006_fs.glsl'}
    ];

    function render () {

      var size = 2;
      var type = gl.FLOAT;
      var normalize = false;
      var stride = 0;
      var offset = 0;

      var primitiveType = gl.TRIANGLES;
      var drawArraysOffset = 0;
      var count;

      var ii;

      var width;
      var height;

      webglUtils.resizeCanvasToDisplaySize(gl);

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

      count = setGeometry(gl);
      gl.drawArrays(gl.TRIANGLES, drawArraysOffset, count);
    }

    function finish (responsesObj) {

      if (responsesObj.badStatus) {
        throw new Error('1 or more get loads had a bad status');
      }

      canvasElem = document.getElementById('canvas');

      gl = webglUtils.initWebGL(canvasElem);

      vertexShader = webglUtils.createShader(gl, gl.VERTEX_SHADER, responsesObj.VSSource);
      fragmentShader = webglUtils.createShader(gl, gl.FRAGMENT_SHADER, responsesObj.FSSource);

      program = webglUtils.createProgram(gl, vertexShader, fragmentShader);

      positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
      resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');
      colorUniformLocation = gl.getUniformLocation(program, 'u_color');

      positionBuffer = gl.createBuffer();

      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

      window.addEventListener('resize', render, false);

      render();
    }

    xhr.textGets(urlObjs, finish);

  }, false);
}());
