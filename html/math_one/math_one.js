var LessonProgress = 0;

var LowerCaseCard = true;

var media_audio_playing = false;
var media_audio2_playing = false;

var LessonLanguage;
var LessonParameters;
var LessonLength;
var LessonSectionLength;
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

      if (CurrentLessonType === 1) {
        CreateCountingBoard();
      }

      if (CurrentLessonType === 2) {
        CreateCountingBoard();
      }

      if (CurrentLessonType === 3) {
        CreateCardsBoards();
      }

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


function addClickCounter(ClickClass, ObjectContainer, CorrectCount, radius) {

  $("." + ClickClass).on('click', function () {

    if ($(this).hasClass(ClickClass + "_counted")) {

    }
    else {
      var numItems = $('.' + ClickClass + '_counted').length + 1;

      if (LessonLanguage === "tr") {
        play_sound("../../audio/letters/tr/Default_" + numItems + ".wav", "media_audio");
      }

      if (LessonLanguage === "en") {
        play_sound("../../audio/letters/en/" + numItems + ".mp3", "media_audio");
      }

      if (LessonLanguage === "ch") {
        play_sound("../../audio/letters/ch/number_" + numItems + "_ch.mp3", "media_audio");
      }


      $(ObjectContainer).append("<div class='number_div' style='position: absolute; left:" + ($(this).position().left + ($(this).width() / 2) - radius) + "px; top:" + ($(this).position().top + ($(this).height() / 2) - radius) + "px; width:" + (radius * 2) + "px; height: " + (radius * 2) + "px; border-radius: " + radius + "px; border: 3px solid black; background-color: white; color:black; font-size: " + radius + "px; line-height: " + (radius * 2) + "px; text-align: center'>" + numItems + "</div>");
      $(this).addClass(ClickClass + "_counted");

      if (CorrectCount === numItems) {
        CorrectAnswer();

      }
    }
  });

}

//-----------------------------------------------------------------------------------------------------------
function CreateCountingBoard() {
  $("#ObjectsContainer").show();
  $("#ObjectsContainer").html("");

  if (CurrentLessonType === 1) {
    $("#bottom-half").hide();
    $("#top-half").css({"height": "100vh"});
    $("#ObjectsContainer").height($("#top-half").height() + "px");

  }
  else if (CurrentLessonType === 2) {
    $("#bottom-half").show();
    $("#top-half").css({"height": "50vh"});
    $("#ObjectsContainer").height($("#top-half").height() + "px");

  }


  play_sound("", "media_audio2", true);

  var MaxBoxes = Math.floor(Math.random() * LessonRange) + 1;
//  fill_shapes("#ObjectsContainer", MaxBoxes, "click_object");
  MaxBoxes = $('.click_object').length;
  CorrectAnswerValue = MaxBoxes + "";


  update_keyboard("0123456789", CorrectAnswerValue, 20000);

  addClickCounter("click_object", "#ObjectsContainer", MaxBoxes, 50);

}

function duck_string(number_of_ducks) {

  var text_align = "center";
  if (number_of_ducks >= 5) {
    text_align = "left;"
  }
  var ducks_string = "<div style='width:300px; display: inline-block; vertical-align: top; text-align: " + text_align + ";'>";
  for (var i = 0; i < number_of_ducks; i++) {
    ducks_string += "<img src='" + duck_template.src + "' style='width:50px; margin-right:10px; margin-bottom: 10px; vertical-align: top; ' />";
  }
  ducks_string += "</div>";
  return ducks_string;
}

function AskMathQuestion(QuestionNumber) {
  $("#progress_bar_box").css({"width": ((LessonProgress / (LessonLength)) * 100) + "%"});
  console.log(MathLessonArray[QuestionNumber]);

  duck_template = shuffle($(".target")).slice(0, 1)[0]; // document.getElementsByClassName("target")[0];
  console.log(duck_template);

  $("#MathQuestionDiv").html("");

//  $("#MathQuestionDiv").html(MathLessonArray[QuestionNumber].a + " + " + MathLessonArray[QuestionNumber].b + " = <br>");


  $("#MathQuestionDiv").append("<div style='display: inline-block;  '><div style='font-size: 100px; font-weight: bold; text-align: center;'>" + MathLessonArray[QuestionNumber].a + "</div>" + duck_string(MathLessonArray[QuestionNumber].a) +
    "</div>"
  );

  if (MathLessonArray[QuestionNumber].operator === "plus") {
    $("#MathQuestionDiv").append("<div style='display: inline-block; vertical-align: top; '><div style='font-size: 100px; font-weight: bold; text-align: center;'>+</div>");
  }

  if (MathLessonArray[QuestionNumber].operator === "minus") {
    $("#MathQuestionDiv").append("<div style='display: inline-block; vertical-align: top; '><div style='font-size: 100px; font-weight: bold; text-align: center;'>-</div>");
  }

  $("#MathQuestionDiv").append("<div style='display: inline-block; '><div style='font-size: 100px; font-weight: bold; text-align: center;'>" + MathLessonArray[QuestionNumber].b + "</div>" + duck_string(MathLessonArray[QuestionNumber].b) +
    "</div>"
  );

  $("#MathQuestionDiv").append("<div style='display: inline-block; vertical-align: top; '><div style='font-size: 100px; font-weight: bold; text-align: center;'>=</div>");

  $("#MathQuestionDiv").append("<div style='display: inline-block;'><div style='font-size: 100px; font-weight: bold; text-align: center;'>" + MathLessonArray[QuestionNumber].sum + "</div>" + duck_string(MathLessonArray[QuestionNumber].sum) +
    "</div>"
  );

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


    if (1 === 2) {

      var KeyboardPath = "../keyboard/mini_" + LessonLanguage + "_keyboard.html";

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

          if (CurrentLessonType === 1) {
            CreateCountingBoard();
          }
          if (CurrentLessonType === 2) {
            CreateCountingBoard();
          }


        }
      });

      document.addEventListener("virtual-keyboard-press", function (event) {
        if (event.detail.key !== "") {
          if (event.detail.key === CorrectAnswerValue) {
            CorrectAnswer();
          }
        }
      });
    }


  }
);

