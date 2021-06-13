var LessonProgress = 0;
var BuildLessonCorrectKey;
var CurrentWordCardArrayPos = 0;
var PictureHintTimeout;

var LowerCaseCard = true;

var GuessPictureSpellingLesson = false;
var GuessPictureSpellingCorrect = false;
var GuessPictureCount = 0;
var GuessPictureCorrectWordAudio = "";
var GuessPictureSpellingFirstPlay = false;
var GuessSelectedPicture;
var GuessPictureFirstCorrect = "";

var AllWordsData;
var AlfaWords = [];

var LessonCategories;
var LessonLanguage;
var LessonParameters;
var LessonLength;

function CreateWordBoard() {
  $("#WordContainer").show();
  $("#CorrectWordContainer").show();
  play_sound("", "media_audio2", true);

  GuessPictureCount++;

  GuessPictureSpellingLesson = true;
  GuessPictureSpellingFirstPlay = true;
  GuessPictureFirstCorrect = "";

  var WordList = "";

  var WordX = AlfaWords[CurrentWordCardArrayPos].word1.toLocaleUpperCase('tr-TR');
  if (LowerCaseCard) {
    WordX = capitalize_tr(AlfaWords[CurrentWordCardArrayPos].word1);
  }

  CurrentWordCardArrayPos++;
  GuessPictureCorrectWordAudio = "../../audio/opposites/" + LessonLanguage + "/" + AlfaWords[CurrentWordCardArrayPos].question_audio;


  if (LessonLanguage === "ch") {
    $("#CorrectWordContainer").html("<div style='font-size: 50px; color:white; font-weight: bold; text-align: center; font-family: hanwangmingboldregular;'>" + AlfaWords[CurrentWordCardArrayPos].question + "</div>");
  }
  else {
    $("#CorrectWordContainer").html("<div style='font-size: 50px; color:white; font-weight: bold; text-align: center'>" + AlfaWords[CurrentWordCardArrayPos].question + "</div>");
  }

  play_sound(GuessPictureCorrectWordAudio, "media_audio", false);

  $("#WordContainer").html("");


  $("#WordContainer").append("<div class='word_card' data-word_id='" + CurrentWordCardArrayPos + "' data-word_number='1' data-correct='yes' data-word_audio='" + "../../audio/opposites/" + LessonLanguage + "/" + AlfaWords[CurrentWordCardArrayPos].audio1 + "' style='margin-left: 50px; margin-right: 50px;'>" + "<div style='font-size: 50px; color:black; font-weight: bold; text-align: center;' class='Opacity0 picture-hints'>" + AlfaWords[CurrentWordCardArrayPos].word1 + "</div>" + "<img src=\"../../pictures/opposites/" + AlfaWords[CurrentWordCardArrayPos].image1 + "\" alt=\"" + AlfaWords[CurrentWordCardArrayPos].word1 + "\" style='max-width:350px;' /></div>");


  $("#WordContainer").append("<div class='word_card' data-word_id='" + CurrentWordCardArrayPos + "' data-word_number='2' data-correct='no' data-word_audio='" + "../../audio/opposites/" + LessonLanguage + "/" + AlfaWords[CurrentWordCardArrayPos].audio2 + "' style='margin-left: 50px; margin-right: 50px;'>" + "<div style='font-size: 50px; color:black; font-weight: bold; text-align: center;' class='Opacity0 picture-hints'>" + AlfaWords[CurrentWordCardArrayPos].word2 + "</div>" + "<img src=\"../../pictures/opposites/" + AlfaWords[CurrentWordCardArrayPos].image2 + "\" alt=\"" + AlfaWords[CurrentWordCardArrayPos].word2 + "\" style='max-width:350px; ' /></div>");

  var WordX = AlfaWords[CurrentWordCardArrayPos].word1.toLocaleUpperCase('tr-TR');
  if (LowerCaseCard) {
    WordX = capitalize_tr(AlfaWords[CurrentWordCardArrayPos].word1);
  }

  clearTimeout(PictureHintTimeout);
  PictureHintTimeout = setTimeout(function () {
    $(".picture-hints").addClass("Opacity1");
  }, 9000);

  $("#WordContainer").shuffleChildren();
  $(".word_card").hide();

  $(".word_card").off().on('click touchstart', function () {
    if (!media_audio_playing && !media_audio2_playing) {
      $(".word_card").addClass("LowOpacity");
      $(this).removeClass("LowOpacity");
      $(this).addClass("word_card-active");
      play_sound($(this).data("word_audio"), "media_audio", false);

      GuessPictureSpellingCorrect = $(this).data("correct") === "yes";
      if (GuessPictureSpellingCorrect) {
        $(".picture-hints").addClass("Opacity1");
      }
      if (GuessPictureFirstCorrect === "") {
        GuessPictureFirstCorrect = GuessPictureSpellingCorrect;
      }
      GuessSelectedPicture = this;
    }
  });
}


