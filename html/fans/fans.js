var fan_animations = [];
var CorrectKey = "";
var fan_1_anime = 1;
var StartAnimation = false;

var LessonProgress = 0;
var LessonInProgress = false;

var RandomList = [];

var WordAudio = "";
var nozoom = false;
var key_string = "";


var LessonParameters;
var LessonLanguage;
var LessonLength;
var MaxFans;
var WordHints;
var RandomType;

var SpeakLetter = "yes";
var KeyboardSize = "large";



function addFan(fan_number, left, top, width, x_visible, x_animate) {
  fan_animations.push({
    fan_id: fan_number,
    fan_position: 1,
    max_position: 4,
    is_visible: x_visible,
    is_animate: x_animate
  });
  $("#animation_view").append("<img id='fan_image_" + (fan_animations.length - 1) + "' " +
    "src='ceiling-fan-anim/" + fan_animations[fan_animations.length - 1].fan_id +
    "/" + fan_animations[fan_animations.length - 1].fan_position + ".png' " +
    "class='fan_1' style='width:" + width + "px; left:" + left + "px; top:" + top + "px;'>");
}

function clickable_numbers(total_numbers, correct_number, left, top, width) {
  for (i = 0; i < total_numbers; i++) {

    $("#animation_view").append("<img id='number_image_" + (i + 1) + "' " +
      "src='numbers/" + (i + 1) + "-a.png' " +
      "class='fan_1' style='width:" + width + "px; left:" + (left + (i * width)) + "px; top:" + top + "px;'>");
  }

}


function intersectRect(r1_top, r1_left, r2_top, r2_left) {
  var x_number_r1 = 100;
  var x_number_r2 = 150;
  return !(r2_left > (r1_left + x_number_r1) ||
    (r2_left + x_number_r2) < r1_left ||
    r2_top > (r1_top + x_number_r1) ||
    (r2_top + x_number_r2) < r1_top);
}

function CreateLesson() {

  LessonInProgress = true;
  LessonProgress++;
  $("#ballons").hide();

  $("#progress_bar_box").css({"width": ((LessonProgress / LessonLength) * 100) + "%"});


  $(".fan_1").remove();

  var NumberOfFans = RandomList[LessonProgress - 1];

  if (LessonLanguage === "tr") {
    play_sound("/audio/letters/tr/Default_" + RandomList[LessonProgress - 1] + ".wav","media_audio",false);
  }

  if (LessonLanguage === "en") {
    play_sound("/audio/letters/en/" + RandomList[LessonProgress - 1] + ".mp3","media_audio",false);
  }

  if (LessonLanguage === "ch") {
    play_sound("/audio/letters/ch/number_" + RandomList[LessonProgress - 1] + "_ch.mp3","media_audio",false);
  }

  if (WordHints) {
    $("#word_letter").html("<span style='text-shadow: 2px 2px 2px rgba(0,0,0,0.5); color:" + getRandomColor() + "; font-size: 150px; line-height: 150px;'>" + RandomList[LessonProgress - 1] + "</span>");
  }


  var fan_list = [];
  fan_animations = [];

  var fan_width = 300;
  fan_1_anime = 1;
  StartAnimation = false;
  var j = 0;
  var random_x = 0;
  var random_y = 0;
  var break_loop = true;

  for (let i = 0; i < (NumberOfFans); i++) {
    j = 0;
    while (j < 500) {
      j++;
      random_x = Math.floor(Math.random() * 900) + 50;

      // if (nozoom) {
        random_y = Math.floor(Math.random() * 10) + 10;
      // }
      // else {
      //   random_y = Math.floor(Math.random() * 300) + 50;
      // }

      break_loop = true;
      for (let k = 0; k < fan_list.length; k++) {

        if (intersectRect(random_x, random_y, fan_list[k].x, fan_list[k].y)) {
          break_loop = false;
        }
      }

      if (break_loop) {
        break;
      }
    }
    fan_list.push({x: random_x, y: random_y});
    addFan((i + 1), random_x, random_y, fan_width, true, false);
  }


  if (RandomType === "sequential") {
    key_string = "";
    for (var i = 0; i < (NumberOfFans + 3); i++) {
      key_string = key_string + "" + (i + 1);
    }
  }

  if (RandomType === "one_more") {
    key_string = NumberOfFans + "";
    var j = 0;
    while (j === 0) {
      var RandNum = Math.floor(Math.random() * 9) + 1;
      if (RandNum !== NumberOfFans) {
        key_string += "" + RandNum;
        j = 1;
      }
    }
  }

  if (RandomType === "two_more") {
    key_string = NumberOfFans + "";
    var j = 0;
    while (j === 0) {
      var RandNum = Math.floor(Math.random() * (9 - parseInt(NumberOfFans, 10))) + parseInt(NumberOfFans, 10);
      if (RandNum !== NumberOfFans) {
        key_string += "" + RandNum;
        j = 1;
      }
    }

    var j = 0;
    if (parseInt(NumberOfFans, 10) > 1) {
      while (j === 0) {
        var RandNum = Math.floor(Math.random() * parseInt(NumberOfFans, 10));
        if (RandNum !== NumberOfFans) {
          key_string += "" + RandNum;
          j = 1;
        }
      }
    }

  }
}

