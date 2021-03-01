var LessonProgress = 0;
var BuildLessonCorrectKey;
var CurrentWordCardArrayPos = 0;
var PictureHintTimeout;

var LowerCaseCard = true;

var media_audio_playing = false;
var media_audio2_playing = false;

var AllWordsData;
var AlfaWords = [];

var LessonCategories;
var LessonLanguage;
var LessonParameters;
var LessonLength;
var LessonSectionLength;
var LessonType;
var LessonRange;
var CorrectAnswerBoolean = false;
var CurrentLessonType = 1;
var CorrectAnswerValue = "";

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

//-----------------------------------------------------------------------------------------------------------
function CreateCardsBoards() {
  $("#ObjectsContainer").show();
  $("#ObjectsContainer").html("");

  $("#bottom-half").hide();
  $("#top-half").css({"height": "100vh"});
  $("#ObjectsContainer").height($("#top-half").height() + "px");

  $("#ObjectsContainer").append("<div id='card1' style='width:48vw; height: 45vh; background-color: blue; border: 3px solid #fff; border-radius: 5px; margin-left:10px; display: inline-block; position:relative;'></div>");

  $("#ObjectsContainer").append("<div id='card2' style='width:48vw; height: 45vh; background-color: red; border: 3px solid #fff; border-radius: 5px; margin-left:10px; display: inline-block; position:relative;'></div>");

  $("#ObjectsContainer").append("<div id='card3' style='width:48vw; height: 45vh; background-color: green; border: 3px solid #fff; border-radius: 5px; margin-left:10px; margin-top:5px; display: inline-block; position:relative;'></div>");

  $("#ObjectsContainer").append("<div id='card4' style='width:48vw; height: 45vh; background-color: orange; border: 3px solid #fff; border-radius: 5px; margin-left:10px; margin-top:5px; display: inline-block; position:relative;'></div>");


  for (var i=1; i<=4; i++) {

    var MaxBoxes = Math.floor(Math.random() * LessonRange) + 1;
    fill_shapes("#card"+i, MaxBoxes, "click_object_"+i);

    addClickCounter("click_object_"+i,"#card"+i,-1,30);

    var CorrectBox = Math.floor(Math.random() * 4) + 1;

    var RandomAnswer = Math.floor(Math.random() * LessonRange) + 1;
    var CardCorrectAnswer = $('.click_object_'+i+'').length;
    $("#card"+i).append("<div class='answer_box_"+i+"' data-cardanswer='"+CardCorrectAnswer+"' data-boxid='answer_box_"+i+"' id='answer_"+i+"_1' style='position: absolute; right:10px; top:2vh; width:100px; height: 9vh; background-color: white; color:black; border: 2px solid #000; border-radius: 2px; font-size: 25px; text-align: center; line-height: 9vh;'>" + RandomAnswer + "</div>");
    if (CorrectBox === 1) {
      $("#answer_"+i+"_1").html(CardCorrectAnswer);
    }

    var RandomAnswer = Math.floor(Math.random() * LessonRange) + 1;
    $("#card"+i).append("<div class='answer_box_"+i+"' data-cardanswer='"+CardCorrectAnswer+"' data-boxid='answer_box_"+i+"' id='answer_"+i+"_2' style='position: absolute; right:10px; top:12vh; width:100px; height: 9vh; background-color: white; color:black; border: 2px solid #000; border-radius: 2px; font-size: 25px; text-align: center; line-height: 9vh;'>" + RandomAnswer + "</div>");
    if (CorrectBox === 2) {
      $("#answer_"+i+"_2").html(CardCorrectAnswer);
    }

    var RandomAnswer = Math.floor(Math.random() * LessonRange) + 1;
    $("#card"+i).append("<div class='answer_box_"+i+"' data-cardanswer='"+CardCorrectAnswer+"' data-boxid='answer_box_"+i+"' id='answer_"+i+"_3' style='position: absolute; right:10px; top:22vh; width:100px; height: 9vh; background-color: white; color:black; border: 2px solid #000; border-radius: 2px; font-size: 25px; text-align: center; line-height: 9vh;'>" + RandomAnswer + "</div>");
    if (CorrectBox === 3) {
      $("#answer_"+i+"_3").html(CardCorrectAnswer);
    }

    var RandomAnswer = Math.floor(Math.random() * LessonRange) + 1;
    $("#card"+i).append("<div class='answer_box_"+i+"' data-cardanswer='"+CardCorrectAnswer+"' data-boxid='answer_box_"+i+"' id='answer_"+i+"_4' style='position: absolute; right:10px; top:32vh; width:100px; height: 9vh; background-color: white; color:black; border: 2px solid #000; border-radius: 2px; font-size: 25px; text-align: center; line-height: 9vh;'>" + RandomAnswer + "</div>");
    if (CorrectBox === 4) {
      $("#answer_"+i+"_4").html(CardCorrectAnswer);
    }

    $(".answer_box_"+i+"").on('click',function () {
      $( "." + $(this).data("boxid") ).removeClass("selected_answer_box");
      $( "." + $(this).data("boxid") ).removeClass("correct_answer_box");

      if (LessonLanguage === "tr") {
        play_sound("../../audio/letters/tr/Default_" + $(this).html() + ".wav", "media_audio");
      }

      if (LessonLanguage === "en") {
        play_sound("../../audio/letters/en/" + $(this).html() + ".mp3", "media_audio");
      }

      if (LessonLanguage === "ch") {
        play_sound("../../audio/letters/ch/number_" + $(this).html() + "_ch.mp3", "media_audio");
      }


      if ($(this).html()==$(this).data("cardanswer")) {
        $(this).addClass("correct_answer_box");
      } else
      {
        $(this).addClass("selected_answer_box");
      }

      if ( $('.correct_answer_box').length ===4 ) {
        CorrectAnswer();
      }
    });
  }

}

