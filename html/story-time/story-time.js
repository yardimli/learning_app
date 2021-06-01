var CorrectKey = "";


var WordAudio = "";
var nozoom = false;
var key_string = "";
var LessonString = "";
var LessonStringPos = 0;
var AllLetters = "ELKAİNOMUTÜYÖRIDSBZÇGŞCPHVĞFJ1234567890";

var LessonLength = 11;
var LessonProgress = 0;

var AllStoryData;
var LessonStoryQuestionArray = [];
var CorrectWordAudio = "";
var CorrectWordString = "";

var Timeout1, Timeout2, Timeout3, Timeout4, Timeout5, Timeout6, Timeout7, Timeout8, Timeout9, Timeout10;

var LessonParameters;
var LessonLanguage;
var LessonCategory;
var SpeakLetters;
var LessonRedoWrongAnswers = "yes";

var AddWordToEndOfList = false;

$.fn.shuffleChildren = function () {
  $.each(this.get(), function (index, el) {
    var $el = $(el);
    var $find = $el.children();

    $find.sort(function () {
      return 0.5 - Math.random();
    });

    $el.empty();
    $find.appendTo($el);
  });
};


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


function randomColor() {
  let colorGen = "0123456789ABCDEF";
  let len = colorGen.length;
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += colorGen[Math.floor(Math.random() * len)];
  }

  return color;
}

function randomChar() {
  let letters = "123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPLKJHGFDSAZXCVBNM";
  let len = letters.length;
  let char = letters[Math.floor(Math.random() * len)];
  return char;
}


function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function CreateLesson(ArrayID) {
  AddWordToEndOfList = false;
  $("#WordSuggestionsForLesson").show();

  clearTimeout(Timeout1);
  clearTimeout(Timeout2);
  clearTimeout(Timeout3);
  clearTimeout(Timeout4);
  clearTimeout(Timeout5);
  clearTimeout(Timeout6);
  clearTimeout(Timeout7);
  clearTimeout(Timeout8);
  clearTimeout(Timeout9);
  clearTimeout(Timeout10);

  console.log(ArrayID);
  $("#ballons").hide();
  $("#story_div").show();
  $("#story_picture").attr('src', 'poster://pictures/story/' + AllStoryData[ LessonStoryQuestionArray[ArrayID].story_id ].picture);

  $("#story_title").html( AllStoryData[ LessonStoryQuestionArray[ArrayID].story_id ].title);
  $("#story_text").html(  AllStoryData[ LessonStoryQuestionArray[ArrayID].story_id ].story.replace(/\n/gi,"<br>"));

  play_sound("poster://audio/story/" + AllStoryData[ LessonStoryQuestionArray[ArrayID].story_id ].audio, "media_audio", false);

//  CorrectWordAudio = "poster://audio/" + LessonLanguage + "/" + AlfaWords[ArrayID].audio;

  CorrectWordString = "";
  LessonString = "";
  LessonStringPos = 0;
  CorrectKey = "";

}

function CorrectWordEntered() {
  $("#WordSuggestionsForLesson").hide();

  let BallonTimeout = 3000;
  if (!AddWordToEndOfList) {
    report_lesson("type_words " + LessonKeyboardRandom, LessonLanguage, CorrectWordString, 1);

    Timeout3 = setTimeout(function () {
      play_sound("../../audio/correct-sound/clap_2.mp3", "media_audio");
      $("#ballons").show();
      $("#ballons").addClass("balloons_hide");

    }, 3000);
    BallonTimeout = 6000;
  }
  else {
    report_lesson("type_words " + LessonKeyboardRandom, LessonLanguage, CorrectWordString, 0);
  }

  Timeout4 = setTimeout(function () {
    if (LessonProgress >= LessonLength) {
      alert("Lesson Finished!");
    }
    else {
      $("#WordSuggestionsForLesson").css({"position": "absolute", "bottom": ($("#WordsForLesson").outerHeight() + 5) + "px"});
      $("#WordSuggestionsForLesson").html("");
      $("#WordsForLesson").html("");
      LessonProgress++;
      CreateLesson($(".story_selected:eq(" + (LessonProgress - 1) + ")").data("id"));

      $("#ballons").hide();
    }
  }, BallonTimeout);

  $("#progress_bar_box").css({"width": ((LessonProgress / LessonLength) * 100) + "%"});
}

