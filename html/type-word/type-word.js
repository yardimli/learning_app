var CorrectKey = "";


var WordAudio = "";
var nozoom = false;
var key_string = "";
var LessonString = "";
var LessonStringPos = 0;
var AllLetters = "ELKAİNOMUTÜYÖRIDSBZÇGŞCPHVĞFJ1234567890";

var LessonLength = 11;
var LessonProgress = 0;

var AllWordsData;
var AlfaWords = [];
var CorrectWordAudio = "";
var CorrectWordString = "";

var Timeout1, Timeout2, Timeout3, Timeout4, Timeout5, Timeout6, Timeout7, Timeout8, Timeout9, Timeout10;
var LastLetterEntered = false;

var LessonParameters;
var LessonKeyboardRandom;
var LessonLanguage;
var LessonCategory;
var KeyboardSize;
var SpeakLetters;
var LessonRedoWrongAnswers = "yes";

var CurrentlyTypedString = "";

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
	show_keyboard();
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
	$("#word_picture_box").show()
	$("#word_picture").attr('src', 'poster://pictures/' + AlfaWords[ArrayID].image);

	if (LessonLanguage === "ch") {
		$("#ch_hint").show();
		$("#ch_hint").html("<div style='font-size: 50px; color:#111; font-weight: bold; text-align: center; font-family: hanwangmingboldregular;'>" + AlfaWords[ArrayID].word_CH + "</div>");
	}

	play_sound("poster://audio/" + LessonLanguage + "/" + AlfaWords[ArrayID].audio, "media_audio", false);
	CorrectWordAudio = "poster://audio/" + LessonLanguage + "/" + AlfaWords[ArrayID].audio;

	LastLetterEntered = false;

	CorrectWordString = AlfaWords[ArrayID].word;
	LessonString = AlfaWords[ArrayID].word;
	LessonStringPos = 0;
	CorrectKey = LessonString[LessonStringPos];

	var KeyboardURL = "";
	if (LessonKeyboardRandom === "predictive_simple") {

		var KeyboardActiveKeys = "";
		$(".word_selected").each(function () {
			console.log($(this).data("id"))
			KeyboardActiveKeys += AlfaWords[parseInt($(this).data("id"), 10)].word[0];
		}).promise().done(function () {
			var unique = KeyboardActiveKeys.split('').filter(function (item, i, ar) { return ar.indexOf(item) === i; }).join('');
			update_keyboard(unique, CorrectKey, 20000)
		});

	}
	if (LessonKeyboardRandom === "predictive_full") {

		var KeyboardActiveKeys = "";
		$(".word_select").each(function () {
			console.log($(this).data("id"))
			KeyboardActiveKeys += AlfaWords[parseInt($(this).data("id"), 10)].word[0];
		}).promise().done(function () {
			var unique = KeyboardActiveKeys.split('').filter(function (item, i, ar) { return ar.indexOf(item) === i; }).join('');
			update_keyboard(unique, CorrectKey, 20000)
		});

	}
	else if (LessonKeyboardRandom === "fromstring") {
		var unique = LessonString.split('').filter(function (item, i, ar) { return ar.indexOf(item) === i; }).join('');

		update_keyboard(unique, CorrectKey, 20000)
	}
	else if (LessonKeyboardRandom === "full") {
		update_keyboard("all", CorrectKey, 10000);
	}
	else if (LessonKeyboardRandom === "singleletter") {
		update_keyboard(CorrectKey, CorrectKey, 90000)
	}

}

