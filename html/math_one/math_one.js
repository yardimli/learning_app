var LessonProgress = 0;

var LowerCaseCard = true;

var media_audio_playing = false;
var media_audio2_playing = false;

var LessonLanguage;
var LessonParameters;
var LessonLength;
var LessonSectionLength;
var LessonRedoWrongAnswers = "yes";
var AddQuestionAgainToEndOfList = false;

var LessonType;
var LessonRange;
var CorrectAnswerBoolean = false;
var CurrentLessonType = 1;
var CorrectAnswerValue = "";

var MathProblemsArray = [];

var MathLessonArray = [];

var SpeakLetter = "yes";
var KeyboardSize = "large";

var duck_template = "";


//-----------------------------------------------------------------------------------------------------------
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

var _listener = function (playerid) {

  if (playerid.target.id === "media_audio") {
    media_audio_playing = false;
  }

  if (playerid.target.id === "media_audio2") {
    media_audio2_playing = false;
  }

  if (playerid.target.id === "media_audio") {
    if (CorrectAnswerBoolean) {
      $("#ballons").hide();

      LessonLength = MathLessonArray.length;
      CorrectAnswerBoolean = false;
      $("#progress_bar_box").css({"width": ((LessonProgress / (LessonLength)) * 100) + "%"});
    }
  }
};


//-----------------------------------------------------------------------------------------------------------
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}


//-----------------------------------------------------------------------------------------------------------
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


