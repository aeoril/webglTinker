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

  function setColors (gl) {

    var r1 = Math.random();
    var g1 = Math.random();
    var b1 = Math.random();

    var r2 = Math.random();
    var g2 = Math.random();
    var b2 = Math.random();

    gl.bufferData(gl.ARRAY_BUFFER,
    new Float32Array(
      [r1, b1, g1, 1,
       r1, b1, g1, 1,
       r1, b1, g1, 1,
       r2, b2, g2, 1,
       r2, b2, g2, 1,
       r2, b2, g2, 1]),
    gl.STATIC_DRAW);
  }

  window.addEventListener('load', function () {
    var vertexShaderSource;
    var fragmentShaderSource;

    var vertexShader;
    var fragmentShader;

    var program;

    var colorAttributeLocation;
    var colorBuffer;

    var positionAttributeLocation;
    var positionBuffer;

    var resolutionUniformLocation;

    var canvasElem;
    var gl;

    var count;

    var animateRAFed;

    var urlObjs = [
      {key: 'VSSource', url: 'glsl/webglBeginnings007_vs.glsl'},
      {key: 'FSSource', url: 'glsl/webglBeginnings007_fs.glsl'}
    ];

    function animate () {

      var size;
      var type;
      var normalize;
      var stride;
      var offset;

      var primitiveType;

      var ii;

      webglUtils.resizeCanvasToDisplaySize(gl);

      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);

      gl.enableVertexAttribArray(colorAttributeLocation);

      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
      setColors(gl);

      size = 4;
      type = gl.FLOAT;
      normalize = false;
      stride = 0;
      offset = 0;

      gl.vertexAttribPointer(
        colorAttributeLocation, size, type, normalize, stride, offset);

      gl.enableVertexAttribArray(positionAttributeLocation);

      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      count = setGeometry(gl);

      size = 2;
      type = gl.FLOAT;
      normalize = false;
      stride = 0;
      offset = 0;

      gl.vertexAttribPointer(
        positionAttributeLocation, size, type, normalize, stride, offset);

      gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

      primitiveType = gl.TRIANGLES;

      gl.drawArrays(gl.TRIANGLES, offset, count);
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
      colorAttributeLocation = gl.getAttribLocation(program, 'a_color');

      colorBuffer = gl.createBuffer();
      positionBuffer = gl.createBuffer();

      //animateRAFed = rAFAnimate(animate);
      animateRAFed = rAFAnimate(animate, true);

      window.addEventListener('resize', animateRAFed, false);
      window.addEventListener('mousedown', function () {
        animateRAFed.continuous = !animateRAFed.continuous;
        if (animateRAFed.continuous) {
          animateRAFed();
        }
      }, false);

      animateRAFed();
    }

    xhr.textGets(urlObjs, finish);

  }, false);
}());
