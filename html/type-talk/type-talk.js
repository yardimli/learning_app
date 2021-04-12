var CorrectKey = "";


var WordAudio = "";
var nozoom = false;
var key_string = "";
var LessonString = "";
var LessonStringPos = 0;
var AllLetters = "ELKAİNOMUTÜYÖRIDSBZÇGŞCPHVĞFJ1234567890";

var AllWordsData;
var AlfaWords = [];
var CorrectWordAudio = "";
var CorrectWordString = "";

var Timeout1, Timeout2, Timeout3, Timeout4, Timeout5, Timeout6, Timeout7, Timeout8, Timeout9, Timeout10;
var LastLetterEntered = false;

var LessonParameters;
var LessonLanguage;
var LessonCategory;
var KeyboardSize;
var SpeakLetters;

var CurrentlyTypedString = "";

var AddWordToEndOfList = false;

function play_sound(mp3, playerid) {
  var AudioSrc = mp3;
  console.log("try to play: " + AudioSrc);

  $("#" + playerid + "_source").attr("src", AudioSrc);

  try {
    $("#" + playerid)[0].load();//suspends and restores all audio element
  } catch (e) {
    console.log("Error playing audio (1) " + AudioSrc);
  }

  //pause/stop audio
  try {
    var promise = document.querySelector("#" + playerid).pause();

    if (promise !== undefined) {
      promise.then(function (_) {
        console.log("audio paused!");

      }).catch(function (error) {
        console.log("pause was prevented!");
        console.log(error);
      });
    }
  } catch (e) {
    console.log("Error pausing media (6) ");
  }


  //play
  try {
    var promise = document.querySelector("#" + playerid).play();

    if (promise !== undefined) {
      promise.then(function (_) {
        console.log(" autoplay started!");
      }).catch(function (error) {
        console.log(" autoplay was prevented!");
        console.log(error);
      });
    }
  } catch (e) {
    console.log("Error playing media (5) " + player);
  }
}


function update_typing(InputKey) {
  console.log(InputKey);
  if (InputKey !== "!" && InputKey !== "|") {
    CurrentlyTypedString += InputKey;
  }

  if (InputKey === "|") { //backspace
    if (CurrentlyTypedString !== "") {
      CurrentlyTypedString = CurrentlyTypedString.slice(0, -1);
    }
    else {
      $('#SentenceTextDiv').children().last().remove();
    }
  }

  $("#WordsForLesson").html(CurrentlyTypedString);

  $("#WordSuggestionsForLesson").css({"position": "absolute", "bottom": ($("#sentence_div").outerHeight() + 5) + "px"});
  $("#WordSuggestionsForLesson").html("");
  var KeyboardActiveKeys = "";
  var WordsAdded = [];

  if (LessonLanguage === "tr") {
    $("#WordSuggestionsForLesson").css({"font-family": "Arial"});
    $("#WordsForLesson").css({"font-family": "Arial"});
  }
  if (LessonLanguage === "en") {
    $("#WordSuggestionsForLesson").css({"font-family": "Arial"});
    $("#WordsForLesson").css({"font-family": "Arial"});
  }
  if (LessonLanguage === "ch") {
    $("#WordSuggestionsForLesson").css({"font-family": "hanwangmingboldregular"});
    $("#WordsForLesson").css({"font-family": "hanwangmingboldregular"});
  }


  for (var i = 0; i < AllWordsData.length; i++) {
    if (LessonCategory.indexOf("-" + AllWordsData[i].categoryID + "-") !== -1) {
      var WordX = "";
      var WordX_ch = "";
      if (LessonLanguage === "tr") {
        WordX = AllWordsData[i].word_TR;
      }
      if (LessonLanguage === "en") {
        WordX = AllWordsData[i].word_EN;
      }
      if (LessonLanguage === "ch") {
        if (AllWordsData[i].bopomofo !== "" && AllWordsData[i].bopomofo !== null) {

          WordX_ch = AllWordsData[i].word_CH;
          // console.log(AllWordsData[i]);
          var wordX = AllWordsData[i].bopomofo;
          wordX = wordX.replace(" ", "");
          wordX = wordX.replace(" ", "");
          wordX = wordX.replace(" ", "");
          wordX = wordX.replace(" ", "");
          wordX = wordX.replace(" ", "");
          wordX = wordX.replace(":", "");
          wordX = wordX.replace("一", "ㄧ");

          // ㄧ in keyboard E3 84 A7
          // 一 from dictionary E4 B8 80
          var bopomofoX = AllWordsData[i].bopomofo;
          bopomofoX = bopomofoX.replace("一", "ㄧ");
          bopomofoX = bopomofoX.replace(":", "");

          WordX = wordX;
        }
      }

      if (WordX !== "") {
        if (CurrentlyTypedString === "") {
          KeyboardActiveKeys += WordX[0];
        }
        else if (WordX.indexOf(CurrentlyTypedString) === 0 && WordsAdded.indexOf(WordX) === -1) {
          console.log(" possible word: " + WordX + " (" + CurrentlyTypedString + "), key option: " + WordX[CurrentlyTypedString.length]);

          WordsAdded.push(WordX);

          if (LessonLanguage === "ch") {
            $("#WordSuggestionsForLesson").append("<div class='btn btn-primary WordSuggestion' style='display: inline-block; font-size: 32px; margin-right: 10px;' data-word_id='" + i + "'>" + WordX_ch + "</div>");
          }
          else {
            $("#WordSuggestionsForLesson").append("<div class='btn btn-primary WordSuggestion' style='display: inline-block; font-size: 32px; margin-right: 10px;' data-word_id='" + i + "'>" + WordX + "</div>");
          }
          KeyboardActiveKeys += WordX[CurrentlyTypedString.length];
        }
      }
    }
  }
//  console.log(KeyboardActiveKeys);

  var unique = KeyboardActiveKeys.split('').filter(function (item, i, ar) { return ar.indexOf(item) === i; }).join('');
  update_keyboard(unique, CorrectKey, 20000);
  $(".WordSuggestion").off('click touchstart').on('click touchstart', function () {
    console.log($(this).html() + " " + $(this).text());


    var CorrectWordAudio = "";
    if (LessonLanguage === "tr") {
      CorrectWordAudio = AllWordsData[parseInt($(this).data("word_id"), 10)].audio_TR;
    }
    if (LessonLanguage === "en") {
      CorrectWordAudio = AllWordsData[parseInt($(this).data("word_id"), 10)].audio_EN;
    }
    if (LessonLanguage === "ch") {
      CorrectWordAudio = AllWordsData[parseInt($(this).data("word_id"), 10)].audio_CH;
    }

    if (CorrectWordAudio !== "" && CorrectWordAudio !== null) {
      play_sound("poster://audio/" + LessonLanguage + "/" + CorrectWordAudio, "media_audio", false);
    }


    $("#SentenceTextDiv").append("<span>" + $(this).text() + "</span> ");
    CurrentlyTypedString = "";
    update_typing("!");
  });
}