//---------------------------------------------------------------
var _listener = function (playerid) {

  if (playerid.target.id === "media_audio") {
    media_audio_playing = false;
  }

  if (playerid.target.id === "media_audio2") {
    media_audio2_playing = false;
  }


  if (playerid.target.id === "media_audio") {
    if (GuessPictureSpellingLesson) {
      if (GuessPictureSpellingFirstPlay) {
        $(".word_card").fadeIn();
        GuessPictureSpellingFirstPlay = false;
      }
      else {

        if (GuessPictureSpellingCorrect) {

          GuessPictureSpellingCorrect = false;

          LessonProgress++;
          $("#progress_bar_box").css({"width": ((LessonProgress / (LessonLength)) * 100) + "%"});

          if (GuessPictureFirstCorrect) {

            var word_to_report = "";
            word_to_report = AlfaWords[parseInt($(GuessSelectedPicture).data("word_id"), 10)].correct_word;
            report_lesson("opposites", LessonLanguage, word_to_report, 1);

            play_sound("../../audio/correct-sound/clap_2.mp3", "media_audio2", false);

            setTimeout(function () {
              // play_sound("../../audio/correct-sound/bravo-" + Math.floor((Math.random() * 10) + 1) + ".mp3", "media_audio2");

              $("#ballons").show();
              $("#ballons").addClass("balloons_hide");

            }, 400);

            setTimeout(function () {
              $("#ballons").hide();

              LowerCaseCard = (Math.random() * 100 > 30);
              CreateWordBoard();

            }, 3000);
          }
          else {
            play_sound("../../audio/correct-sound/bravo-" + Math.floor((Math.random() * 10) + 1) + ".mp3", "media_audio2", false);

            setTimeout(function () {
              LowerCaseCard = (Math.random() * 100 > 30);
              CreateWordBoard();

            }, 1200);
          }
        }
        else {

          var word_to_report = "";
          word_to_report = AlfaWords[parseInt($(GuessSelectedPicture).data("word_id"), 10)].correct_word;
          report_lesson("opposites", LessonLanguage, word_to_report, 0);

          $("#CorrectWordContainer").fadeOut();
          play_sound("../../audio/wrong-sound/yanlis-15.mp3", "media_audio2", false);
          setTimeout(function () {
            play_sound(GuessPictureCorrectWordAudio, "media_audio2", false);
            $("#CorrectWordContainer").fadeIn();
          }, 1000);
          setTimeout(function () {
            $(".word_card").removeClass("LowOpacity");
            $(".word_card").removeClass("word_card-active");
            $(GuessSelectedPicture).css('opacity', 0.1);
          }, 1400);
        }
      }
    }
  }
};


function InitLesson() {
  shuffleArray(AlfaWords);
  LowerCaseCard = (Math.random() * 100 > 30);
  CreateWordBoard();
}

