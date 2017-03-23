/**
 * @author greggman | https://webglfundamentals.org
 * @author aeoril | https://www.ic3dimensions.com
 * Copyright © 2017 by IC3 Dimensions.  MIT License. See LICENSE.md
 */

var m4 = ( function () {

  'use strict';

  var self = {

    identity: function ( sx, sy ) {

      return [

        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1

      ];
    },

    translation: function ( tx, ty ) {

      return [

        1,  0,  0,
        0,  1,  0,
        tx, ty, 1

      ];
    },

    rotationRad: function ( angleInRadians ) {

      var c = Math.cos( angleInRadians );
      var s = Math.sin( angleInRadians );

      return [

        c, -s, 0,
        s,  c, 0,
        0,  0, 1

      ];
    },

    rotationDeg: function ( angleInDegrees ) {

      var angleInRadians = angleInDegrees * Math.PI / 180.0;

      var c = Math.cos( angleInRadians );
      var s = Math.sin( angleInRadians );

      return [

        c, -s, 0,
        s,  c, 0,
        0,  0, 1

      ];
    },

    scaling: function ( sx, sy ) {

      return [

        sx, 0, 0,
        0, sy, 0,
        0,  0, 1

      ];
    },

    projection: function ( width, height ) {

      return [

         2 / width,  0,          0,
         0,         -2 / height, 0,
        -1,          1,          1

      ];
    },

    translate: function ( m, tx, ty ) {

      return self.multiply( m, self.translation( tx, ty ) );

    },

    rotateRad: function ( m, angleInRadians ) {

      return self.multiply( m, self.rotationRad( angleInRadians ) );

    },

    rotateDeg: function ( m, angleInDegrees ) {

      return self.multiply( m, self.rotationDeg( angleInDegrees ) );

    },

    scale: function ( m, sx, sy ) {

      return self.multiply( m, self.scaling( sx, sy ) );

    },

    multiply: function( a, b ) {

      var a00 = a[0 * 3 + 0];
      var a01 = a[0 * 3 + 1];
      var a02 = a[0 * 3 + 2];
      var a10 = a[1 * 3 + 0];
      var a11 = a[1 * 3 + 1];
      var a12 = a[1 * 3 + 2];
      var a20 = a[2 * 3 + 0];
      var a21 = a[2 * 3 + 1];
      var a22 = a[2 * 3 + 2];
      var b00 = b[0 * 3 + 0];
      var b01 = b[0 * 3 + 1];
      var b02 = b[0 * 3 + 2];
      var b10 = b[1 * 3 + 0];
      var b11 = b[1 * 3 + 1];
      var b12 = b[1 * 3 + 2];
      var b20 = b[2 * 3 + 0];
      var b21 = b[2 * 3 + 1];
      var b22 = b[2 * 3 + 2];

      return [

        b00 * a00 + b01 * a10 + b02 * a20,
        b00 * a01 + b01 * a11 + b02 * a21,
        b00 * a02 + b01 * a12 + b02 * a22,
        b10 * a00 + b11 * a10 + b12 * a20,
        b10 * a01 + b11 * a11 + b12 * a21,
        b10 * a02 + b11 * a12 + b12 * a22,
        b20 * a00 + b21 * a10 + b22 * a20,
        b20 * a01 + b21 * a11 + b22 * a21,
        b20 * a02 + b21 * a12 + b22 * a22,

      ];
    }
  };

  return self;

}() );
