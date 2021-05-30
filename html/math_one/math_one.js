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
var LessonShowIcons = "yes";

var LessonType;
var LessonRange;
var LessonBottomRange = 0;
var LessonTopRange = 0;
var LessonSumBottomRange = 0;
var LessonSumTopRange = 0;

var CorrectAnswerBoolean = false;
var CorrectAnswerValue = "";

var MathLessonArray = [];

var SpeakLetter = "yes";
var KeyboardSize = "large";

var duck_template = "";
var duck_row = 5;
var duck_width_question = 40;
var duck_width_answer = 35;

var duck_height_question = 0;
var duck_height_answer = 0;


var PlayArrayList = [];
var PlayArrayIndex = 0;
var PlayArray = false;

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

  if (PlayArray) {
    if (PlayArrayIndex < PlayArrayList.length - 1) {
      PlayArrayIndex++;
      play_sound(PlayArrayList[PlayArrayIndex], "media_audio");
    }
    else {
      PlayArray = false;
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

function duck_string(duck_id, number_of_ducks, duck_width = 40, duck_height = 0, duck_row = 5) {


  var text_align = "center";
  if (number_of_ducks >= duck_row) {
    text_align = "left"
  }

  var duck_margin = 5;
  if (duck_row < 10) {
    duck_margin = 10;
  }

  var duck_height_str = "";
  if (duck_height > 0) {
    duck_height_str = " height:" + duck_height + "px; ";
  }

  if (LessonShowIcons !== "yes") {
    var ducks_string = "<div id='" + duck_id + "' style='width:" + ((duck_width + duck_margin) * duck_row) + "px; display: inline-block; vertical-align: top; text-align: " + text_align + "; height: 75px;'></div>";
  }
  else {

    var ducks_string = "<div id='" + duck_id + "' style='width:" + ((duck_width + duck_margin) * duck_row) + "px; display: inline-block; vertical-align: top; text-align: " + text_align + ";'>";
    for (var i = 0; i < number_of_ducks; i++) {
      ducks_string += "<img src='" + duck_template.src + "' style='width:" + duck_width + "px; " + duck_height_str + " margin-right:" + duck_margin + "px; margin-bottom: 10px; vertical-align: top; ' />";
    }
    ducks_string += "</div>";
  }
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

  var audio_file_correct = "";


  PlayArrayList[0] = "../../audio/math/" + LessonLanguage + "/" + MathLessonArray[QuestionNumber].a + ".mp3";
  PlayArrayList[1] = "../../audio/math/" + LessonLanguage + "/" + MathLessonArray[QuestionNumber].operator + ".mp3";
  PlayArrayList[2] = "../../audio/math/" + LessonLanguage + "/" + MathLessonArray[QuestionNumber].b + ".mp3";
  PlayArrayList[3] = "../../audio/math/" + LessonLanguage + "/equals.mp3";
  // PlayArrayList[4] = "../../audio/math/"+LessonLanguage+"/"+MathLessonArray[QuestionNumber].sum+".mp3";

  audio_file_correct = "/math/" + LessonLanguage + "/" + MathLessonArray[QuestionNumber].sum + ".mp3";

  PlayArrayIndex = 0;
  PlayArray = true;
  play_sound(PlayArrayList[PlayArrayIndex], "media_audio");


  $("#MathQuestionDiv").append("<div class='question_div'><div class='text_style'>" + MathLessonArray[QuestionNumber].a + "</div>" + duck_string("question_a", MathLessonArray[QuestionNumber].a, duck_width_question, duck_height_question, duck_row) + "</div>");

  if (MathLessonArray[QuestionNumber].operator === "plus") {
    $("#MathQuestionDiv").append("<div class='question_div'><div class='text_style'>+</div>");
  }

  if (MathLessonArray[QuestionNumber].operator === "minus") {
    $("#MathQuestionDiv").append("<div class='question_div'><div class='text_style'>-</div>");
  }

  if (MathLessonArray[QuestionNumber].operator === "times") {
    $("#MathQuestionDiv").append("<div class='question_div'><div class='text_style'>*</div>");
  }

  if (MathLessonArray[QuestionNumber].operator === "divided-by") {
    $("#MathQuestionDiv").append("<div class='question_div'><div class='text_style'>&#247;</div>");
  }

  $("#MathQuestionDiv").append("<div class='question_div'><div class='text_style'>" + MathLessonArray[QuestionNumber].b + "</div>" + duck_string("question_b", MathLessonArray[QuestionNumber].b, duck_width_question, duck_height_question, duck_row) + "</div>");

  $("#MathQuestionDiv").append("<div class='question_div'><div  class='text_style'>=</div>");

  $("#MathQuestionDiv").append("<div class='question_div'><div id='correct_answer_div'><div  class='text_style'>" + MathLessonArray[QuestionNumber].sum + "</div>" + duck_string("question_sum", MathLessonArray[QuestionNumber].sum, duck_width_question, duck_height_question, duck_row) + "</div></div>");


  var heights = $(".question_div").map(function () {
    return $(this).outerHeight();
  }).get();
  console.log(heights);
  var maxHeight = Math.max.apply(null, heights);

  $(".question_div").each(function () {
    $(this).css({"height": maxHeight + "px"});
  });


  $("#MathAnswersDiv").css({"top": ($("#MathQuestionDiv").height() + 70) + "px"})

  var AllAnswers = [];

  AllAnswers.push(parseInt(MathLessonArray[QuestionNumber].sum, 10));

  for (var i = 0; i < 3; i++) {

    var RandomWrongAnswer = getRandomInt(1, LessonSumTopRange);
    while (AllAnswers.indexOf(RandomWrongAnswer) !== -1) {
      RandomWrongAnswer = getRandomInt(1, LessonSumTopRange);
    }
    AllAnswers.push(RandomWrongAnswer);

    var WrongAnswerBlock = "<div data-is_correct='no' data-card_number='" + RandomWrongAnswer + "' class='wrong_answer answer_divs'><div class='text_style'>" + RandomWrongAnswer + "</div>" + duck_string("", RandomWrongAnswer, duck_width_answer, duck_height_answer, duck_row) + "</div>";

    $("#MathAnswersDiv").append(WrongAnswerBlock);
  }

  var CorrectAnswerBlock = "<div data-is_correct='yes' data-card_number='" + MathLessonArray[QuestionNumber].sum + "' class='correct_answer answer_divs'><div class='text_style'>" + MathLessonArray[QuestionNumber].sum + "</div>" + duck_string("", MathLessonArray[QuestionNumber].sum, duck_width_answer, duck_height_answer, duck_row) + "</div>";

  $("#MathAnswersDiv").append(CorrectAnswerBlock);

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

    PlayArray = false;

    var audio_file_number = "/math/" + LessonLanguage + "/" + $(this).data("card_number") + ".mp3";
    play_sound("../../audio/" + audio_file_number, "media_audio");

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

          report_lesson("math_one", LessonLanguage, MathLessonArray[QuestionNumber].a + " " + MathLessonArray[QuestionNumber].operator + " " + MathLessonArray[QuestionNumber].b + " = " + MathLessonArray[QuestionNumber].sum, 1);

          setTimeout(() => {
            $(".answer_divs").removeClass("answer_divs_focus");
            play_sound("../../audio/correct-sound/clap_2.mp3", "media_audio2", false);

          }, 1000);
        }
        else {
          report_lesson("math_one", LessonLanguage, MathLessonArray[QuestionNumber].a + " " + MathLessonArray[QuestionNumber].operator + " " + MathLessonArray[QuestionNumber].b + " = " + MathLessonArray[QuestionNumber].sum, 0);

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
    LessonRedoWrongAnswers = LessonParameters["redo_wrong_answers"];

    LessonShowIcons = LessonParameters["show_icons"];

    if (LessonRange === 1) {
      LessonBottomRange = 1;
      LessonTopRange = 5;
      LessonSumBottomRange = 2;
      LessonSumTopRange = 10;
      duck_row = 5;
      duck_width_question = 40;
      duck_width_answer = 35;
    }

    if (LessonRange === 2) {
      LessonBottomRange = 1;
      LessonTopRange = 9;
      LessonSumBottomRange = 2;
      LessonSumTopRange = 10;
      duck_row = 5;
      duck_width_question = 40;
      duck_width_answer = 35;
    }

    if (LessonRange === 3) {
      LessonBottomRange = 1;
      LessonTopRange = 19;
      LessonSumBottomRange = 2;
      LessonSumTopRange = 20;
      duck_row = 5;
      duck_width_question = 40;
      duck_width_answer = 35;
    }

    if (LessonRange === 4) {
      LessonBottomRange = 1;
      LessonTopRange = 29;
      LessonSumBottomRange = 2;
      LessonSumTopRange = 30;
      duck_row = 10;
      duck_width_question = 26;
      duck_width_answer = 22;
    }

    if (LessonRange === 5) {
      LessonBottomRange = 1;
      LessonTopRange = 39;
      LessonSumBottomRange = 2;
      LessonSumTopRange = 40;
      duck_row = 10;
      duck_width_question = 26;
      duck_width_answer = 22;
    }

    if (LessonRange === 6) {
      LessonBottomRange = 1;
      LessonTopRange = 49;
      LessonSumBottomRange = 2;
      LessonSumTopRange = 50;
      duck_row = 10;
      duck_width_question = 26;
      duck_width_answer = 22;
      duck_height_question = 15;
      duck_height_answer = 15;
    }

    if (LessonRange === 7) {
      LessonBottomRange = 1;
      LessonTopRange = 99;
      LessonSumBottomRange = 2;
      LessonSumTopRange = 100;
      duck_row = 10;
      duck_width_question = 26;
      duck_width_answer = 22;
      duck_height_question = 15;
      duck_height_answer = 15;
    }


    if (LessonRange === 8) {
      LessonBottomRange = 2;
      LessonTopRange = 29;
      LessonSumBottomRange = 2;
      LessonSumTopRange = 1000;
      duck_row = 10;
      duck_width_question = 26;
      duck_width_answer = 22;
      duck_height_question = 15;
      duck_height_answer = 15;
      LessonShowIcons = "no";
    }

    if (LessonRange === 9) {
      LessonBottomRange = 2;
      LessonTopRange = 99;
      LessonSumBottomRange = 2;
      LessonSumTopRange = 200;
      duck_row = 10;
      duck_width_question = 26;
      duck_width_answer = 22;
      duck_height_question = 15;
      duck_height_answer = 15;
      LessonShowIcons = "no";
    }


    if (LessonRange === 10) {
      LessonBottomRange = 2;
      LessonTopRange = 199;
      LessonSumBottomRange = 2;
      LessonSumTopRange = 200;
      duck_row = 10;
      duck_width_question = 26;
      duck_width_answer = 22;
      duck_height_question = 15;
      duck_height_answer = 15;
      LessonShowIcons = "no";
    }


    if (LessonRange === 11) {
      LessonBottomRange = 2;
      LessonTopRange = 199;
      LessonSumBottomRange = 50;
      LessonSumTopRange = 400;
      duck_row = 10;
      duck_width_question = 26;
      duck_width_answer = 22;
      duck_height_question = 15;
      duck_height_answer = 15;
      LessonShowIcons = "no";
    }

    var num_a = 0;
    var num_b = 0;
    if (LessonType === "multiplication" || LessonType === "both2") {
      while (MathLessonArray.length < LessonSectionLength) {
        num_a = getRandomInt(LessonBottomRange, LessonTopRange + 1);
        num_b = getRandomInt(LessonBottomRange, LessonTopRange + 1);
        if ((num_a * num_b <= LessonSumTopRange) && (num_a * num_b >= LessonSumBottomRange)) {
          MathLessonArray.push({"a": num_a, "b": num_b, "operator": "times", "sum": (num_a * num_b)});
        }
      }
    }

    if (LessonType === "division" || LessonType === "both2") {
      if (LessonType === "both2") {
        LessonSectionLength = LessonSectionLength * 2;
      }
      while (MathLessonArray.length < LessonSectionLength) {
        num_a = getRandomInt(LessonSumBottomRange, LessonSumTopRange + 1);
        num_b = getRandomInt(LessonBottomRange, LessonTopRange + 1);
        if ((num_a / num_b <= LessonSumTopRange) && (num_a % num_b === 0) && (num_a / num_b >= LessonSumBottomRange)) {
          MathLessonArray.push({"a": num_a, "b": num_b, "operator": "divided-by", "sum": (num_a / num_b)});
        }
      }
    }


    if (LessonType === "addition" || LessonType === "both") {
      var while_break = 0;
      while (MathLessonArray.length < LessonSectionLength && while_break < 100) {
        while_break++;
        num_a = getRandomInt(LessonBottomRange, LessonTopRange + 1);
        num_b = getRandomInt(LessonBottomRange, LessonTopRange + 1);
        if ((num_a + num_b <= LessonSumTopRange) && (num_a + num_b >= LessonSumBottomRange)) {
          MathLessonArray.push({"a": num_a, "b": num_b, "operator": "plus", "sum": (num_a + num_b)});
        }
      }
    }

    if (LessonType === "subtraction" || LessonType === "both") {
      if (LessonType === "both") {
        LessonSectionLength = LessonSectionLength * 2;
      }
      while (MathLessonArray.length < LessonSectionLength) {
        num_a = getRandomInt(LessonBottomRange, LessonTopRange + 1);
        num_b = getRandomInt(LessonBottomRange, LessonTopRange + 1);
        if ((num_a - num_b <= LessonSumTopRange) && (num_a - num_b >= LessonSumBottomRange)) {
          MathLessonArray.push({"a": num_a, "b": num_b, "operator": "minus", "sum": (num_a - num_b)});
        }
      }
    }

    LessonLength = MathLessonArray.length;


    console.log(MathLessonArray);
    console.log(MathLessonArray.length);

// PlayArrayList[0] = "../../audio/math/tr/15.mp3";
// PlayArrayList[1] = "../../audio/math/tr/plus.mp3";
// PlayArrayList[2] = "../../audio/math/tr/16.mp3";
// PlayArrayList[3] = "../../audio/math/tr/equals.mp3";
// PlayArrayList[4] = "../../audio/math/tr/31.mp3";
// PlayArrayIndex = 0;
// PlayArray = true;
// play_sound(PlayArrayList[PlayArrayIndex], "media_audio");


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
)
;

