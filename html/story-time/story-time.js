var LessonLength = 11;
var LessonIndex = 0;

var AllStoryData;
var LessonStoryQuestionArray = [];

var LessonParameters;
var LessonLanguage;
var LessonCategory;
var SpeakLetters;
var LessonRedoWrongAnswers = "yes";

var AddWordToEndOfList = false;

var LessonIntroductionPlaying = false;
var QuestionIndex = 0;
var GotoNextQuestion = false;
var AnswerIsCorrect = false;
var AnswerIsCorrectLoadNext = false;

var LessonQuestionCount = 0;
var LessonQuestionProgress = 0;

//---------------------------------------------------------------
var _listener = function (playerid) {

  if (playerid.target.id === "media_audio") {
    media_audio_playing = false;
  }

  if (playerid.target.id === "media_audio2") {
    media_audio2_playing = false;
  }


  if (playerid.target.id === "media_audio") {
    if (LessonIntroductionPlaying) {
      LessonIntroductionPlaying = false;
      $("#start_questions").show();
    }

    if (GotoNextQuestion) {
      GotoNextQuestion = false;
      var CurrentStoryID = LessonStoryQuestionArray[LessonIndex].story_id;

      if (AnswerIsCorrect) {
        play_sound("../../audio/correct-sound/clap_2.mp3", "media_audio2", false);

        setTimeout(function () {
          AnswerIsCorrectLoadNext = true;
          play_sound("../../audio/correct-sound/bravo-" + Math.floor((Math.random() * 5) + 5) + ".mp3", "media_audio");

          $("#ballons").show();
          $("#ballons").addClass("balloons_hide");

        }, 200);

      } else
      {
        play_sound("../../audio/wrong-sound/yanlis-15.mp3", "media_audio2", false);

        if (!AddWordToEndOfList && LessonRedoWrongAnswers==="yes") {
          LessonQuestionCount++;
          AddWordToEndOfList = true;
          var CurrentStoryID = LessonStoryQuestionArray[LessonIndex].story_id;
          AllStoryData[CurrentStoryID].questions.push( AllStoryData[CurrentStoryID].questions[QuestionIndex] );
        }


        }

    }

    if (AnswerIsCorrectLoadNext) {
      LessonQuestionProgress++;
      $("#progress_bar_box").css({"width": ((LessonQuestionProgress / (LessonQuestionCount)) * 100) + "%"});

      AnswerIsCorrectLoadNext = false;
      var CurrentStoryID = LessonStoryQuestionArray[LessonIndex].story_id;

      QuestionIndex++;

      if (QuestionIndex < AllStoryData[CurrentStoryID].questions.length) {
        CreateQuestion();
      }
      else {
        QuestionIndex = 0;
        LessonIndex++;
        console.log("Current Lesson Index: "+LessonIndex);
        CreateLesson();
      }
    }
  }
};


function CreateQuestion() {
  var CurrentStoryID = LessonStoryQuestionArray[LessonIndex].story_id;
  var ThisQuestion = AllStoryData[CurrentStoryID].questions[QuestionIndex];

  console.log("question index: "+QuestionIndex+", Lesson Index: "+LessonIndex+" CurrentStoryID: "+CurrentStoryID+" total questions: "+AllStoryData[CurrentStoryID].questions.length);

  AnswerIsCorrect = false;
  AddWordToEndOfList = false;

  $("#ballons").hide();
  play_sound("", "media_audio2", true);

  $("#question_div").show();
  if (ThisQuestion.picture==="" || ThisQuestion.picture===null) {
    $("#question_picture").attr('src', 'question_mark_icon.png');
  } else {
    $("#question_picture").attr('src', 'poster://pictures/story-question/' + ThisQuestion.picture);
  }

  $("#question_title").html(ThisQuestion.question);
//  $("#question_answers").html(  AllStoryData[ CurrentStoryID ].story.replace(/\n/gi,"<br>"));

  play_sound("poster://audio/story-question/" + ThisQuestion.audio, "media_audio", false);

  $("#question_title").html(ThisQuestion.question);

  $("#question_answers").html("");

  var AnswersArray = [];

  for (var i = 0; i < ThisQuestion.answers.length; i++) {

    var isCorrect = ThisQuestion.answers[i].is_correct === "1" ? "yes" : "no";

    $("#question_answers").append("<div class='story_answer_box' data-correct='" + isCorrect + "' data-audio='" + ThisQuestion.answers[i].audio + "'>" + ThisQuestion.answers[i].answer + "</div>");
    AnswersArray.push(ThisQuestion.answers[i].answer);
  }

  if (ThisQuestion.random_answers_from_other_questions === "1") {

    var WrongAnswerCount = 0;
    var LoopCounter = 0;

    while (WrongAnswerCount < 3 && LoopCounter < 1000) {
      LoopCounter++;
      for (var i2 = 0; i2 < AllStoryData[CurrentStoryID].questions.length; i2++) {
        if (i2 !== QuestionIndex) {
          var ThisQuestionTemp = AllStoryData[CurrentStoryID].questions[i2];
          for (var i3 = 0; i3 < ThisQuestionTemp.answers.length; i3++) {
            if (Math.random() * 100 > 95 && WrongAnswerCount < 3 && (AnswersArray.indexOf(ThisQuestionTemp.answers[i3].answer) === -1)) {
              WrongAnswerCount++;
              $("#question_answers").append("<div class='story_answer_box' data-correct='no' data-audio='" + ThisQuestionTemp.answers[i3].audio + "'>" + ThisQuestionTemp.answers[i3].answer + "</div>");
              AnswersArray.push(ThisQuestionTemp.answers[i3].answer);
            }
          }
        }
      }
    }
  }
  $("#question_answers").shuffleChildren();

  $(".story_answer_box").off('click').on('click', function () {
    play_sound("poster://audio/story-answer/" + $(this).data("audio"), "media_audio", false);
    AnswerIsCorrect = $(this).data("correct")==="yes";
    GotoNextQuestion = true;
  });
}