function CorrectWordEntered() {
	$("#WordSuggestionsForLesson").hide();

	update_keyboard("", "1", 10000);
	Timeout2 = setTimeout(function () {
		play_sound(CorrectWordAudio, "media_audio", false);
	}, 1000);

	let BallonTimeout = 3000;
	if (!AddWordToEndOfList) {
		report_lesson("type_words "+LessonKeyboardRandom, LessonLanguage, CorrectWordString, 1);

		Timeout3 = setTimeout(function () {
			play_sound("../../audio/correct-sound/clap_2.mp3", "media_audio");
			$("#ballons").show();
			$("#ballons").addClass("balloons_hide");

		}, 3000);
		BallonTimeout = 6000;
	} else
	{
		report_lesson("type_words "+LessonKeyboardRandom, LessonLanguage, CorrectWordString, 0);
	}

	Timeout4 = setTimeout(function () {
		if (LessonProgress >= LessonLength) {
			alert("Lesson Finished!");
		}
		else {
			$("#WordSuggestionsForLesson").css({"position":"absolute", "bottom": ($("#WordsForLesson").outerHeight()+5) + "px"});
			$("#WordSuggestionsForLesson").html("");
			$("#WordsForLesson").html("");
			CurrentlyTypedString = "";
			LessonProgress++;
			CreateLesson($(".word_selected:eq(" + (LessonProgress - 1) + ")").data("id"));

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
		update_keyboard("", "1", 10000);
		$("#WordsForLesson").append(CorrectKey);
		CurrentlyTypedString = $("#WordsForLesson").html();
		console.log(LessonStringPos + " === " + (LessonString.length - 1) + " --" + LessonString + "---");

		if (CurrentlyTypedString===CorrectWordString) {
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

			var KeyboardURL = "";

			if (LessonKeyboardRandom === "predictive_simple") {

				$("#WordSuggestionsForLesson").css({"position":"absolute", "bottom": ($("#WordsForLesson").outerHeight()+5) + "px"});
				$("#WordSuggestionsForLesson").html("");
				var KeyboardActiveKeys = "";
				var WordsAdded = [];
				$(".word_selected").each(function () {
					// console.log($(this).data("id"));
					let WordX = AlfaWords[parseInt($(this).data("id"), 10)].word;
					if (WordX.indexOf(CurrentlyTypedString) === 0 && WordsAdded.indexOf(WordX) === -1) {
						console.log(" possible word: "+WordX+" ("+CurrentlyTypedString+"), key option: "+WordX[ CurrentlyTypedString.length ]);

						WordsAdded.push( WordX );
						$("#WordSuggestionsForLesson").append("<div class='btn btn-primary WordSuggestion' style='display: inline-block; font-size: 32px; margin-right: 10px;'>"+ WordX +"</div>");

						KeyboardActiveKeys += WordX[ CurrentlyTypedString.length ];
					}
				}).promise().done(function () {

					if (WordsAdded.length<=4) {
						hide_keyboard();
						$("#WordSuggestionsForLesson").css({"bottom": "200px", "position":"fixed"});
					}

					var unique = KeyboardActiveKeys.split('').filter(function (item, i, ar) { return ar.indexOf(item) === i; }).join('');
					update_keyboard(unique, CorrectKey, 20000);
					$(".WordSuggestion").off('click touchstart').on('click touchstart',function () {
						console.log ($(this).html()+" "+$(this).text());
						if ($(this).text() === CorrectWordString) {
							$("#WordSuggestionsForLesson").html("<div class='btn btn-primary' style='display: inline-block; font-size: 32px; margin-right: 10px;'>"+ CorrectWordString +"</div>");
							$("#WordsForLesson").html(CorrectWordString);
							CorrectWordEntered();
						} else
						{

							if (!AddWordToEndOfList && LessonRedoWrongAnswers==="yes") {

								blink_correct_keyboard_key();

								$("#picture_box").append("<div data-id='" +$(".word_selected:eq(" + (LessonProgress - 1) + ")").data("id") + "' class='word_select word_selected'><div style='background-color: #ccc;'>REPEAT WORD</div></div>");
//			$("#picture_box").append( )
								LessonLength = $(".word_selected").length;
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
					});
				});

			}
			if (LessonKeyboardRandom === "predictive_full") {

				$("#WordSuggestionsForLesson").css({"position":"absolute", "bottom": ($("#WordsForLesson").outerHeight()+5) + "px"});
				$("#WordSuggestionsForLesson").html("");
				var KeyboardActiveKeys = "";
				var WordsAdded = [];
				$(".word_select").each(function () {
					// console.log($(this).data("id"));
					let WordX = AlfaWords[parseInt($(this).data("id"), 10)].word;
					if (WordX.indexOf(CurrentlyTypedString) === 0 && WordsAdded.indexOf(WordX) === -1) {
						console.log(" possible word: "+WordX+" ("+CurrentlyTypedString+"), key option: "+WordX[ CurrentlyTypedString.length ]);

						WordsAdded.push( WordX );
						$("#WordSuggestionsForLesson").append("<div class='btn btn-primary WordSuggestion' style='display: inline-block; font-size: 32px; margin-right: 10px;'>"+ WordX +"</div>");

						KeyboardActiveKeys += WordX[ CurrentlyTypedString.length ];
					}
				}).promise().done(function () {

					if (WordsAdded.length<=4) {
						hide_keyboard();
						$("#WordSuggestionsForLesson").css({"bottom": "100px", "position":"fixed"});
					}

					var unique = KeyboardActiveKeys.split('').filter(function (item, i, ar) { return ar.indexOf(item) === i; }).join('');
					update_keyboard(unique, CorrectKey, 20000);
					$(".WordSuggestion").off('click touchstart').on('click touchstart',function () {
						console.log ($(this).html()+" "+$(this).text());
						if ($(this).text() === CorrectWordString) {
							$("#WordSuggestionsForLesson").html("<div class='btn btn-primary' style='display: inline-block; font-size: 32px; margin-right: 10px;'>"+ CorrectWordString +"</div>");
							$("#WordsForLesson").html(CorrectWordString);
							CorrectWordEntered();
						} else
						{

							if (!AddWordToEndOfList && LessonRedoWrongAnswers==="yes") {

								blink_correct_keyboard_key();

								$("#picture_box").append("<div data-id='" +$(".word_selected:eq(" + (LessonProgress - 1) + ")").data("id") + "' class='word_select word_selected'><div style='background-color: #ccc;'>REPEAT WORD</div></div>");
//			$("#picture_box").append( )
								LessonLength = $(".word_selected").length;
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
					});
				});

			}
			else if (LessonKeyboardRandom === "fromstring") {
				var unique = LessonString.split('').filter(function (item, i, ar) { return ar.indexOf(item) === i; }).join('');
				update_keyboard(unique, CorrectKey, 20000)
			}
			else if (LessonKeyboardRandom === "full") {
				update_keyboard("all", CorrectKey, 10000);
			}
			else if (LessonKeyboardRandom === "singleletter") {
				update_keyboard(CorrectKey, CorrectKey, 90000)
			}
		}
	}
	else { //wrong letter pressed


		if (!AddWordToEndOfList && LessonRedoWrongAnswers==="yes") {

			blink_correct_keyboard_key();

			$("#picture_box").append("<div data-id='" +$(".word_selected:eq(" + (LessonProgress - 1) + ")").data("id") + "' class='word_select word_selected'><div style='background-color: #ccc;'>REPEAT WORD</div></div>");
//			$("#picture_box").append( )
			LessonLength = $(".word_selected").length;
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

	LessonKeyboardRandom = LessonParameters["random"];
	LessonLanguage = LessonParameters["language"];
	LessonCategory = LessonParameters["category"];
	KeyboardSize = LessonParameters["keyboard_size"];
	SpeakLetters = LessonParameters["speak_letters"];

	LessonRedoWrongAnswers = LessonParameters["redo_wrong_answers"];

	if (typeof LessonRedoWrongAnswers === "undefined") {
		LessonRedoWrongAnswers = "yes";
	}

	if (LessonLanguage === "tr") {
		$("#WordSuggestionsForLesson").css({"font-family":"Arial"});
		$("#WordsForLesson").css({"font-family":"Arial"});
	}
	if (LessonLanguage === "en") {
		$("#WordSuggestionsForLesson").css({"font-family":"Arial"});
		$("#WordsForLesson").css({"font-family":"Arial"});
	}
	if (LessonLanguage === "ch") {
		$("#WordSuggestionsForLesson").css({"font-family":"hanwangmingboldregular"});
		$("#WordsForLesson").css({"font-family":"hanwangmingboldregular"});
	}


	AllWordsData = JSON.parse(window.sendSyncCmd('get-all-words', ''));

	$("#WordSuggestionsForLesson").css({"position":"absolute", "bottom": ($("#WordsForLesson").outerHeight()+5) + "px"});

	console.log(AllWordsData.length);


	for (var i = 0; i < AllWordsData.length; i++) {
		if (LessonCategory.indexOf("-" + AllWordsData[i].categoryID + "-") !== -1) {
			if (AllWordsData[i].word_TR !== "" && AllWordsData[i].word_TR !== null && LessonLanguage === "tr") {
				// console.log(AllWordsData[i]);

				var wordX = AllWordsData[i].word_TR.toLocaleUpperCase('tr-TR');
				wordX = wordX.replace(" ", "_");

				AlfaWords.push({"word": wordX, "image": AllWordsData[i].picture, "audio": AllWordsData[i].audio_TR});

				$("#picture_box").append("<div data-id='" + (AlfaWords.length - 1) + "' class='word_select'><img src='poster://pictures/" + AllWordsData[i].picture + "'  class='word_select_image'><div style='background-color: #ccc;'>" + AllWordsData[i].word_TR + "</div></div>");
			}
			else if (AllWordsData[i].word_EN !== "" && AllWordsData[i].word_EN !== null && LessonLanguage === "en") {

				var wordX = AllWordsData[i].word_EN.toLocaleUpperCase('en-US');
				wordX = wordX.replace(" ", "_");

				AlfaWords.push({"word": wordX, "image": AllWordsData[i].picture, "audio": AllWordsData[i].audio_EN});

				$("#picture_box").append("<div data-id='" + (AlfaWords.length - 1) + "' class='word_select'><img src='poster://pictures/" + AllWordsData[i].picture + "'  class='word_select_image'><div style='background-color: #ccc;'>" + AllWordsData[i].word_EN + "</div></div>");

			}
			else if (AllWordsData[i].bopomofo !== "" && AllWordsData[i].bopomofo !== null && LessonLanguage === "ch") {
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

				AlfaWords.push({
					"word": wordX,
					"word_CH": AllWordsData[i].word_CH,
					"pinyin": AllWordsData[i].pinyin,
					"bopomofo": bopomofoX,
					"image": AllWordsData[i].picture,
					"audio": AllWordsData[i].audio_CH
				});


				$("#picture_box").append("<div data-id='" + (AlfaWords.length - 1) + "' class='word_select'><img src='poster://pictures/" + AllWordsData[i].picture + "' class='word_select_image'><div style='background-color: #ccc; font-family: hanwangmingboldregular; font-size: 20px;'>" + AllWordsData[i].word_CH + "</div><div style='background-color: #ddd;  font-family: hanwangmingboldregular'>" + wordX + "</div></div>");

			}
		}
	}
	$("#picture_box").shuffleChildren();



	$(".word_select").on('click', function () {
		console.log($(this).data("id"));
		$(this).toggleClass("word_selected");
	});


	$("#ballons").hide();


	var KeyboardPath = "../keyboard/mini_" + LessonLanguage + "_keyboard_"+ KeyboardSize +".html";

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


	// if (getParameterByName("nozoom") === "yes") {
	// 	nozoom = true;
	// }

	// addEventListener("click", function () {
	//   if (getParameterByName("nozoom") === "yes") {
	//     nozoom = true;
	//   }
	//   else {
	//     var
	//       el = document.documentElement
	//       , rfs =
	//       el.requestFullScreen
	//       || el.webkitRequestFullScreen
	//       || el.mozRequestFullScreen
	//     ;
	//     rfs.call(el);
	//   }
	// });


	$("#BeginLesson").on('click', function () {
		$("#BeginLesson").hide();
		$("#picture_box").hide();
		LessonLength = $(".word_selected").length;
		$("#WordsForLesson").html("");
		$("#WordSuggestionsForLesson").css({"position":"absolute", "bottom": ($("#WordsForLesson").outerHeight()+5) + "px"});
		$("#WordSuggestionsForLesson").html("");
		CurrentlyTypedString = "";

		LessonProgress++;
		console.log(LessonProgress);
		console.log($(".word_selected:eq(" + (LessonProgress - 1) + ")"));
		console.log($(".word_selected:eq(" + (LessonProgress - 1) + ")").data("id"));
		CreateLesson($(".word_selected:eq(" + (LessonProgress - 1) + ")").data("id"));
	});

	document.addEventListener("virtual-keyboard-press", function (event) {
		if (event.detail.key !== "" && LessonProgress > 0) {
			CorrectAnswer(event.detail.key);
		}
	});
});
