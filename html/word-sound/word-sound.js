var LessonProgress = 0;

var AllWordsData;
var AlfaWords = [];

var LessonParameters;
var LessonLanguage;
var LessonType;

var LessonLength = 1;
var LessonProgress = 1;


//---------------------------------------------------------------
var _listener = function (playerid) {

  if (playerid.target.id === "media_audio") {
    media_audio_playing = false;
  }

  if (playerid.target.id === "media_audio2") {
    media_audio2_playing = false;
  }


  if (playerid.target.id === "media_audio") {
    console.log("!!!!!");
  }
};


function DrawLessonWord(WordIndex) {

  var WordImage = "<img id='lesson_word' data-word_sound='" + AlfaWords[WordIndex].word_sound + "' class=\"img-fluid\" src=\"poster://pictures/" + AlfaWords[WordIndex].image + "\" alt=\"" + AlfaWords[WordIndex].word + "\"  />";

  $("#PictureContainer").html(WordImage);

}


//---------------------------------------------------------------
$(document).ready(function () {

  LessonParameters = window.sendSyncCmd('get-lesson-parameters', '');

  //LessonLength = parseInt(LessonParameters["length"], 10);
  LessonLength = (3 * 2) + (4 * 2) + (6 * 2) + (8 * 2) + (9 * 2) + (12 * 2);
  LessonLanguage = LessonParameters["language"];
  LessonCategory = LessonParameters["category"];

  LessonType = LessonParameters["type"];

  AllWordsData = JSON.parse(window.sendSyncCmd('get-all-words', ''));
  for (var i = 0; i < AllWordsData.length; i++) {
    if (LessonCategory.indexOf("-" + AllWordsData[i].categoryID + "-") !== -1 && AllWordsData[i].word_sound!=="") {
      if (AllWordsData[i].word_TR !== "" && AllWordsData[i].word_TR !== null && LessonLanguage === "tr") {
        // console.log(AllWordsData[i]);
        AlfaWords.push({"word": AllWordsData[i].word_TR, "image": AllWordsData[i].picture, "word_sound": AllWordsData[i].word_sound, "audio": AllWordsData[i].audio_TR});
      }

      if (AllWordsData[i].word_EN !== "" && AllWordsData[i].word_EN !== null && LessonLanguage === "en") {
        AlfaWords.push({"word": AllWordsData[i].word_EN, "image": AllWordsData[i].picture, "word_sound": AllWordsData[i].word_sound,  "audio": AllWordsData[i].audio_EN});
      }
      if (AllWordsData[i].word_CH !== "" && AllWordsData[i].word_CH !== null && LessonLanguage === "ch") {
        // console.log(AllWordsData[i]);
        AlfaWords.push({
          "word": AllWordsData[i].word_CH,
          "pinyin": AllWordsData[i].pinyin,
          "bopomofo": AllWordsData[i].bopomofo,
          "image": AllWordsData[i].picture,
          "word_sound": AllWordsData[i].word_sound,
          "audio": AllWordsData[i].audio_CH
        });
      }
    }
  }
  LessonLength = AlfaWords.length;

  shuffleArray(AlfaWords);

  console.log(AlfaWords);

  LessonProgress=1;
  DrawLessonWord(LessonProgress-1);
  $("#progress_bar_box").css({"width": ((LessonProgress / LessonLength) * 100) + "%"});

  $("#listen_button").on('click', function () {

    const synth = new Tone.Synth().toDestination();
    const now = Tone.now();

    var toneX = $("#lesson_word").data("word_sound");
    var tones = toneX.split(",");

    for (var i=0; i<tones.length; i++) {
      synth.triggerAttackRelease(tones[i], "4n", now + (i*0.6));
    }

  });

  $("#next_button").on('click', function () {
    LessonProgress++;
    $("#progress_bar_box").css({"width": ((LessonProgress / LessonLength) * 100) + "%"});
    DrawLessonWord(LessonProgress-1);

    const synth = new Tone.Synth().toDestination();
    const now = Tone.now();

    var toneX = $("#lesson_word").data("word_sound");
    var tones = toneX.split(",");

    for (var i=0; i<tones.length; i++) {
      synth.triggerAttackRelease(tones[i], "4n", now + (i*0.6));
    }

  });


    $("#reset_lesson").on('click', function () {

    const synth = new Tone.Synth().toDestination();
    const now = Tone.now();

    var toneX = "C4,D4,E4";
    var tones = toneX.split(",");


    for (var i=0; i<tones.length; i++) {
      synth.triggerAttackRelease(tones[i], "4n", now + (i*0.6));
    }

  });

  $("#skip_lesson").on('click', function () {

    LessonProgress += ($(".memory-card").length / 2);
    $("#progress_bar_box").css({"width": ((LessonProgress / (LessonLength)) * 100) + "%"});

    if (LessonProgress<LessonLength) {
    } else
    {
      alert("Lesson Complete!");
    }
  });

  $("#ballons").hide();
});

