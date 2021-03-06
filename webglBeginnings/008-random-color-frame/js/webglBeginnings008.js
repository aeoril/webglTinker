/**
 * @author aeoril | https://www.ic3dimensions.com
 * Copyright © 2017 by IC3 Dimensions.  MIT License. See LICENSE.md
 * Portions Copyright © 2012 by Gregg Tavares.  See LICENSE-webfundamentals.md
 */

( function () {

  'use strict';

  function setGeometry ( gl ) {

    var width  = gl.canvas.width;
    var height = gl.canvas.height;

    var indices = [

      // Triangle 1
      width * 0.2, height * 0.2,
      width * 0.4, height * 0.4,
      width * 0.5, height * 0.2,

      // Triangle 2
      width * 0.5, height * 0.2,
      width * 0.4, height * 0.4,
      width * 0.6, height * 0.4,

      // ...
      width * 0.6, height * 0.4,
      width * 0.5, height * 0.2,
      width * 0.8, height * 0.2,

      width * 0.8, height * 0.2,
      width * 0.6, height * 0.4,
      width * 0.8, height * 0.5,

      width * 0.8, height * 0.5,
      width * 0.6, height * 0.4,
      width * 0.6, height * 0.6,

      width * 0.8, height * 0.5,
      width * 0.6, height * 0.6,
      width * 0.8, height * 0.8,

      width * 0.8, height * 0.8,
      width * 0.6, height * 0.6,
      width * 0.5, height * 0.8,

      width * 0.5, height * 0.8,
      width * 0.6, height * 0.6,
      width * 0.4, height * 0.6,

      width * 0.4, height * 0.6,
      width * 0.5, height * 0.8,
      width * 0.2, height * 0.8,

      width * 0.2, height * 0.8,
      width * 0.4, height * 0.6,
      width * 0.2, height * 0.5,

      width * 0.2, height * 0.5,
      width * 0.4, height * 0.6,
      width * 0.4, height * 0.4,

      width * 0.4, height * 0.4,
      width * 0.2, height * 0.5,
      width * 0.2, height * 0.2

    ];

    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( indices ), gl.STATIC_DRAW );

    return Math.round( indices.length / 2 );

  }

  function setColors ( gl, count ) {

    var colors = [];

    for ( var ii = 0; ii < count; ii++ ) {

      colors.splice( colors.length, 0,
        mathExtras.randInt( 256 ), mathExtras.randInt( 256 ),
        mathExtras.randInt( 256 ), 255 );

    }

    gl.bufferData( gl.ARRAY_BUFFER, new Uint8Array( colors ), gl.STATIC_DRAW );

    return colors;

  }

  function updateRandomColor( gl, colors ) {

    colors.splice( mathExtras.randInt( colors.length / 4 ) * 4, 4,
      mathExtras.randInt( 256 ), mathExtras.randInt( 256 ),
      mathExtras.randInt( 256 ), 255);

    gl.bufferData( gl.ARRAY_BUFFER, new Uint8Array( colors ), gl.STATIC_DRAW );

  }

  window.addEventListener( 'load', function () {

    var vertexShaderSource;
    var fragmentShaderSource;

    var urlObjs = [

      {key: 'VSSource', url: 'glsl/webglBeginnings008_vs.glsl'},
      {key: 'FSSource', url: 'glsl/webglBeginnings008_fs.glsl'}

    ];

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

    var colors;

    var count;

    var prevTimestamp;

    var first = true;

    var RESIZE_MS = 100;
    var MOUSEDOWN_MS = 42;

    function animate ( timestamp, options ) {

      var canvasResized;

      var size;
      var type;
      var normalize;
      var stride;
      var offset;

      var primitiveType;

      var ii;

      //console.log( timestamp, options );

      if ( prevTimestamp === undefined ) {

         prevTimestamp = timestamp;

       }

      if ( options.ms && !first ) {

        if ( timestamp - prevTimestamp < options.ms ) {

          return;

        }
      }

      prevTimestamp = timestamp;

      canvasResized = webglUtils.resizeCanvasToDisplaySize( gl );

      if ( canvasResized || first ) {
        gl.viewport( 0, 0, gl.canvas.width, gl.canvas.height );
      }

      gl.clear( gl.COLOR_BUFFER_BIT );

      if ( canvasResized || first ) {

        //console.log( 'animate: resizing' );

        gl.bindBuffer( gl.ARRAY_BUFFER, positionBuffer );

        count = setGeometry( gl );

        size = 2;
        type = gl.FLOAT;
        normalize = false;
        stride = 0;
        offset = 0;

        gl.vertexAttribPointer(
          positionAttributeLocation, size, type, normalize, stride, offset );

        gl.uniform2f(
          resolutionUniformLocation, gl.canvas.width, gl.canvas.height );

      }

      if ( options.updateRandomColor ||  options.setColors || first ) {

        //console.log('animate: setting colors');

        gl.bindBuffer( gl.ARRAY_BUFFER, colorBuffer );

        if ( options.setColors || first ) {

          colors = setColors( gl, count );

        } else {

          updateRandomColor( gl, colors );

        }

        size = 4;
        type = gl.UNSIGNED_BYTE;
        normalize = true;
        stride = 0;
        offset = 0;

        gl.vertexAttribPointer(
          colorAttributeLocation, size, type, normalize, stride, offset );

      }

      primitiveType = gl.TRIANGLES;

      gl.drawArrays( primitiveType, offset, count );

      first = false;

    }

    function finish ( responsesObj ) {

      if ( responsesObj.badStatus ) {

        throw new Error( '1 or more get loads had a bad status' );

      }

      canvasElem = document.getElementById( 'canvas' );

      gl = webglUtils.initWebGL( canvasElem );

      vertexShader = webglUtils.createShader(
        gl, gl.VERTEX_SHADER, responsesObj.VSSource );

      fragmentShader = webglUtils.createShader(
        gl, gl.FRAGMENT_SHADER, responsesObj.FSSource );

      program = webglUtils.createProgram( gl, vertexShader, fragmentShader );

      positionAttributeLocation = gl.getAttribLocation( program, 'a_position' );
      resolutionUniformLocation = gl.getUniformLocation( program, 'u_resolution' );
      colorAttributeLocation    = gl.getAttribLocation( program, 'a_color' );

      colorBuffer    = gl.createBuffer();
      positionBuffer = gl.createBuffer();

      gl.useProgram( program );

      gl.enableVertexAttribArray( positionAttributeLocation );

      gl.enableVertexAttribArray( colorAttributeLocation );

      gl.clearColor( 0, 0, 0, 0 );

      //var animateRAFed = rAFAnimate( animate );
      var animateRAFed = rAFAnimate( animate, true );

      window.addEventListener( 'resize', function () {

        animateRAFed( { ms: RESIZE_MS } );

      }, false );

      window.addEventListener( 'mousedown', function () {

        animateRAFed.continuous = !animateRAFed.continuous;

        if ( animateRAFed.continuous ) {

      //    animateRAFed( evt, { setColors: true, ms: MOUSEDOWN_MS } );
      //    animateRAFed( { setColors: true, ms: MOUSEDOWN_MS } );
          animateRAFed( { updateRandomColor: true, ms: MOUSEDOWN_MS } );

        }
      }, false );

      animateRAFed( { updateRandomColor: true, ms: MOUSEDOWN_MS } );

    }

    xhr.textGets( urlObjs, finish );

  }, false);
}() );
