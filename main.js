const {app, protocol, ipcMain, session, BrowserWindow} = require('electron')
const {readFileSync, existsSync} = require('fs') // used to read files
const path = require('path');
const mkdirp = require('mkdirp');
const fs = require('fs') // used to read files
const request = require('request')

const http = require("http");
const https = require("https");
const url = require("url");
const async = require('async');
const crypto = require('crypto');
const ProgressBar = require('progress');

var dataPath;
var wordsJSON;
var categoriesJSON;
var MainWin;
var newGuest;
var LesonParameters;

var json_dl_array = [];
json_dl_array["story"] = false;
json_dl_array["opposites"] = false;
json_dl_array["words"] = false;
json_dl_array["categories"] = false;
var download_check;
var download_array = [];

dataPath = app.getPath('userData');
console.log("data path:");
console.log(dataPath);


//--------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------

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
// function to read from a json file
function readWords() {
  let data;
  if (existsSync(path.join(dataPath, 'words.json'))) {
    data = readFileSync(path.join(dataPath, 'words.json'), 'utf8');
  }
  else {
    data = "{}";
  }
  return data
}

//--------------------------------------------------------------------------------------------------------------
function readStory() {
  let data;
  if (existsSync(path.join(dataPath, 'story.json'))) {
    data = readFileSync(path.join(dataPath, 'story.json'), 'utf8');
    data = data.replace(/\n/gi,"<br>");
  }
  else {
    data = "{}";
  }
  return data
}

//--------------------------------------------------------------------------------------------------------------
function readOpposites() {
  // const data = readFileSync(path.join(dataPath, 'opposites.json'), 'utf8')
  let data;
  if (existsSync(path.join(dataPath, 'opposites.json'))) {
    data = readFileSync(path.join(dataPath, 'opposites.json'), 'utf8')
  }
  else {
    data = "{}";
  }
  return data
}

//--------------------------------------------------------------------------------------------------------------
function readCategories() {
  let data;
  if (existsSync(path.join(dataPath, 'categories.json'))) {
    data = readFileSync(path.join(dataPath, 'categories.json'), 'utf8')
  }
  else {
    data = "{}";
  }
  return data
}

//--------------------------------------------------------------------------------------------------------------
function fileHash(filename, algorithm = 'md5') {
  return new Promise((resolve, reject) => {
    // Algorithm depends on availability of OpenSSL on platform
    // Another algorithms: 'sha1', 'md5', 'sha256', 'sha512' ...
    let shasum = crypto.createHash(algorithm);
    try {
      let s = fs.ReadStream(filename)
      s.on('data', function (data) {
        shasum.update(data)
      })
      // making digest
      s.on('end', function () {
        const hash = shasum.digest('hex')
        return resolve(hash);
      })
    } catch (error) {
      return reject('calc fail');
    }
  });
}


//--------------------------------------------------------------------------------------------------------------
class Downloader {
  constructor() {
    this.q = async.queue(this.singleFile, 1);

    // assign a callback
    this.q.drain(function () {
      console.log('all items have been processed');
    });

    // assign an error callback
    this.q.error(function (err, task) {
      console.error('task experienced an error', task);
    });
  }

  downloadFiles(links) {
    for (let link of links) {
      this.q.push(link);
    }
  }

  singleFile(link, cb) {

    var doDownload = true;
    if (link.media_file !== null && link.media_file !== "") {
      if (fs.existsSync(path.join(dataPath, link.media_path + path.sep + link.media_file))) {
        var file_data = fs.readFileSync(path.join(dataPath, link.media_path + path.sep + link.media_file));
        var file_hash = crypto.createHash('md5').update(file_data).digest('hex').toString();
        if (file_hash === link.media_hash) {
          doDownload = false;
        }
      }

      if (doDownload) {
        let file = request(link.media_url + link.media_file);
        let bar;
        file.on('response', (res) => {
          const len = parseInt(res.headers['content-length'], 10);
          console.log(link.media_url + link.media_file);
          bar = new ProgressBar('  Downloading [:bar] :rate/bps :percent :etas', {
            complete: '=',
            incomplete: ' ',
            width: 20,
            total: len
          });
          file.on('data', (chunk) => {
            bar.tick(chunk.length);
          })
          file.on('end', () => {
            console.log('\n');
            cb();
          })
        })
        file.pipe(fs.createWriteStream(path.join(dataPath, link.media_path + path.sep + link.media_file)));
      }
      else {
        cb();
      }
    }
    else {
      cb();
    }
  }
}

const dl = new Downloader();


