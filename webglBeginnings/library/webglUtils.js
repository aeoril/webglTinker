/**
 * @author aeoril | https://www.ic3dimensions.com
 * Copyright © 2017 by IC3 Dimensions.  MIT License. See LICENSE.md
 * Portions Copyright © 2012 by Gregg Tavares.  See LICENSE-webfundamentals.md
 */

var webglUtils = ( function () {

  'use strict';

  return {

    initWebGL: function ( canvasElem ) {

      var gl = null;

      gl = canvasElem.getContext( 'webgl' ) ||
           canvasElem.getContext( 'experimental-webgl' );

      if ( !gl ) {

        throw new Error('canvasElem.getContext("webgl") returned ' + gl +
         ' - webgl may not be supported');

      }

      return gl;

    },

    createShader:  function ( gl, type, source ) {

      var success;
      var shaderInfoLog;

      var shader = gl.createShader( type );

      gl.shaderSource( shader, source );
      gl.compileShader( shader );

      success = gl.getShaderParameter( shader, gl.COMPILE_STATUS );

      if ( !success ) {

        shaderInfoLog = gl.getShaderInfoLog( shader );

        gl.deleteShader( shader );

        throw new Error( shaderInfoLog );

      }

      return shader;

    },


    createProgram: function ( gl, vertexShader, fragmentShader ) {

      var success;
      var programInfoLog;

      var program = gl.createProgram();

      gl.attachShader( program, vertexShader );
      gl.attachShader( program, fragmentShader );

      gl.linkProgram( program );

      success = gl.getProgramParameter( program, gl.LINK_STATUS );

      if ( !success ) {

        programInfoLog = gl.getProgramInfoLog( program );

        gl.deleteProgram( program );

        throw new Error( programInfoLog );

      }

      return program;

    },

    resizeCanvasToWindowSize: function ( gl ) {

      var windowWidth  = window.innerWidth;
      var windowHeight = window.innerHeight;

      //var lesser = Math.min(windowWidth, windowHeight);

      if ( gl.canvas.width !== windowWidth ||
           gl.canvas.height !== windowHeight ) {

        gl.canvas.width  = windowWidth;
        gl.canvas.height = windowHeight;

        return true;

      }

      return false;

    },

    resizeCanvasToDisplaySize: function ( gl ) {

      var realToCSSPixels = window.devicePixelRatio;

      var displayWidth  = Math.floor( gl.canvas.clientWidth * realToCSSPixels );
      var displayHeight = Math.floor( gl.canvas.clientHeight * realToCSSPixels );
      //displayHeight = 6100;

      if ( gl.canvas.width !== displayWidth ||
           gl.canvas.height !== displayHeight ) {

        gl.canvas.width  = displayWidth;
        gl.canvas.height = displayHeight;

        return true;

      }

      return false;

    }
  };
}() );
