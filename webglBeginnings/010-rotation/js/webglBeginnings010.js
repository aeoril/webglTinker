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
      width * -0.3, height * -0.3,
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

      {key: 'VSSource', url: 'glsl/webglBeginnings010_vs.glsl'},
      {key: 'FSSource', url: 'glsl/webglBeginnings010_fs.glsl'}

    ];

    var vertexShader;
    var fragmentShader;

    var program;

    var colorAttributeLocation;
    var colorBuffer;

    var positionAttributeLocation;
    var positionBuffer;

    var rotationUniformLocation;
    var rotation = [];
    var angleInDegrees = 90.0;
    var angleInRadians;

    var centerTranslationUniformLocation;
    var centerTranslation;

    var translationUniformLocation;
    var translation = [0, 0];
    var translations = [];

    var resolutionUniformLocation;

    var canvasElem;
    var gl;

    var colors;

    var count;
    var VERTICES_PER_TRIANGLE = 3;

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
        gl.viewport( 0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight );
      }

      gl.clear( gl.COLOR_BUFFER_BIT );

      if ( canvasResized || first ) {

        gl.bindBuffer( gl.ARRAY_BUFFER, positionBuffer );

        count = setGeometry( gl );

        centerTranslation = [

          0.5 * gl.canvas.width,
          0.5 * gl.canvas.height

        ];

        gl.uniform2fv( centerTranslationUniformLocation, centerTranslation );

        if (first) {

          for ( offset = 0; offset < count; offset += VERTICES_PER_TRIANGLE ) {

            translations.push([0, 0]);

          }
        }

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

      if ( options.updateOneColor || options.updateOneRandomColor ||  options.setColors || first ) {

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

      primitiveType = gl.TRIANGLES;

      angleInRadians = angleInDegrees * Math.PI / 180.0;

      var rotation = [

        Math.cos( angleInRadians ),
        Math.sin( angleInRadians )

      ];

      translations.forEach( function ( translation, index ) {

        gl.uniform2fv( rotationUniformLocation, rotation );
        gl.uniform2fv( translationUniformLocation, translation );

        gl.drawArrays(
          primitiveType, index * VERTICES_PER_TRIANGLE, VERTICES_PER_TRIANGLE );

        if (options.updateTranslations) {

          translation[0] += mathExtras.randIntInc( -1, 1 );
          translation[1] += mathExtras.randIntInc( -1, 1 );

        }
      });

      if (options.rotate) {

        angleInDegrees += 0.1;

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

      var animateRAFed = rAFAnimate( animate, true );

      var resizeOnly = false;

      window.addEventListener( 'mousedown', function () {

        resizeOnly = !resizeOnly;

        if ( !resizeOnly ) {

          animateRAFed( { rotate: true, updateOneColor: true, ms: MOUSEDOWN_MS } );

        } else {

//          translations.forEach( function ( translation ) {

 //           translation[0] = 0;
  //          translation[1] = 0;

          //});

//          angleInDegrees = 90.0;

          animateRAFed( { ms: MOUSEDOWN_MS } );
        }
      }, false );

      animateRAFed( { rotate: true, updateOneColor: true, ms: MOUSEDOWN_MS } );

    }

    xhr.textGets( urlObjs, finish );

  }, false);
}() );
