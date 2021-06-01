// const DownloadManager = require("electron-download-manager");
// const {download} = require("electron-dl");

//--------------------------------------------------------------------------------------------------------------
var download = function (url, dest, cb) {
  var file = fs.createWriteStream(dest);
  var request = https.get(url, function (response) {
    response.pipe(file);
    file.on('finish', function () {
      console.log(url + " downloaded to " + dest);
      file.close(cb);  // close() is async, call cb after close completes.
    });
  }).on('error', function (err) { // Handle errors
    fs.unlink(dest); // Delete the file async. (But we don't check the result)
    if (cb) cb(err.message);
  });
};

//--------------------------------------------------------------------------------------------------------------
function download_media(event, media_file, media_hash, media_path, media_url, callback) {

  if (media_file !== null && media_file !== "") {

    if (fs.existsSync(path.join(dataPath, media_path + path.sep + media_file))) {
      var file_data = fs.readFileSync(path.join(dataPath, media_path + path.sep + media_file));
      var file_hash = crypto.createHash('md5').update(file_data).digest('hex').toString();
      if (file_hash !== media_hash) {
        log_and_reply(event, media_file + " changed. Downloading...");
        download(media_url + media_file, path.join(dataPath, media_path + path.sep + media_file), function (err) {
          if (err) {
            log_and_reply(event, err);
          }
          log_and_reply(event, media_file + " downloaded.");
          callback();
        });
      }
      else {
        callback();
      }
    }
    else if (!fs.existsSync(path.join(dataPath, media_path + path.sep + media_file))) {
      log_and_reply(event, media_file + " not found. Downloading...");
      download(media_url + media_file, path.join(dataPath, media_path + path.sep + media_file), function (err) {
        if (err) {
          log_and_reply(event, err);
        }
        log_and_reply(event, media_file + " downloaded.");
        callback();
      });
    }
    else {
      callback();
    }
  }
  else {
    callback();
  }

}
