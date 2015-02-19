var request = require('hyperquest');
var FormData = require('form-data');
var bl = require('bl');
var JSZip = require('jszip');

var fontello = 'http://fontello.com';

module.exports = mount;

function mount(config, cb) {
  if (typeof config !== 'string') config = JSON.stringify(config);
  var fd = new FormData();
  fd.append('config', config, {filename: 'config', content_type: 'application/json'});
  var post = request.post(fontello, {headers: fd.getCustomHeaders()});

  post.pipe(bl(download));
  fd.pipe(post);

  function download(err, session) {
    if (err) return cb(err);
    var get = request.get(fontello + '/' + session + '/get');
    get.pipe(bl(unzip));
  }

  function unzip(err, contents) {
    if (err) return cb(err);
    cb(err, new JSZip(contents));
  }
}