function CreateLesson() {
  var CurrentStoryID = LessonStoryQuestionArray[LessonIndex].story_id;
  AddWordToEndOfList = false;

  play_sound("", "media_audio2", true);

  console.log("CreateLesson Lesson Index: "+LessonIndex);
  $("#ballons").hide();
  $("#story_div").show();
  $("#question_div").hide();
  $("#story_picture").attr('src', 'poster://pictures/story/' + AllStoryData[CurrentStoryID].picture);

  $("#story_title").html(AllStoryData[CurrentStoryID].title);
  $("#story_text").html(AllStoryData[CurrentStoryID].story.replace(/\n/gi, "<br>"));

  play_sound("poster://audio/story/" + AllStoryData[CurrentStoryID].audio, "media_audio", false);

  console.log(AllStoryData[CurrentStoryID]);
  AllStoryData[CurrentStoryID].questions = shuffleArray(AllStoryData[CurrentStoryID].questions);

  $("#start_questions").hide();
  LessonIntroductionPlaying = true;
  QuestionIndex = 0;
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

  $("#story_grid").shuffleChildren();

  $(".story_select").on('click', function () {
    console.log($(this).data("id"));
    $(this).toggleClass("story_selected");
  });


  $("#ballons").hide();


  $("#start_questions").on('click', function () {
    $("#start_questions").hide();
    if (AllStoryData[LessonStoryQuestionArray[LessonIndex].story_id].hide_after_intro === "1") {
      $("#story_div").hide();
    }

    CreateQuestion();
  });


  $("#BeginLesson").on('click', function () {
    $("#BeginLesson").hide();
    $("#story_grid").hide();

    $(".story_selected").each(function () {
      var story_id = parseInt($(this).data("id"), 10);
      console.log(AllStoryData[story_id]);

      LessonStoryQuestionArray.push({"story_id": story_id, "done": false});

      for (var i = 0; i < AllStoryData[story_id].questions.length; i++) {
        if (AllStoryData[story_id].questions[i].answers.length===0) {
          AllStoryData[story_id].questions.splice(i,1);
          i--;
          i = (i<0) ? 0 : i;
        } else
        {
          var DeleteQuestion = false;
          for (var i2 = 0; i2 < AllStoryData[story_id].questions[i].answers.length; i2++) {
            if (AllStoryData[story_id].questions[i].answers[i2].audio === "" || AllStoryData[story_id].questions[i].answers[i2].audio === null) {
              DeleteQuestion = true;
            }
          }
          if (DeleteQuestion) {
            AllStoryData[story_id].questions.splice(i,1);
            i--;
            i = (i<0) ? 0 : i;
          }
        }

        // LessonStoryQuestionArray.push({"story_id": story_id, "question_id": i, "done": false});
      }

      LessonQuestionCount += AllStoryData[story_id].questions.length;
    });

    console.log(LessonStoryQuestionArray);

    LessonLength = LessonStoryQuestionArray.length;
    LessonIndex = 0;
    CreateLesson();
  });

});
