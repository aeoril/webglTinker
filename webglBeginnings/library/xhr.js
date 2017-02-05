var xhr = {
  textGets: function (urlObjs, finish, progress, error, abort) {

    var responsesObj = { badStatus: false };

    function log (evt, that) {
      console.log('textGets Event log: type: ' + evt.type); console.log(that || this); console.log(evt);
    }

    function get (url, load, progress, error, abort) {

      var xhr = new XMLHttpRequest();

      load = load || log;
      progress = progress || log;
      error = error || log;
      abort = abort || log;

      xhr.addEventListener('load', load, false);
      xhr.addEventListener('progress', progress, false);
      xhr.addEventListener('error', error, false);
      xhr.addEventListener('abort', abort, false);

      xhr.open('GET', url);
      xhr.send();
    }

    function load (evt, that, key, responsesObj) {

      log(evt, that);

      if (that.status !== 200 || !that.responseText) {
        console.log('textGets: load event for key ' + key + ' returned bad status or empty response text');
        responsesObj.badStatus = true;
      }

      responsesObj[key] = that.responseText;

      if (Object.keys(responsesObj).length - 1 === urlObjs.length) {
        finish(responsesObj);
      }
    }

    urlObjs.forEach(function (urlObj) {
      get(urlObj.url, function (evt) {
        load(evt, this, urlObj.key, responsesObj);
      }, progress, error, abort);
    });
  }
};
