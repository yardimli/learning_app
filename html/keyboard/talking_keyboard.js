var backspace_enabled = true;
var keyboard_re_enable_timeout = 750;

function isAlphanumericKey(keycode) {
  return (keycode >= 48) && (keycode <= 90);
}

document.body.addEventListener('touchmove', function (e) {
  e.preventDefault();
});

var keys = "";
var correct_key = "";
var blink_delay = 1000;
var BlinkTimer;
var WaitForRelease = false;
var current_correct_key = "";

var zoomCount = 0;

var old_data = {"keys": "", "blink_delay": 100000, "correct_key": "?"};

function hide_keyboard() {
  $(".keyboard").hide();
}

function show_keyboard() {
  $(".keyboard").show();
}

function blink_correct_keyboard_key() {
  clearTimeout(BlinkTimer);
  $('.keyboard-key').each(function (i, obj) {
    if ($(this).text() === current_correct_key) {
      $(this).addClass("blink_keyboard_key");
    }
  });

}

function update_keyboard(Keyboard_Keys, Correct_Key, Blink_Delay) {
  current_correct_key = Correct_Key;
  console.log("update keyboard: "+Keyboard_Keys+" - "+Correct_Key+" - "+Blink_Delay);
  console.log(old_data);
  if (Keyboard_Keys !== old_data.keys || Correct_Key !== old_data.correct_key || Blink_Delay !== old_data.blink_delay) {
    Blink_Delay = parseInt(Blink_Delay, 10);

    old_data.keys = Keyboard_Keys;
    old_data.correct_key = Correct_Key;
    old_data.blink_delay = Blink_Delay;

    clearTimeout(BlinkTimer);

    $(".keyboard-key").removeClass("can_press");
    $(".keyboard-key").removeClass("blink_keyboard_key");

    BlinkTimer = setTimeout(function () {
      $('.keyboard-key').each(function (i, obj) {
        if ($(this).text() === Correct_Key) {
          $(this).addClass("blink_keyboard_key");
        }
      });
    }, Blink_Delay);

    if (!WaitForRelease) {

      if (Keyboard_Keys === "all") {
        $(".keyboard-key").css({"opacity": 1});
        $(".keyboard-key").addClass("can_press");
      }
      else {
        $(".keyboard-key").css({"opacity": 0.075});

        $('.keyboard-key').each(function (i, obj) {
          if (Keyboard_Keys.indexOf($(this).text()) !== -1) {
            $(this).css({"opacity": 1});
            $(this).addClass("can_press");
          }
        });

        if (backspace_enabled && Keyboard_Keys!=="") {
          $("#key-backspace").css({"opacity": 1});
          $("#key-backspace").addClass("can_press");
        }
      }
    }
  } else
  {
    console.log("update keyboard failed!");
  }
}


function init_keyboard() {
  $(".keyboard-key").css({"opacity": 0.075});

// $("#CH_NUM_ROW").toggle();
// $("#key-CH").on('click', function () {
// 	$("#TR_KEY").hide();
// 	$("#CH_KEY").show();
// });
//
// $("#key-TR").on('click', function () {
// 	$("#CH_KEY").hide();
// 	$("#TR_KEY").show();
// });
//
// $("#key-CH-NUM").on('click', function () {
// 	$("#CH_NUM_ROW").toggle();
// });

  $(".keyboard-key").off().on({
    // Upon mouse-down, if letter is enabled or all speak the letter.
    mousedown: function () {
      console.log($(this));
      console.log($(this).hasClass("can_press")+" - " + WaitForRelease );
      if ($(this).hasClass("can_press") && !WaitForRelease) {

        var event = new CustomEvent("virtual-keyboard-press", {detail: {"key": $(this).text()}});
        document.dispatchEvent(event);

        if (SpeakLetters === "yes") {
          if ($(this).data("mp3")==="" || $(this).data("mp3")===null) {
            play_sound("../../audio/click/click1.mp3", "media_audio2", false);
          } else {
            play_sound("../../" + $(this).data("mp3"), "media_audio2", false);
          }
        }
        else {
          play_sound("../../audio/click/click1.mp3", "media_audio2", false);
        }

        $(".keyboard-key").css({"opacity": 0.075});
        WaitForRelease = true;

        setTimeout(function () {

          WaitForRelease = false;
          $('.keyboard-key').each(function (i, obj) {
            if ($(this).hasClass("can_press")) {
              $(this).css({"opacity": 1});
            }
          });
        }, keyboard_re_enable_timeout);
      }
    },


    // Upon mouse-up, fade away the shown letter.
    mouseup: function () {
    }

  });
}