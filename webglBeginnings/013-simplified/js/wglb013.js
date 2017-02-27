/**
 * @author aeoril | https://www.ic3dimensions.com
 * Copyright © 2017 by IC3 Dimensions.  MIT License. See LICENSE.md
 * Portions Copyright © 2012 by Gregg Tavares.  See LICENSE-webfundamentals.md
 */

( function () {

  'use strict';

  function setGeometry ( gl ) {

    var width  = Math.min(gl.canvas.width, gl.canvas.height);
    var height = width; // make a square frame

    var indices = [

      // Triangle 1
      width * -0.2, height * -0.3,
      width * -0.2, height * -0.2,
      width *  0.0, height * -0.3,

      // Triangle 2
      width *  0.0, height * -0.3,
      width * -0.2, height * -0.2,
      width *  0.2, height * -0.2,

      // ...
      width *  0.2, height * -0.2,
      width *  0.0, height * -0.3,
      width *  0.3, height * -0.3,

      width *  0.3, height * -0.3,
      width *  0.2, height * -0.2,
      width *  0.3, height *  0.0,

      width *  0.3, height *  0.0,
      width *  0.2, height * -0.2,
      width *  0.2, height *  0.2,

      width *  0.2, height *  0.2,
      width *  0.3, height * -0.0,
      width *  0.3, height *  0.3,

      width *  0.3,  height *  0.3,
      width *  0.2,  height *  0.2,
      width *  0.0,  height *  0.3,

      width *  0.0,  height *  0.3,
      width *  0.2,  height *  0.2,
      width * -0.2,  height *  0.2,

      width * -0.2,  height *  0.2,
      width *  0.0,  height *  0.3,
      width * -0.3,  height *  0.3,

      width * -0.3,  height *  0.3,
      width * -0.2,  height *  0.2,
      width * -0.3,  height *  0.0,

      width * -0.3,  height *  0.0,
      width * -0.2,  height *  0.2,
      width * -0.2,  height * -0.2,

      width * -0.2,  height * -0.2,
      width * -0.3,  height *  0.0,
      width * -0.3,  height * -0.3

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

  var triangleToUpdate = 0;

  function updateOneColor( gl, colors ) {

    colors.splice( triangleToUpdate * 4, 4,
      mathExtras.randInt( 256 ), mathExtras.randInt( 256 ),
      mathExtras.randInt( 256 ), 255);

    gl.bufferData( gl.ARRAY_BUFFER, new Uint8Array( colors ), gl.STATIC_DRAW );

    triangleToUpdate = (++triangleToUpdate) % Math.floor(colors.length / 4);

  }

  function updateOneRandomColor( gl, colors ) {

    colors.splice( mathExtras.randInt( colors.length / 4 ) * 4, 4,
      mathExtras.randInt( 256 ), mathExtras.randInt( 256 ),
      mathExtras.randInt( 256 ), 255);

    gl.bufferData( gl.ARRAY_BUFFER, new Uint8Array( colors ), gl.STATIC_DRAW );

  }

  window.addEventListener( 'load', function () {

    var vertexShaderSource;
    var fragmentShaderSource;

    var urlObjs = [

      {key: 'VSSource', url: 'glsl/wglb013_vs.glsl'},
      {key: 'FSSource', url: 'glsl/wglb013_fs.glsl'}

    ];

    var vertexShader;
    var fragmentShader;

    var program;

    var colorAttributeLocation;
    var colorBuffer;

    var positionAttributeLocation;
    var positionBuffer;

    var scaleUniformLocation;
    var scale = [1, 1];

    var rotationUniformLocation;
    var rotation = [];
    var angleInDegrees = 90.0;
    var angleInRadians;

    var centerTranslationUniformLocation;
    var centerTranslation;

    var translationUniformLocation;
    var translation = [0, 0];

    var resolutionUniformLocation;

    var canvasElem;
    var gl;

    var colors;

    var count;
    var VERTICES_PER_TRIANGLE = 3;

    var prevTimestamp;

    var first = true;

    var ANIMATE_MS = 42;

    var resetElem;

    var scaleXElem;
    var scaleYElem;

    var angleElem;

    var translateXElem;
    var translateYElem;

    function animate ( timestamp, options ) {

      var resized;

      var size;
      var type;
      var normalize;
      var stride;
      var offset;

      var primitiveType;

      var ii;

      resized = webglUtils.resizeCanvasToDisplaySize( gl );

      if ( resized || first ) {

        gl.viewport( 0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight );

      }

      if ( prevTimestamp === undefined ) {

         prevTimestamp = timestamp;

       }

      if ( !resized && !options.immediate && !first ) {

        if ( timestamp - prevTimestamp < options.ms ) {

          return;

        }
      }

      prevTimestamp = timestamp;

      if ( resized || first ) {

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

        translateXElem.max = gl.canvas.clientWidth;

        translation[0] = Math.min(translation[0], translateXElem.max );
        translateXElem.value = translation[0];

        translateYElem.max = gl.canvas.clientHeight;

        translation[1] = Math.min(translation[1], translateYElem.max );
        translateYElem.value = translation[1];

      }

      if ( options.updateOneColor || options.updateOneRandomColor ||
           options.setColors || first ) {

        //console.log('animate: setting colors');

        gl.bindBuffer( gl.ARRAY_BUFFER, colorBuffer );

        if ( options.setColors || first ) {

          colors = setColors( gl, count );

        } else if (options.updateOneColor) {

          updateOneColor( gl, colors );

        } else {

          updateOneRandomColor( gl, colors );

        }

        size = 4;
        type = gl.UNSIGNED_BYTE;
        normalize = true;
        stride = 0;
        offset = 0;

        gl.vertexAttribPointer(
          colorAttributeLocation, size, type, normalize, stride, offset );

      }

      if ( options.translate ) {

        translation[0] += mathExtras.randIntInc( -1, 1 );
        translation[1] += mathExtras.randIntInc( -1, 1 );

      }

      if (options.scale) {

        scale[0] += (Math.random() - 0.5) / 100;
        scale[1] = scale[0];

      }

      if (options.rotate) {

        angleInDegrees += 0.1;

      }

      angleInRadians = angleInDegrees * Math.PI / 180.0;

      var rotation = [

        Math.cos( angleInRadians ),
        Math.sin( angleInRadians )

      ];

      if ( resized || options.render || first ) {

        gl.clear( gl.COLOR_BUFFER_BIT );

        gl.uniform2fv( scaleUniformLocation, scale );
        gl.uniform2fv( rotationUniformLocation, rotation );
        gl.uniform2fv( translationUniformLocation,
          [ Math.floor( translation[0] * window.devicePixelRatio ),
            Math.floor( translation[1] * window.devicePixelRatio ) ] );

        primitiveType = gl.TRIANGLES;
        offset = 0;

        gl.drawArrays( primitiveType, offset, count );

      }

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
      colorAttributeLocation    = gl.getAttribLocation( program, 'a_color' );

      scaleUniformLocation = gl.getUniformLocation( program, 'u_scale' );
      rotationUniformLocation = gl.getUniformLocation( program, 'u_rotation' );

      centerTranslationUniformLocation = gl.getUniformLocation( program, 'u_centerTranslation');
      translationUniformLocation = gl.getUniformLocation( program, 'u_translation');

      resolutionUniformLocation = gl.getUniformLocation( program, 'u_resolution' );

      colorBuffer    = gl.createBuffer();
      positionBuffer = gl.createBuffer();

      gl.useProgram( program );

      gl.enableVertexAttribArray( positionAttributeLocation );

      gl.enableVertexAttribArray( colorAttributeLocation );

      gl.clearColor( 0, 0, 0, 0 );

      var animateRAFed = rAFAnimate( animate,
         {
           repeat: -1,
           immediate: 0,
           ms: ANIMATE_MS,
           setColors: 1,
           updateOneColor: 0,
           updateOneRandomColor: 0,
           translate: 0,
           scale: 0,
           rotate: 0,
           render: 1,
          } );

      translateXElem = document.getElementById('translateX');

      translateXElem.min = 0;
      translateXElem.max = gl.canvas.clientWidth;
      translateXElem.value = Math.floor( gl.canvas.clientWidth / 2 );
      translation[0] = parseInt(translateXElem.value);

      translateXElem.addEventListener('input', function () {

        translation[0] = parseInt( translateXElem.value );

        animateRAFed( { immediate: 1, render: 1 } );

      });

      translateYElem = document.getElementById('translateY');

      translateYElem.min = 0;
      translateYElem.max = gl.canvas.clientHeight;
      translateYElem.value = Math.floor( gl.canvas.clientHeight / 2 );
      translation[1] = parseInt(translateYElem.value);

      translateYElem.addEventListener('input', function () {

        translation[1] = parseInt( translateYElem.value );

        animateRAFed( { immediate: 1, render: 1 } );

      });

      scaleXElem = document.getElementById('scaleX');

      scaleXElem.min = -200;
      scaleXElem.max = 200;
      scaleXElem.value = 100;

      scaleXElem.addEventListener('input', function () {

        scale[0] = parseInt( scaleXElem.value ) / 100;

        animateRAFed( { immediate: 1, render: 1 } );

      });

      scaleYElem = document.getElementById('scaleY');

      scaleYElem.min = -200;
      scaleYElem.max = 200;
      scaleYElem.value = 100;

      scaleYElem.addEventListener('input', function () {

        scale[1] = parseInt( scaleYElem.value, 10 ) / 100;

        animateRAFed( { immediate: 1, render: 1 } );

      });

      angleElem = document.getElementById('angle');

      angleElem.min = 0;
      angleElem.max = 360;
      angleElem.value = 0;

      angleElem.addEventListener('input', function () {

        angleInDegrees = parseInt( angleElem.value, 10 ) + 90;

        animateRAFed( { immediate: 1, render: 1 } );

      });

      var resetElem = document.getElementById('reset');

      resetElem.addEventListener( 'click', function () {

        angleInDegrees = 0.0;

        translation = [ Math.floor( gl.canvas.clientWidth / 2 ),
          Math.floor( gl.canvas.clientHeight / 2 ) ];

        translateXElem.value = translation[ 0 ];
        translateYElem.value = translation[ 1 ];


        scale = [ 1, 1 ];
        scaleXElem.value = 100;
        scaleYElem.value = 100;

        angleInDegrees = 90;
        angleElem.value = 0;

        animateRAFed( { immediate: 1, render: 1, setColors: 1 } );

      }, false );

      animateRAFed( { immediate: 1, render: 1, setColors: 1 } );

    }

    xhr.textGets( urlObjs, finish );

  }, false);
}() );
