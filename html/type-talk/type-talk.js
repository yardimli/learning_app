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

var KeyboardPath;

var media_audio_playing = false;
var media_audio2_playing = false;

var SentenceFiles = [];
var SentenceIndex = 0;
var PlaySentence = false;

var _listener = function (playerid) {

  if (playerid.target.id === "media_audio") {
    media_audio_playing = false;

    if (PlaySentence) {
      $(".sentence_words").removeClass("word_highlight");
      SentenceIndex++;
      if (SentenceIndex > SentenceFiles.length) {
        PlaySentence = false;
        SentenceIndex = 0;
      }
      else {
        play_sound(SentenceFiles[SentenceIndex - 1], "media_audio", false);
      }
    }
  }

  if (playerid.target.id === "media_audio2") {
    media_audio2_playing = false;
  }
}


function play_sound(mp3, playerid, pause_play) {
  var AudioSrc = mp3;
  let promise;

  if (pause_play) {
    console.log("______________ STOP AUDIO " + playerid);
    if (playerid === "media_audio") {
      media_audio_playing = false;
    }

    if (playerid === "media_audio2") {
      media_audio2_playing = false;
    }

    //pause/stop audio
    try {
      promise = document.querySelector("#" + playerid).pause();

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
  }
  else {
    console.log("try to play: " + AudioSrc);
    $(".sentence_words").removeClass("word_highlight");

    if (PlaySentence) {
      $(".sentence_words").eq(SentenceIndex-1).addClass("word_highlight");
    }

    $("#" + playerid + "_source").attr("src", AudioSrc);

    if (playerid === "media_audio") {
      media_audio_playing = true;
    }

    if (playerid === "media_audio2") {
      media_audio2_playing = true;
    }


    try {
      $("#" + playerid)[0].load();//suspends and restores all audio element
    } catch (e) {
      if (playerid === "media_audio") {
        media_audio_playing = false;
      }

      if (playerid === "media_audio2") {
        media_audio2_playing = false;
      }
      console.log("Error playing audio (1) " + AudioSrc);
    }

    //pause/stop audio
    try {
      promise = document.querySelector("#" + playerid).pause();

      if (promise !== undefined) {
        promise.then(function (_) {
          console.log("audio paused!");
          if (playerid === "media_audio") {
            media_audio_playing = false;
          }

          if (playerid === "media_audio2") {
            media_audio2_playing = false;
          }

        }).catch(function (error) {
          console.log("pause was prevented!");
          console.log(error);
          if (playerid === "media_audio") {
            media_audio_playing = false;
          }

          if (playerid === "media_audio2") {
            media_audio2_playing = false;
          }
        });
      }
    } catch (e) {
      console.log("Error pausing media (6) ");
      if (playerid === "media_audio") {
        media_audio_playing = false;
      }

      if (playerid === "media_audio2") {
        media_audio2_playing = false;
      }
    }


    //play
    try {
      promise = document.querySelector("#" + playerid).play();

      document.querySelector("#" + playerid).removeEventListener('ended', _listener, true);
      document.querySelector("#" + playerid).addEventListener("ended", _listener, true);

      if (promise !== undefined) {
        promise.then(function (_) {
          console.log(" autoplay started!");
        }).catch(function (error) {
          console.log(" autoplay was prevented!");
          console.log(error);
          if (playerid === "media_audio") {
            media_audio_playing = false;
          }

          if (playerid === "media_audio2") {
            media_audio2_playing = false;
          }
        });
      }
    } catch (e) {
      console.log("Error playing media (5) " + playerid);
      if (playerid === "media_audio") {
        media_audio_playing = false;
      }

      if (playerid === "media_audio2") {
        media_audio2_playing = false;
      }
    }
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

  for (var i = 0; i < AllWordsData.length; i++) {
    if (LessonCategory.indexOf("-" + AllWordsData[i].categoryID + "-") !== -1) {
      var WordX = "";
      var WordX_ch = "";
      if (LessonLanguage === "tr" && AllWordsData[i].word_TR !== "" && AllWordsData[i].word_TR !== null) {
        var WordX = AllWordsData[i].word_TR.toLocaleUpperCase('tr-TR');
        WordX = WordX.replace(" ", "_");
      }

      if (LessonLanguage === "en" && AllWordsData[i].word_EN !== "" && AllWordsData[i].word_EN !== null) {
        var WordX = AllWordsData[i].word_EN.toLocaleUpperCase('en-US');
        WordX = WordX.replace(" ", "_");
      }

      if (LessonLanguage === "ch" && AllWordsData[i].word_CH !== "" && AllWordsData[i].word_CH !== null) {
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
      $("#SentenceTextDiv").append("<span class='sentence_words' data-word_id='" + $(this).data("word_id") + "' data-lang='tr'>" + $(this).text() + "</span> ");
    }

    if (LessonLanguage === "en") {
      CorrectWordAudio = AllWordsData[parseInt($(this).data("word_id"), 10)].audio_EN;
      $("#SentenceTextDiv").append("<span class='sentence_words' style='' data-word_id='" + $(this).data("word_id") + "' data-lang='en'>" + $(this).text() + "</span> ");
    }

    if (LessonLanguage === "ch") {
      CorrectWordAudio = AllWordsData[parseInt($(this).data("word_id"), 10)].audio_CH;
      $("#SentenceTextDiv").append("<span class='sentence_words' style='font-family: hanwangmingboldregular;' data-word_id='" + $(this).data("word_id") + "' data-lang='ch'>" + $(this).text() + "</span> ");
    }

    if (CorrectWordAudio !== "" && CorrectWordAudio !== null) {
      play_sound("poster://audio/" + LessonLanguage + "/" + CorrectWordAudio, "media_audio", false);
    }


    CurrentlyTypedString = "";
    update_typing("!");
  });
}

function keypress_event_function(event) {
  keyboard_re_enable_timeout = 250;
  if (event.detail.key !== "") {
    update_typing(event.detail.key);
  }
}

function LoadKeyboard() {

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

  $('#keyboard_scripts').remove();
  document.removeEventListener("virtual-keyboard-press", keypress_event_function);

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
          script.id = "keyboard_scripts";
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

  document.addEventListener("virtual-keyboard-press", keypress_event_function);

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


  $("#turkish_keyboard").on('click', function () {
    LessonLanguage = "tr";
    KeyboardPath = "../keyboard/mini_" + LessonLanguage + "_keyboard_" + KeyboardSize + ".html";
    LoadKeyboard();
  });

  $("#chinese_keyboard").on('click', function () {
    LessonLanguage = "ch";
    KeyboardPath = "../keyboard/mini_" + LessonLanguage + "_keyboard_" + KeyboardSize + ".html";
    LoadKeyboard();
  });

  $("#english_keyboard").on('click', function () {
    LessonLanguage = "en";
    KeyboardPath = "../keyboard/mini_" + LessonLanguage + "_keyboard_" + KeyboardSize + ".html";
    LoadKeyboard();
  });

  $("#keyboard_size").on('click', function () {
    if (KeyboardSize === "small") {
      KeyboardSize = "medium";
    }
    else if (KeyboardSize === "medium") {
      KeyboardSize = "large";
    }
    else if (KeyboardSize === "large") {
      KeyboardSize = "small";
    }
    KeyboardPath = "../keyboard/mini_" + LessonLanguage + "_keyboard_" + KeyboardSize + ".html";
    LoadKeyboard();

  });

  $("#speak_sentence").on('click', function () {

    SentenceFiles = [];
    $(".sentence_words").each(function () {

      if ($(this).data("lang") === "tr") {
        SentenceFiles.push( "poster://audio/" + $(this).data("lang") + "/" + AllWordsData[parseInt($(this).data("word_id"), 10)].audio_TR);
      }
      if ($(this).data("lang") === "en") {
        SentenceFiles.push( "poster://audio/" + $(this).data("lang") + "/" + AllWordsData[parseInt($(this).data("word_id"), 10)].audio_EN);
      }
      if ($(this).data("lang") === "ch") {
        SentenceFiles.push( "poster://audio/" + $(this).data("lang") + "/" + AllWordsData[parseInt($(this).data("word_id"), 10)].audio_CH);
      }
    });

    SentenceIndex=1;
    console.log(SentenceFiles);
    PlaySentence = true;
    play_sound(SentenceFiles[SentenceIndex-1],"media_audio", false);

    console.log(SentenceFiles);
  });

  $("#delete_sentence").on('click', function () {
    CurrentlyTypedString = "";
    $("#SentenceTextDiv").html("");

  });

    KeyboardPath = "../keyboard/mini_" + LessonLanguage + "_keyboard_" + KeyboardSize + ".html";
  LoadKeyboard();
});