function CorrectAnswer(InputKey) {

  clearTimeout(Timeout1);
  clearTimeout(Timeout2);
  clearTimeout(Timeout3);
  clearTimeout(Timeout4);
  clearTimeout(Timeout5);
  clearTimeout(Timeout6);
  clearTimeout(Timeout7);
  clearTimeout(Timeout8);
  clearTimeout(Timeout9);
  clearTimeout(Timeout10);

  if (CorrectKey === InputKey) {
    $("#WordsForLesson").append(CorrectKey);
    console.log(LessonStringPos + " === " + (LessonString.length - 1) + " --" + LessonString + "---");

    if (CurrentlyTypedString === CorrectWordString) {
      // if (LessonStringPos === LessonString.length - 1) { //last letter of the word
      CorrectWordEntered();
    }
    else { //correct letter but not last, advance to next

      Timeout6 = setTimeout(function () {
        play_sound("../../audio/correct-sound/bravo-" + Math.floor((Math.random() * 5) + 5) + ".mp3", "media_audio2");
      }, 1000);


      LessonStringPos++;

      CorrectKey = LessonString[LessonStringPos];

      // play_sound("../../audio/correct-sound/bravo-6.mp3", "media_audio2");

    }
  }
  else { //wrong letter pressed


    if (!AddWordToEndOfList && LessonRedoWrongAnswers === "yes") {

      LessonStoryQuestionArray.push( LessonStoryQuestionArray[LessonProgress] );
      LessonLength = LessonStoryQuestionArray.length;
      AddWordToEndOfList = true;
    }

    console.log("Wrong Letter: " + InputKey);
    Timeout8 = setTimeout(function () {
//              play_sound("../../audio/wrong-sound/wrong-answer-short-buzzer-double-01.mp3");
      play_sound("../../audio/wrong-sound/yanlis-" + Math.floor((Math.random() * 7) + 8) + ".mp3", "media_audio2");
    }, 700);

    Timeout9 = setTimeout(function () {
//              play_sound("../../audio/wrong-sound/wrong-answer-short-buzzer-double-01.mp3");
      play_sound(CorrectWordAudio, "media_audio", false);
    }, 1700);
  }
}

$(document).ready(function () {

  LessonParameters = window.sendSyncCmd('get-lesson-parameters', '');

  LessonLanguage = LessonParameters["language"];
  LessonCategory = LessonParameters["category"];
  SpeakLetters = LessonParameters["speak_letters"];

  LessonRedoWrongAnswers = LessonParameters["redo_wrong_answers"];

  if (typeof LessonRedoWrongAnswers === "undefined") {
    LessonRedoWrongAnswers = "yes";
  }

  // if (LessonLanguage === "tr") {
  //   $("#WordSuggestionsForLesson").css({"font-family": "Arial"});
  //   $("#WordsForLesson").css({"font-family": "Arial"});
  // }
  // if (LessonLanguage === "en") {
  //   $("#WordSuggestionsForLesson").css({"font-family": "Arial"});
  //   $("#WordsForLesson").css({"font-family": "Arial"});
  // }
  // if (LessonLanguage === "ch") {
  //   $("#WordSuggestionsForLesson").css({"font-family": "hanwangmingboldregular"});
  //   $("#WordsForLesson").css({"font-family": "hanwangmingboldregular"});
  // }

  AllStoryData = JSON.parse(window.sendSyncCmd('get-all-story', ''));

  $("#WordSuggestionsForLesson").css({"position": "absolute", "bottom": ($("#WordsForLesson").outerHeight() + 5) + "px"});

  console.log(AllStoryData.length);


  for (var i = 0; i < AllStoryData.length; i++) {
    $("#story_grid").append("<div data-id='" + i + "' class='story_select'><img src='poster://pictures/story/" + AllStoryData[i].picture + "'  class='story_select_image'><div style='background-color: #6666aa; color:white; text-align: center; padding:5px; border-radius: 4px;'>" + AllStoryData[i].title + "</div></div>");
  }

  $(".story_select").on('click', function () {
    console.log($(this).data("id"));
    $(this).toggleClass("story_selected");
  });


  $("#ballons").hide();



  $("#BeginLesson").on('click', function () {
    $("#BeginLesson").hide();
    $("#story_grid").hide();

    $(".story_selected").each(function () {
      var story_id = parseInt($(this).data("id"), 10);
      console.log(AllStoryData[story_id]);
      for (var i = 0; i < AllStoryData[story_id].questions.length; i++) {
//        console.log( AllStoryData[story_id].questions[i].question );
        LessonStoryQuestionArray.push( { "story_id" : story_id, "question_id" : i, "done" : false } );
      }
      console.log(LessonStoryQuestionArray);
    });
    LessonLength = LessonStoryQuestionArray.length;

    LessonProgress++;
    console.log(LessonProgress);
    console.log($(".story_selected:eq(" + (LessonProgress - 1) + ")"));
    console.log($(".story_selected:eq(" + (LessonProgress - 1) + ")").data("id"));
    CreateLesson(LessonProgress-1);
  });

});
