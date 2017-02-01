(function () {

  'use strict';

  function XHRs (urlObjs, finish, progress, error, abort) {

    var responsesObj = { badStatus: false };

    function log (evt, that) {
      console.log('XHRs Event log: type: ' + evt.type); console.log(that || this); console.log(evt);
    }

    function XHR (url, load, progress, error, abort) {

      var oReq = new XMLHttpRequest();

      load = load || log;
      progress = progress || log;
      error = error || log;
      abort = abort || log;

      oReq.addEventListener('load', load, false);
      oReq.addEventListener('progress', progress, false);
      oReq.addEventListener('error', error, false);
      oReq.addEventListener('abort', abort, false);

      oReq.open('GET', url);
      oReq.send();
    }

    function load (evt, that, key, responsesObj) {

      log(evt, that);

      if (that.status !== 200) {
        console.log('XHRs: load event for key ' + key + ' returned bad status: ' + that.status);
        responsesObj.badStatus = true;
      }

      responsesObj[key] = that.responseText;

      if (Object.keys(responsesObj).length - 1 === urlObjs.length) {
        finish(responsesObj);
      }
    }

    urlObjs.forEach(function (urlObj) {
      XHR(urlObj.url, function (evt) {
        load(evt, this, urlObj.key, responsesObj);
      }, progress, error, abort);
    });
  }

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

  function setGeometry (gl) {
    var width = gl.canvas.width;
    var height = gl.canvas.height;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      width * 0.2, height * 0.2,
      width * 0.2, height * 0.8,
      width * 0.8, height * 0.2,
      width * 0.8, height * 0.2,
      width * 0.8, height * 0.8,
      width * 0.2, height * 0.8
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

    var urlObjs = [
      {key: 'VSSource', url: 'glsl/webglBeginnings005_vs.glsl'},
      {key: 'FSSource', url: 'glsl/webglBeginnings005_fs.glsl'}
    ];

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

      setGeometry(gl);
      gl.drawArrays(gl.TRIANGLES, drawArraysOffset, count);
    }

    function finish (responsesObj) {

      if (responsesObj.badStatus) {
        throw new Error('1 or more XHR loads had a bad status');
      }

      canvasElem = document.getElementById('canvas');

      gl = initWebGL(canvasElem);

      vertexShader = createShader(gl, gl.VERTEX_SHADER, responsesObj.VSSource);
      fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, responsesObj.FSSource);

      program = createProgram(gl, vertexShader, fragmentShader);

      positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
      resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');
      colorUniformLocation = gl.getUniformLocation(program, 'u_color');

      positionBuffer = gl.createBuffer();

      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

      window.addEventListener('resize', render, false);

      render();
    }

    XHRs(urlObjs, finish);

  }, false);
}());