function fill_shapes(target_container, MaxBoxes, click_object) {
  $(target_container).html("");

  var template = shuffle($(".target")).slice(0, 1)[0]; // document.getElementsByClassName("target")[0];
  console.log(template);
  console.log($(target_container).innerWidth() + "x" + $(target_container).innerHeight());

  if ($(target_container).innerWidth() <= $(target_container).innerHeight() * 1.3) {
    var targetWidth = $(target_container).innerWidth() / 7;
    var targetHeight = $(target_container).innerWidth() / 7;
    var x_pixels = $(target_container).innerWidth() - targetWidth;
    var y_pixels = $(target_container).innerHeight() - targetHeight;
  }
  else {
    console.log("use height");
    var targetWidth = $(target_container).innerHeight() / 3;
    var targetHeight = $(target_container).innerHeight() / 3;

    var x_pixels = $(target_container).innerWidth() - (targetWidth + 160);
    var y_pixels = $(target_container).innerHeight() - targetHeight;
  }

  targetWidth = Math.floor(targetWidth);
  console.log(targetWidth);

  var targets = [];
  var count = 0; // infinite recursion protection
  for (var i = 0; i < MaxBoxes; i++) {
    do {
      // do {
      var x = Math.floor(Math.random() * x_pixels);
      var y = Math.floor(Math.random() * y_pixels);
      // } while ((x >= x_midScreen-5 && x <= x_midScreen+5) && (y >= y_midScreen-5 || y <= y_midScreen+5));

      for (var j = 0; j < i; j++) {
        if (x >= targets[j].x - targetWidth && x <= targets[j].x + targetWidth &&
          y >= targets[j].y - targetHeight && y <= targets[j].y + targetHeight) break; // not ok!
      }

      if (count++ > 200) {
        console.log('give up');
        return;
      }

    } while (j < i);
    targets.push({x, y});

    $(target_container).append("<img src='" + template.src + "' class='target " + " " + click_object + "' style='width:" + targetWidth + "px; left:" + x + "px; top:" + y + "px;' />");
  }
}

function addClickCounter(ClickClass,ObjectContainer,CorrectCount,radius) {

  $("."+ClickClass).on('click', function () {

    if ($(this).hasClass(ClickClass+"_counted")) {

    }
    else {
      var numItems = $('.'+ClickClass+'_counted').length + 1;

      if (LessonLanguage === "tr") {
        play_sound("../../audio/letters/tr/Default_" + numItems + ".wav", "media_audio");
      }

      if (LessonLanguage === "en") {
        play_sound("../../audio/letters/en/" + numItems + ".mp3", "media_audio");
      }

      if (LessonLanguage === "ch") {
        play_sound("../../audio/letters/ch/number_" + numItems + "_ch.mp3", "media_audio");
      }


      $(ObjectContainer).append("<div class='number_div' style='position: absolute; left:" + ($(this).position().left + ($(this).width() / 2) - radius) + "px; top:" + ($(this).position().top + ($(this).height() / 2) - radius) + "px; width:"+(radius*2)+"px; height: "+(radius*2)+"px; border-radius: "+radius+"px; border: 3px solid black; background-color: white; color:black; font-size: "+radius+"px; line-height: "+(radius*2)+"px; text-align: center'>" + numItems + "</div>");
      $(this).addClass(ClickClass+"_counted");

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
  fill_shapes("#ObjectsContainer", MaxBoxes, "click_object");
  MaxBoxes = $('.click_object').length;
  CorrectAnswerValue = MaxBoxes + "";


  update_keyboard("0123456789", CorrectAnswerValue, 20000);

  addClickCounter("click_object","#ObjectsContainer",MaxBoxes,50);

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

  if (LessonType === "numbers_keyboard_and_cards") {
    if (LessonProgress > LessonSectionLength * 2) {
      CurrentLessonType = 3;
    }
    else if (LessonProgress > LessonSectionLength) {
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

  if (LessonType === "only_numbers") {
    LessonLength = LessonSectionLength;
  }

  if (LessonType === "numbers_and_keyboard") {
    LessonLength = LessonSectionLength * 2;
  }

  if (LessonType === "numbers_keyboard_and_cards") {
    LessonLength = LessonSectionLength * 3;
  }


  $("#ObjectsContainer").height($("#top-half").height() + "px");

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
    // CreateWordBoard();
  });

  $("#reset_lesson").on('click', function () {
    // CreateWordBoard();
  });


  $("#ballons").hide();


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
      if (CurrentLessonType === 3) {
        CreateCardsBoards();
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


});

