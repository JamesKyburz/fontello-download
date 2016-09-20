var FormData = require('form-data');
var bl = require('bl');
var JSZip = require('jszip');
var request = require('hyperquest');

var fontello = 'http://fontello.com';

module.exports = fontello2jszip;

function fontello2jszip(config, cb) {
  if (typeof config !== 'string') config = JSON.stringify(config);
  var fd = new FormData();
  fd.append('config', config, {filename: 'config', content_type: 'application/json'});
  fd.submit(fontello, function (err, res) {
    if (err || res.statusCode !== 200) return cb('failed to upload to fontello ' + (err || '') + ':' + res.statusCode);
    res.pipe(bl(download));
  })

  function download(err, session) {
    if (err) return cb(err);
    var get = request.get(fontello + '/' + session + '/get');
    get.pipe(bl(unzip));
  }

  function unzip(err, contents) {
    if (err) return cb(err);
    JSZip.loadAsync(contents)
      .then(cb.bind(null, null))
      .catch(cb)
    ;
  }
}