//--------------------------------------------------------------------------------------------------------------
function parse_story(event) {
  console.log("start parse story " + download_array.length);
  fs.readFile(path.join(dataPath, 'story.json'), 'utf-8', (err, data) => {
    if (err) throw err;
    storyJSON = JSON.parse(data);
    async.eachLimit(storyJSON, 1, function (SingleStoryJSON, callback) {

      if (SingleStoryJSON.picture !== null && SingleStoryJSON.picture !== "") {
        download_array.push({
          "processed": false,
          "media_file": SingleStoryJSON.picture,
          "media_hash": SingleStoryJSON.picture_hash,
          "media_path": "pictures" + path.sep + "story",
          "media_url": "https://elosoft.tw/picture-dictionary-editor/pictures/story/"
        });
      }

      if (SingleStoryJSON.audio !== null && SingleStoryJSON.audio !== "") {
        download_array.push({
          "processed": false,
          "media_file": SingleStoryJSON.audio,
          "media_hash": SingleStoryJSON.audio_hash,
          "media_path": "audio" + path.sep + "story",
          "media_url": "https://elosoft.tw/picture-dictionary-editor/audio/story/"
        });
      }

      for (var i = 0; i < SingleStoryJSON.questions.length; i++) {
        var story_question = SingleStoryJSON.questions[i];
//        console.log(story_question);

        if (story_question.audio !== null && story_question.audio !== "") {
          download_array.push({
            "processed": false,
            "media_file": story_question.audio,
            "media_hash": story_question.audio_hash,
            "media_path": "audio" + path.sep + "story-question",
            "media_url": "https://elosoft.tw/picture-dictionary-editor/audio/story-question/"
          });
        }

        if (story_question.picture !== null && story_question.picture !== "") {
          download_array.push({
            "processed": false,
            "media_file": story_question.picture,
            "media_hash": story_question.picture_hash,
            "media_path": "pictures" + path.sep + "story-question",
            "media_url": "https://elosoft.tw/picture-dictionary-editor/pictures/story-question/"
          });
        }

        for (var j = 0; j < story_question.answers.length; j++) {
          var question_answer = story_question.answers[j];
//          console.log(question_answer);

          if (question_answer.picture !== null && question_answer.picture !== "") {
            download_array.push({
              "processed": false,
              "media_file": question_answer.picture,
              "media_hash": question_answer.picture_hash,
              "media_path": "pictures" + path.sep + "story-answer",
              "media_url": "https://elosoft.tw/picture-dictionary-editor/pictures/story-answer/"
            });
          }

          if (question_answer.audio !== null && question_answer.audio !== "") {
            download_array.push({
              "processed": false,
              "media_file": question_answer.audio,
              "media_hash": question_answer.audio_hash,
              "media_path": "audio" + path.sep + "story-answer",
              "media_url": "https://elosoft.tw/picture-dictionary-editor/audio/story-answer/"
            });
          }
        }
      }

      callback();
    }, function () {
      log_and_reply(event, "story media download list finished.");
    });
    console.log("end parse story " + download_array.length);
    json_dl_array["story"] = true;
  });
}


//--------------------------------------------------------------------------------------------------------------
function parse_words(event) {
  console.log("start parse dictionary " + download_array.length);
  fs.readFile(path.join(dataPath, 'words.json'), 'utf-8', (err, data) => {
    if (err) throw err;
    wordsJSON = JSON.parse(data);

    async.eachLimit(wordsJSON, 1, function (SingleWordsJSON, callback) {

      if (SingleWordsJSON.picture !== null && SingleWordsJSON.picture !== "") {
        download_array.push({
          "processed": false,
          "media_file": SingleWordsJSON.picture,
          "media_hash": SingleWordsJSON.picture_hash,
          "media_path": "pictures",
          "media_url": "https://elosoft.tw/picture-dictionary-editor/pictures/"
        });
      }

      if (SingleWordsJSON.audio_TR !== null && SingleWordsJSON.audio_TR !== "" && (1 === 1)) {
        download_array.push({
          "processed": false,
          "media_file": SingleWordsJSON.audio_TR,
          "media_hash": SingleWordsJSON.audio_tr_hash,
          "media_path": "audio" + path.sep + "tr",
          "media_url": "https://elosoft.tw/picture-dictionary-editor/audio/tr/"
        });
      }

      if (SingleWordsJSON.audio_EN !== null && SingleWordsJSON.audio_EN !== "" && (1 === 1)) {
        download_array.push({
          "processed": false,
          "media_file": SingleWordsJSON.audio_EN,
          "media_hash": SingleWordsJSON.audio_en_hash,
          "media_path": "audio" + path.sep + "en",
          "media_url": "https://elosoft.tw/picture-dictionary-editor/audio/en/"
        });
      }

      if (SingleWordsJSON.audio_CH !== null && SingleWordsJSON.audio_CH !== "" && (1 === 1)) {
        download_array.push({
          "processed": false,
          "media_file": SingleWordsJSON.audio_CH,
          "media_hash": SingleWordsJSON.audio_ch_hash,
          "media_path": "audio" + path.sep + "ch",
          "media_url": "https://elosoft.tw/picture-dictionary-editor/audio/ch/"
        });
      }

      callback();
    }, function () {
      log_and_reply(event, "dictionary media download list finished.");
    });
    console.log("end parse dictionary " + download_array.length);
    json_dl_array["words"] = true;
  });

}

