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

  console.log( AllStoryData[ LessonStoryQuestionArray[ArrayID].story_id ] );

  CreateQuestion(ArrayID, 0)

}

function CreateQuestion(ArrayID,QuestionIndex) {
  var ThisQuestion = AllStoryData[ LessonStoryQuestionArray[ArrayID].story_id ].questions[QuestionIndex];

  $("#question_picture").attr('src', 'poster://pictures/story-question/' + ThisQuestion.picture);

  $("#question_title").html( ThisQuestion.question);
//  $("#question_answers").html(  AllStoryData[ LessonStoryQuestionArray[ArrayID].story_id ].story.replace(/\n/gi,"<br>"));

  play_sound("poster://audio/story-question/" + ThisQuestion.audio, "media_audio", false);

  $("#question_title").html( ThisQuestion.question);

  $("#question_answers").html("");

  for (var i=0; i<ThisQuestion.answers.length; i++) {
    $("#question_answers").append( ThisQuestion.answers[i].answer + "<br>" );
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
