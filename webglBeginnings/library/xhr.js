var xhr = ( function () {

  'use strict';

  var me = {

    debug: false,

    log: function ( evt, that ) {

      if ( me.debug ) {

        console.log( 'textGets Event log: type: ' + evt.type );
        console.log( that || this );
        console.log( evt );

      }
    },

    load: function ( evt, that, key, length, responsesObj, finish ) {

      //me.log(evt, that);

      if ( that.status !== 200 || !that.responseText ) {

        console.log('textGets: load event for key ' + key +
         ' returned bad status or empty response text');

        responsesObj.badStatus = true;

      }

      responsesObj[ key ] = that.responseText;

      if ( Object.keys( responsesObj ).length - 1 === length) {

        finish( responsesObj );

      }
    },

    get: function ( url, load, progress, error, abort ) {

      var req = new XMLHttpRequest();

      load = load || me.log;
      progress = progress || me.log;
      error = error || me.log;
      abort = abort || me.log;

      req.addEventListener( 'load', load, false );
      req.addEventListener( 'progress', progress, false );
      req.addEventListener( 'error', error, false );
      req.addEventListener( 'abort', abort, false );

      req.open( 'GET', url );
      req.send();

    },

    textGets: function ( urlObjs, finish, progress, error, abort ) {

      var responsesObj = { badStatus: false };

      urlObjs.forEach( function (urlObj ) {

        me.get( urlObj.url, function ( evt ) {

          me.load( evt, this, urlObj.key, urlObjs.length, responsesObj, finish );

        }, progress, error, abort );

      });
    }
  };

  return me;

}() );