//--------------------------------------------------------------------------------------------------------------
function log_and_reply(event, msg) {
  console.log(msg)
  event.reply('refresh-data-updated', msg);
}

//--------------------------------------------------------------------------------------------------------------
function createChildWindow(url) {

  console.log("NEW : " + url);
  newGuest = new BrowserWindow({
    parent: MainWin,
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      nativeWindowOpen: true
    }
  })
//	newGuest.webContents.openDevTools({mode: 'bottom'});
  newGuest.loadFile(url);

}

//--------------------------------------------------------------------------------------------------------------
function createWindow() {
  MainWin = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      nativeWindowOpen: true
    }
  })
//	MainWin.webContents.openDevTools({mode: 'bottom'})

  MainWin.loadFile('index.html')

  protocol.registerFileProtocol('poster', (request, callback) => {
    const url = request.url.substr(9);
    console.log("poster url" + url);
    callback({path: path.normalize(app.getPath('userData') + "/" + url)})
  });

  // Main process


  //--------------------------------------------------------------------------------------------------------------
  //re download all data
  ipcMain.on('refresh-data-start', (event, arg) => {
    console.log(arg) // prints "ping"
    download_array = [];

    json_dl_array["story"] = false;
    json_dl_array["opposites"] = false;
    json_dl_array["words"] = false;
    json_dl_array["categories"] = false;

    download_check = setInterval(function () {
      if (json_dl_array["story"] && json_dl_array["opposites"] && json_dl_array["words"] && json_dl_array["categories"]) {
        console.log("ALL JSONS FINISHED, START MEDIA CHECK AND DOWNLOAD FOR " + download_array.length + " ITEMS.");
        clearInterval(download_check);

        dl.downloadFiles(download_array);

      }
    }, 250);

    console.log("-----------------------------");
    console.log("-----------------------------");
    log_and_reply(event, 'data refresh initiated.');
    console.log("-----------------------------");
    console.log("-----------------------------");

    //--------------------------------------------------------------------------------------------------------------
    // download the data
    log_and_reply(event, path.join(dataPath, "audio"));

    mkdirp(path.join(dataPath, "audio")).then(made =>
      log_and_reply(event, path.join(dataPath, "audio") + " folder made"));

    mkdirp(path.join(dataPath, "audio" + path.sep + "tr")).then(made =>
      log_and_reply(event, path.join(dataPath, "audio" + path.sep + "tr") + " made"));

    mkdirp(path.join(dataPath, "audio" + path.sep + "en")).then(made =>
      log_and_reply(event, path.join(dataPath, "audio" + path.sep + "en") + " made"));

    mkdirp(path.join(dataPath, "audio" + path.sep + "ch")).then(made =>
      log_and_reply(event, path.join(dataPath, "audio" + path.sep + "ch") + " made"));

    mkdirp(path.join(dataPath, "audio" + path.sep + "story")).then(made =>
      log_and_reply(event, path.join(dataPath, "audio" + path.sep + "story") + " made"));

    mkdirp(path.join(dataPath, "audio" + path.sep + "story-answer")).then(made =>
      log_and_reply(event, path.join(dataPath, "audio" + path.sep + "story-answer") + " made"));

    mkdirp(path.join(dataPath, "audio" + path.sep + "story-question")).then(made =>
      log_and_reply(event, path.join(dataPath, "audio" + path.sep + "story-question") + " made"));

    mkdirp(path.join(dataPath, "video")).then(made =>
      log_and_reply(event, path.join(dataPath, "video") + " folder made"));

    mkdirp(path.join(dataPath, "pictures")).then(made =>
      log_and_reply(event, path.join(dataPath, "pictures") + " folder made"));

    mkdirp(path.join(dataPath, "pictures" + path.sep + "svg")).then(made =>
      log_and_reply(event, path.join(dataPath, "pictures" + path.sep + "svg") + " folder made"));

    mkdirp(path.join(dataPath, "pictures" + path.sep + "story")).then(made =>
      log_and_reply(event, path.join(dataPath, "pictures" + path.sep + "story") + " folder made"));

    mkdirp(path.join(dataPath, "pictures" + path.sep + "story-answer")).then(made =>
      log_and_reply(event, path.join(dataPath, "pictures" + path.sep + "story-answer") + " folder made"));

    mkdirp(path.join(dataPath, "pictures" + path.sep + "story-question")).then(made =>
      log_and_reply(event, path.join(dataPath, "pictures" + path.sep + "story-question") + " made"));


    mkdirp(path.join(dataPath, "audio" + path.sep + "prepositions")).then(made =>
      log_and_reply(event, path.join(dataPath, "audio" + path.sep + "prepositions") + " folder made"));

    mkdirp(path.join(dataPath, "audio" + path.sep + "opposites")).then(made =>
      log_and_reply(event, path.join(dataPath, "audio" + path.sep + "opposites") + " folder made"));


    //--------------------------------------------------------------------------------------------------
    log_and_reply(event, "try remove temp story2.json");
    try {
      fs.unlinkSync(path.join(dataPath, "story2.json"));
    } catch (err) {
      log_and_reply(event, err);
    }

    log_and_reply(event, "download story.json");
    download("https://elosoft.tw/picture-dictionary-editor/story/data.php", path.join(dataPath, "story2.json"), function () {

      if (fs.existsSync(path.join(dataPath, "story2.json"))) {

        fs.copyFile(path.join(dataPath, "story2.json"), path.join(dataPath, "story.json"), (err) => {
          if (err) throw err;
          log_and_reply(event, 'story2.json was copied to story.json');
          parse_story(event);
        });
      }
      else {
        log_and_reply(event, path.join(dataPath, "story2.json") + " cant be read error.");
        // The check failed
      }
    });


    //--------------------------------------------------------------------------------------------------
    log_and_reply(event, "download opposites.json");
    download("https://elosoft.tw/picture-dictionary-editor/opposites.json", path.join(dataPath, "opposites.json"), function () {
      log_and_reply(event, "finished downloading opposites.json");
      json_dl_array["opposites"] = true;
    });


    //--------------------------------------------------------------------------------------------------
    log_and_reply(event, "try remove temp words2.json");
    try {
      fs.unlinkSync(path.join(dataPath, "words2.json"));
    } catch (err) {
      log_and_reply(event, err);
    }

    log_and_reply(event, "download words.json");
    download("https://elosoft.tw/picture-dictionary-editor/dictionary/data.php", path.join(dataPath, "words2.json"), function () {

      if (fs.existsSync(path.join(dataPath, "words2.json"))) {

        fs.copyFile(path.join(dataPath, "words2.json"), path.join(dataPath, "words.json"), (err) => {
          if (err) throw err;
          log_and_reply(event, 'words2.json was copied to words.json');
          parse_words(event);
        });
      }
      else {
        log_and_reply(event, path.join(dataPath, "words2.json") + " cant be read error.");
        // The check failed
      }
    });


    //--------------------------------------------------------------------------------------------------
    log_and_reply(event, "try remove temp categories2.json");
    try {
      fs.unlinkSync(path.join(dataPath, "categories2.json"));
    } catch (err) {
      log_and_reply(event, err);
    }

    log_and_reply(event, "downloading categories...");

    download("https://elosoft.tw/picture-dictionary-editor/categories/data.php", path.join(dataPath, "categories2.json"), function () {

      if (fs.existsSync(path.join(dataPath, "categories2.json"))) {

        fs.copyFile(path.join(dataPath, "categories2.json"), path.join(dataPath, "categories.json"), (err) => {
          if (err) throw err;
          log_and_reply(event, path.join(dataPath, 'categories2.json') + ' was copied to ' + path.join(dataPath, 'categories.json'));

          fs.readFile(path.join(dataPath, 'categories.json'), 'utf-8', (err, data) => {
            if (err) throw err;
            categoriesJSON = JSON.parse(data);
            log_and_reply(event, "categories download finished.");
            json_dl_array["categories"] = true;
//        console.log(categoriesJSON);
          });
        });
      }
      else {
        log_and_reply(event, path.join(dataPath, "categories2.json") + " cant be read error.");
        // The check failed
      }
    });
  });

}

app.whenReady().then(createWindow)

//const content = new Buffer("you've been conned!");

ipcMain.on('get-lesson-parameters', (event, arg) => {
  event.returnValue = LesonParameters;
});


ipcMain.on('set-lesson-parameters', (event, arg) => {
  LesonParameters = arg;
});


ipcMain.on('load-lesson', (event, arg) => {
  createChildWindow(arg);
});


ipcMain.on('get-all-words', (event, arg) => {
  console.log(arg)
  event.returnValue = readWords()
});


ipcMain.on('get-all-story', (event, arg) => {
  console.log(arg)
  event.returnValue = readStory()
});

ipcMain.on('get-all-opposites', (event, arg) => {
  console.log(arg)
  event.returnValue = readOpposites()
});


ipcMain.on('get-all-categories', (event, arg) => {
  console.log(arg)
  event.returnValue = readCategories()
});


app.on('window-all-closed', () => {
  // if (process.platform !== 'darwin') {
  app.quit()
  // }
});


app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
});