//-----------------------------------------------------------------------------------------------------------
function shuffle(array) {
  var m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

$.fn.randomize = function (selector) {
  var $elems = selector ? $(this).find(selector) : $(this).children(),
    $parents = $elems.parent();

  $parents.each(function () {
    $(this).children(selector).sort(function () {
      return Math.round(Math.random()) - 0.5;
      // }). remove().appendTo(this); // 2014-05-24: Removed `random` but leaving for reference. See notes under 'ANOTHER EDIT'
    }).detach().appendTo(this);
  });

  return this;
};

function duck_string(duck_id, number_of_ducks, duck_width = 40) {

  var text_align = "center";
  if (number_of_ducks >= 5) {
    text_align = "left"
  }
  var ducks_string = "<div id='" + duck_id + "' style='width:" + ((duck_width + 10) * 5) + "px; display: inline-block; vertical-align: top; text-align: " + text_align + ";'>";
  for (var i = 0; i < number_of_ducks; i++) {
    ducks_string += "<img src='" + duck_template.src + "' style='width:" + duck_width + "px; margin-right:10px; margin-bottom: 10px; vertical-align: top; ' />";
  }
  ducks_string += "</div>";
  return ducks_string;
}

function AskMathQuestion(QuestionNumber) {
  LessonLength = MathLessonArray.length;
  $("#progress_bar_box").css({"width": ((LessonProgress / (LessonLength)) * 100) + "%"});
  console.log(MathLessonArray[QuestionNumber]);


  AddQuestionAgainToEndOfList = false;

  duck_template = shuffle($(".target")).slice(0, 1)[0]; // document.getElementsByClassName("target")[0];
  console.log(duck_template);

  $("#MathQuestionDiv").html("");
  $("#MathAnswersDiv").html("");
  $("#MathAnswersDiv").show();

//  $("#MathQuestionDiv").html(MathLessonArray[QuestionNumber].a + " + " + MathLessonArray[QuestionNumber].b + " = <br>");

  var audio_file = "";
  var audio_file_correct = "";

  if (LessonLanguage === "en") {
    if (MathLessonArray[QuestionNumber].operator === "plus") {
      audio_file = "/math/en/" + MathLessonArray[QuestionNumber].a + "-plus-" + MathLessonArray[QuestionNumber].b + "-eq.mp3";
      audio_file_correct = "/math/en/" + MathLessonArray[QuestionNumber].a + "-plus-" + MathLessonArray[QuestionNumber].b + "-eq-" + MathLessonArray[QuestionNumber].sum + ".mp3";
    }

    if (MathLessonArray[QuestionNumber].operator === "minus") {
      audio_file = "/math/en/" + MathLessonArray[QuestionNumber].a + "-minus-" + MathLessonArray[QuestionNumber].b + "-eq.mp3";
      audio_file_correct = "/math/en/" + MathLessonArray[QuestionNumber].a + "-minus-" + MathLessonArray[QuestionNumber].b + "-eq-" + MathLessonArray[QuestionNumber].sum + ".mp3";
    }
  }

  if (LessonLanguage === "tr") {
    if (MathLessonArray[QuestionNumber].operator === "plus") {
      audio_file = "/math/tr/" + MathLessonArray[QuestionNumber].a + "-arti-" + MathLessonArray[QuestionNumber].b + "-eq.mp3";
      audio_file_correct = "/math/tr/" + MathLessonArray[QuestionNumber].a + "-arti-" + MathLessonArray[QuestionNumber].b + "-eq-" + MathLessonArray[QuestionNumber].sum + ".mp3";
    }

    if (MathLessonArray[QuestionNumber].operator === "minus") {
      audio_file = "/math/tr/" + MathLessonArray[QuestionNumber].a + "-eksi-" + MathLessonArray[QuestionNumber].b + "-eq.mp3";
      audio_file_correct = "/math/tr/" + MathLessonArray[QuestionNumber].a + "-eksi-" + MathLessonArray[QuestionNumber].b + "-eq-" + MathLessonArray[QuestionNumber].sum + ".mp3";
    }
  }

  if (LessonLanguage === "ch") {
    if (MathLessonArray[QuestionNumber].operator === "plus") {
      audio_file = "/math/ch/" + MathLessonArray[QuestionNumber].a + "-plus-" + MathLessonArray[QuestionNumber].b + "-eq.mp3";
      audio_file_correct = "/math/ch/" + MathLessonArray[QuestionNumber].a + "-plus-" + MathLessonArray[QuestionNumber].b + "-eq-" + MathLessonArray[QuestionNumber].sum + ".mp3";
    }

    if (MathLessonArray[QuestionNumber].operator === "minus") {
      audio_file = "/math/ch/" + MathLessonArray[QuestionNumber].a + "-minus-" + MathLessonArray[QuestionNumber].b + "-eq.mp3";
      audio_file_correct = "/math/ch/" + MathLessonArray[QuestionNumber].a + "-minus-" + MathLessonArray[QuestionNumber].b + "-eq-" + MathLessonArray[QuestionNumber].sum + ".mp3";
    }
  }

  play_sound("../../audio/" + audio_file, "media_audio");


  $("#MathQuestionDiv").append("<div class='question_div'><div class='text_style'>" + MathLessonArray[QuestionNumber].a + "</div>" + duck_string("question_a", MathLessonArray[QuestionNumber].a) + "</div>");

  if (MathLessonArray[QuestionNumber].operator === "plus") {
    $("#MathQuestionDiv").append("<div class='question_div'><div class='text_style'>+</div>");
  }

  if (MathLessonArray[QuestionNumber].operator === "minus") {
    $("#MathQuestionDiv").append("<div class='question_div'><div class='text_style'>-</div>");
  }

  $("#MathQuestionDiv").append("<div class='question_div'><div class='text_style'>" + MathLessonArray[QuestionNumber].b + "</div>" + duck_string("question_b", MathLessonArray[QuestionNumber].b) + "</div>");

  $("#MathQuestionDiv").append("<div class='question_div'><div  class='text_style'>=</div>");

  $("#MathQuestionDiv").append("<div class='question_div'><div id='correct_answer_div'><div  class='text_style'>" + MathLessonArray[QuestionNumber].sum + "</div>" + duck_string("question_sum", MathLessonArray[QuestionNumber].sum) + "</div></div>");


  var heights = $(".question_div").map(function () {
    return $(this).outerHeight();
  }).get();
  console.log(heights);

  var maxHeight = Math.max.apply(null, heights);

  $(".question_div").each(function () {
    $(this).css({"height": maxHeight + "px"});
  });


  $("#MathAnswersDiv").css({"top": ($("#MathQuestionDiv").height() + 70) + "px"})

  var CorrectAnswerBlock = "<div data-is_correct='yes' data-card_number='" + MathLessonArray[QuestionNumber].sum + "' class='correct_answer answer_divs'><div class='text_style'>" + MathLessonArray[QuestionNumber].sum + "</div>" + duck_string("", MathLessonArray[QuestionNumber].sum, 35) + "</div>";

  $("#MathAnswersDiv").append(CorrectAnswerBlock);

  var AllAnswers = [];

  AllAnswers.push(parseInt(MathLessonArray[QuestionNumber].sum, 10));

  for (var i = 0; i < 3; i++) {

    var RandomWrongAnswer = getRandomInt(1, LessonRange);
    while (AllAnswers.indexOf(RandomWrongAnswer) !== -1) {
      RandomWrongAnswer = getRandomInt(1, LessonRange);
    }
    AllAnswers.push(RandomWrongAnswer);

    var WrongAnswerBlock = "<div data-is_correct='no' data-card_number='" + RandomWrongAnswer + "' class='wrong_answer answer_divs'><div class='text_style'>" + RandomWrongAnswer + "</div>" + duck_string("", RandomWrongAnswer, 35) + "</div>";

    $("#MathAnswersDiv").append(WrongAnswerBlock);
  }

  var heights = $(".answer_divs").map(function () {
    return $(this).outerHeight();
  }).get();

  var maxHeight = Math.max.apply(null, heights);

  $(".answer_divs").each(function () {
    $(this).css({"height": maxHeight + "px"});
  });


  $("#MathAnswersDiv").shuffleChildren();

  $(".answer_divs").on('mousedown', function () {
    $(".answer_divs").removeClass("answer_divs_focus");
    $(this).addClass("answer_divs_focus");
  });

  $(".answer_divs").on('click', function () {

    $(".answer_divs").removeClass("answer_divs_focus");
    $(this).addClass("answer_divs_focus");

    if (LessonLanguage === "tr") {
      play_sound("../../audio/letters/tr/Default_" + $(this).data("card_number") + ".wav", "media_audio");
    }

    if (LessonLanguage === "en") {
      play_sound("../../audio/letters/en/" + $(this).data("card_number") + ".mp3", "media_audio");
    }

    if (LessonLanguage === "ch") {
      play_sound("../../audio/letters/ch/number_" + $(this).data("card_number") + "_ch.mp3", "media_audio");
    }

    if ($(this).data("is_correct") === "yes") {

      if (!$("#correct_answer_div").hasClass("is_answered")) {

        $("#correct_answer_div").addClass("is_answered");

        $("#correct_answer_div").css({"opacity": 1});

        var NextQuestionTimeout = 2000;

        if (!AddQuestionAgainToEndOfList) {
          $("#ballons").show();
          $("#ballons").addClass("balloons_hide");
          NextQuestionTimeout = 4000;
          setTimeout(function () {
            $("#MathAnswersDiv").fadeOut();
          }, 250);

          report_lesson("math_one", LessonLanguage, MathLessonArray[QuestionNumber].a + " + " + MathLessonArray[QuestionNumber].b + " = " + MathLessonArray[QuestionNumber].sum, 1);

          setTimeout(() => {
            $(".answer_divs").removeClass("answer_divs_focus");
            play_sound("../../audio/correct-sound/clap_2.mp3", "media_audio2", false);

          }, 1000);
        }
        else {
          report_lesson("math_one", LessonLanguage, MathLessonArray[QuestionNumber].a + " + " + MathLessonArray[QuestionNumber].b + " = " + MathLessonArray[QuestionNumber].sum, 0);

          setTimeout(function () {
            $("#MathAnswersDiv").fadeOut();
          }, 250);

          setTimeout(() => {
            play_sound("../../audio/correct-sound/bravo-" + Math.floor((Math.random() * 5) + 5) + ".mp3", "media_audio");
          }, 1000);
        }

        setTimeout(function () {
          $("#ballons").hide();
          play_sound("", "media_audio2", true);

          LessonProgress++;
          AskMathQuestion(LessonProgress);

        }, NextQuestionTimeout);
      }
    }
    else {

      if (!AddQuestionAgainToEndOfList && LessonRedoWrongAnswers) {
        AddQuestionAgainToEndOfList = true;
        MathLessonArray.push(MathLessonArray[QuestionNumber]);
      }

      setTimeout(() => {
        // $("#MathAnswersDiv").fadeOut();
        $(".answer_divs").removeClass("answer_divs_focus");
        $(".correct_answer").addClass("blink_corect_answer");
        play_sound("../../audio/wrong-sound/yanlis-15.mp3", "media_audio2", false);
        // $("#correct_answer_div").css({"opacity":1});

        setTimeout(() => {
          play_sound("../../audio/" + audio_file_correct, "media_audio");
          // $("#MathAnswersDiv").fadeIn();

        }, 1000);

      }, 1000);


    }

  });

}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function CorrectAnswer() {
  LessonProgress++;

  if (LessonType === "only_numbers") {
    CurrentLessonType = 1;
  }

  if (LessonType === "numbers_and_keyboard") {
    if (LessonProgress > LessonSectionLength) {
      CurrentLessonType = 2;
    }
    else {
      CurrentLessonType = 1;
    }
  }

  setTimeout(function () {
    $("#ballons").show();
    $("#ballons").addClass("balloons_hide");


    play_sound("../../audio/correct-sound/clap_2.mp3", "media_audio2");
    play_sound("../../audio/correct-sound/bravo-" + Math.floor((Math.random() * 5) + 5) + ".mp3", "media_audio");
    CorrectAnswerBoolean = true;

  }, 1000);
}

$(document).ready(function () {
    LessonParameters = window.sendSyncCmd('get-lesson-parameters', '');
    console.log(LessonParameters);
    LessonLanguage = LessonParameters["language"];
    LessonSectionLength = parseInt(LessonParameters["length"], 10);
    LessonType = LessonParameters["type"];
    LessonRange = parseInt(LessonParameters["range"], 10);
    CurrentLessonType = 1;
    LessonRedoWrongAnswers = LessonParameters["redo_wrong_answers"];

    var LoopTop = 10;
    if (LessonRange === 5 || LessonRange === 10) {
      LoopTop = 10;
    }
    if (LessonRange === 20) {
      LoopTop = 20;
    }


    if (LessonType === "addition" || LessonType === "both") {
      MathProblemsArray = [];
      for (var i = 1; i <= LoopTop; i++) {
        for (var j = 1; j <= LoopTop; j++) {
          if (i + j <= LessonRange) {
            MathProblemsArray.push({"a": i, "b": j, "operator": "plus", "sum": (i + j)});
          }
        }
      }

      if (LessonSectionLength === 1000) {
        // ask all math problems in the order created so will fill MathLessonArray later
      }
      else {
        while (MathLessonArray.length < LessonSectionLength) {
          j = getRandomInt(0, MathProblemsArray.length - 1);
          if (getRandomInt(0, 100) > 80) {
            MathLessonArray.push(MathProblemsArray[j]);
          }
        }
      }
    }

    if (LessonType === "subtraction" || LessonType === "both") {
      if (LessonSectionLength === 1000) {
        // ask all math problems in the order created so will fill MathLessonArray later
      }
      else {
        MathProblemsArray = [];
      }

      for (var i = 1; i <= LoopTop; i++) {
        for (var j = 1; j <= LoopTop; j++) {
          if (i - j <= LessonRange && (i - j >= 0)) {
            MathProblemsArray.push({"a": i, "b": j, "operator": "minus", "sum": (i - j)});
          }
        }
      }

      if (LessonSectionLength === 1000) {
        // ask all math problems in the order created so will fill MathLessonArray later
      }
      else {
        var temp_max_length = LessonSectionLength;
        if (LessonType === "both") {
          temp_max_length = LessonSectionLength * 2;
        }

        while (MathLessonArray.length < temp_max_length) {
          j = getRandomInt(0, MathProblemsArray.length - 1);
          if (getRandomInt(0, 100) > 80) {
            MathLessonArray.push(MathProblemsArray[j]);
          }
        }
      }
    }

    if (LessonSectionLength === 1000) {
      MathLessonArray = MathProblemsArray;
    }
    LessonLength = MathLessonArray.length;

    console.log(MathLessonArray);
    console.log(MathLessonArray.length);


    $("#ObjectsContainer").height($("#top-half").height() + "px");

    AskMathQuestion(LessonProgress);

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
      LessonProgress++;
      AskMathQuestion(LessonProgress);
      // CreateWordBoard();
    });

    $("#reset_lesson").on('click', function () {
      // CreateWordBoard();
    });


    $("#ballons").hide();


  }
);