function CorrectAnswer() {

  CorrectKey = "";
  setTimeout(function () {
    play_sound("../audio/correct-sound/switch_1.mp3","media_audio",false);
  }, 150);

  setTimeout(function () {
    play_sound("../audio/correct-sound/clap_2.mp3","media_audio",false);
  }, 400);

  setTimeout(function () {
    play_sound("../audio/correct-sound/bravo-"+ Math.floor( (Math.random() * 10) +1 ) +".mp3","media_audio2",false);
  }, 400);


  if (WordHints) {
    $("#word_letter").removeClass("animate-flicker");
    $("#word_letter").addClass("animate-zoom");
  }
  $("#ballons").show();
  $("#ballons").addClass("balloons_hide");

  StartAnimation = true;
  for (var i = 0; i < fan_animations.length; i++) {
    fan_animations[i].is_animate = true;
  }

  setTimeout(function () {
    if (LessonProgress >= LessonLength) {
      setTimeout(function () {
        top.window.location.href = '../index.html';
      }, 1500);
    }


    CreateLesson();
    if (WordHints) {
      $("#word_letter").removeClass("animate-zoom");
      $("#word_letter").addClass("animate-flicker");
    }
    $("#ballons").hide();
  }, 5000);

}

$(document).ready(function () {
  $("#ballons").hide();
  LessonParameters = window.sendSyncCmd('get-lesson-parameters', '');

  WordHints =  LessonParameters["hints"] === "yes";
  MaxFans = parseInt( LessonParameters["max_fans"], 10);
  RandomType = LessonParameters["random"];
  LessonLength = parseInt( LessonParameters["length"], 10);
  LessonLanguage = LessonParameters["language"];


  if (!WordHints) {
    $("#word_letter").hide();
  }

  for (var i = 0; i < LessonLength; i++) {
    var TempRandom = Math.floor(Math.random() * MaxFans) + 1;

    if (i > 0) {
      var k = 0;
      var l = 0;
      while (k == 0 && l < LessonLength) {
        for (var j = 0; j < i; j++) {
          if (TempRandom === RandomList[j]) {
            TempRandom = Math.floor(Math.random() * MaxFans) + 1;
            break;
          }
        }
        l++;
      }
    }
    if (i > 0) {
      if (RandomList[i - 1] === TempRandom) {
        TempRandom = Math.floor(Math.random() * MaxFans) + 1;
      }
    }
    RandomList[i] = TempRandom;
  }


  CreateLesson();

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

    }
  });

  document.addEventListener("virtual-keyboard-press", function (event) {
    if (event.detail.key !== "" && LessonProgress > 0) {
      CorrectAnswer(event.detail.key);
    }
  });


});