$(document).ready(function () {
  LessonParameters = window.sendSyncCmd('get-lesson-parameters', '');
  console.log(LessonParameters);
  LessonLanguage = LessonParameters["language"];

  console.log(window.sendSyncCmd('get-all-opposites', ''));

  AllWordsData = JSON.parse(window.sendSyncCmd('get-all-opposites', ''));

  for (var i = 0; i < AllWordsData.length; i++) {
    if (AllWordsData[i].Turkish1 !== "" && AllWordsData[i].Turkish1 !== null && AllWordsData[i].Turkish2 !== "" && AllWordsData[i].Turkish2 !== null && LessonLanguage === "tr") {
      AlfaWords.push({
        "correct_word": AllWordsData[i].Turkish1,
        "question": "Hangisi " + AllWordsData[i].Turkish1 + "?", "question_audio": "opposite_" + AllWordsData[i].ID + "_1_q_tr.mp3",
        "word1": AllWordsData[i].Turkish1, "image1": AllWordsData[i].Picture1, "audio1": "opposite_" + AllWordsData[i].ID + "_1_tr.mp3",
        "word2": AllWordsData[i].Turkish2, "image2": AllWordsData[i].Picture2, "audio2": "opposite_" + AllWordsData[i].ID + "_2_tr.mp3"
      });


      AlfaWords.push({
        "correct_word": AllWordsData[i].Turkish2,
        "question": "Hangisi " + AllWordsData[i].Turkish2 + "?", "question_audio": "opposite_" + AllWordsData[i].ID + "_2_q_tr.mp3",
        "word1": AllWordsData[i].Turkish2, "image1": AllWordsData[i].Picture2, "audio1": "opposite_" + AllWordsData[i].ID + "_2_tr.mp3",
        "word2": AllWordsData[i].Turkish1, "image2": AllWordsData[i].Picture1, "audio2": "opposite_" + AllWordsData[i].ID + "_1_tr.mp3"
      });
    }

    if (AllWordsData[i].English1 !== "" && AllWordsData[i].English1 !== null && AllWordsData[i].English2 !== "" && AllWordsData[i].English2 !== null && LessonLanguage === "en") {
      AlfaWords.push({
        "correct_word": AllWordsData[i].English1,
        "question": "Which on is " + AllWordsData[i].English1 + "?", "question_audio": "opposite_" + AllWordsData[i].ID + "_1_q_en.mp3",
        "word1": AllWordsData[i].English1, "image1": AllWordsData[i].Picture1, "audio1": "opposite_" + AllWordsData[i].ID + "_1_en.mp3",
        "word2": AllWordsData[i].English2, "image2": AllWordsData[i].Picture2, "audio2": "opposite_" + AllWordsData[i].ID + "_2_en.mp3"
      });


      AlfaWords.push({
        "correct_word": AllWordsData[i].English2,
        "question": "Which on is " + AllWordsData[i].English2 + "?", "question_audio": "opposite_" + AllWordsData[i].ID + "_2_q_en.mp3",
        "word1": AllWordsData[i].English2, "image1": AllWordsData[i].Picture2, "audio1": "opposite_" + AllWordsData[i].ID + "_2_en.mp3",
        "word2": AllWordsData[i].English1, "image2": AllWordsData[i].Picture1, "audio2": "opposite_" + AllWordsData[i].ID + "_1_en.mp3"
      });
    }

    if (AllWordsData[i].Chinese1 !== "" && AllWordsData[i].Chinese1 !== null && AllWordsData[i].Chinese2 !== "" && AllWordsData[i].Chinese2 !== null && LessonLanguage === "ch") {
      AlfaWords.push({
        "correct_word": AllWordsData[i].Chinese1,
        "question": AllWordsData[i].Question1_CH, "question_audio": "opposite_" + AllWordsData[i].ID + "_1_q_ch.mp3",
        "word1": AllWordsData[i].Chinese1, "image1": AllWordsData[i].Picture1, "audio1": "opposite_" + AllWordsData[i].ID + "_1_ch.mp3",
        "word2": AllWordsData[i].Chinese2, "image2": AllWordsData[i].Picture2, "audio2": "opposite_" + AllWordsData[i].ID + "_2_ch.mp3"
      });


      AlfaWords.push({
        "correct_word": AllWordsData[i].Chinese2,
        "question": AllWordsData[i].Question2_CH, "question_audio": "opposite_" + AllWordsData[i].ID + "_2_q_ch.mp3",
        "word1": AllWordsData[i].Chinese2, "image1": AllWordsData[i].Picture2, "audio1": "opposite_" + AllWordsData[i].ID + "_2_ch.mp3",
        "word2": AllWordsData[i].Chinese1, "image2": AllWordsData[i].Picture1, "audio2": "opposite_" + AllWordsData[i].ID + "_1_ch.mp3"
      });
    }
  }
  LessonLength = (AlfaWords.length + 1);

  InitLesson();


  $(document).on("contextmenu", function (e) {
    return false;
  });

  $(window).bind(
    'touchmove',
    function (e) {
      e.preventDefault();
    }
  );

  $("#skip_lesson").on('click', function () {
    LowerCaseCard = (Math.random() * 100 > 30);
    CreateWordBoard();
  });

  $("#reset_lesson").on('click', function () {
    GuessPictureCount--;
    LowerCaseCard = (Math.random() * 100 > 30);
    CreateWordBoard();
  });

  $("#ballons").hide();


});