$(document).ready(function () {

  LessonParameters = window.sendSyncCmd('get-lesson-parameters', '');
  LessonCategory = LessonParameters["category"];

  LessonLanguage = "ch";// LessonParameters["language"];
  SpeakLetters = "no";
  KeyboardSize = "medium";

  if (LessonLanguage === "tr") {
    $("#WordSuggestionsForLesson").css({"font-family": "Arial"});
    $("#WordsForLesson").css({"font-family": "Arial"});
  }
  if (LessonLanguage === "en") {
    $("#WordSuggestionsForLesson").css({"font-family": "Arial"});
    $("#WordsForLesson").css({"font-family": "Arial"});
  }
  if (LessonLanguage === "ch") {
    $("#WordSuggestionsForLesson").css({"font-family": "hanwangmingboldregular"});
    $("#WordsForLesson").css({"font-family": "hanwangmingboldregular"});
  }


  AllWordsData = JSON.parse(window.sendSyncCmd('get-all-words', ''));

  $("#WordSuggestionsForLesson").css({"position": "absolute", "bottom": ($("#sentence_div").outerHeight() + 5) + "px"});

  console.log(AllWordsData.length);


  for (var i = 0; i < AllWordsData.length; i++) {
    if (LessonCategory.indexOf("-" + AllWordsData[i].categoryID + "-") !== -1) {

      if (i < 10) {
        console.log(AllWordsData[i]);
      }
    }
  }

  var KeyboardPath = "../keyboard/mini_" + LessonLanguage + "_keyboard_" + KeyboardSize + ".html";

  $.ajax({
    url: KeyboardPath,
    success: function (data, status, jqXHR) {

      var dom = $(data);

      dom.filter('script').each(function () {
        if (this.src) {
          var script = document.createElement('script'), i, attrName, attrValue, attrs = this.attributes;
          for (i = 0; i < attrs.length; i++) {
            attrName = attrs[i].name;
            attrValue = attrs[i].value;
            script[attrName] = attrValue;
          }
          document.body.appendChild(script);
        }
        else {
          $.globalEval(this.text || this.textContent || this.innerHTML || '');
        }
      });

      $("#bottom-half").html(data);
      init_keyboard();
      CurrentlyTypedString = "";
      update_typing("!");

    }
  });

  document.addEventListener("virtual-keyboard-press", function (event) {
    if (event.detail.key !== "") {
      update_typing(event.detail.key);
    }
  });
});
