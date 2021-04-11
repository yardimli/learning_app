function report_lesson(lesson_type, selected_language, selected_word, is_correct) {
  var report_data = {
    "student_id": "1",
    "student_name": "ege",
    "lesson_type": lesson_type,
    "language": selected_language,
    "word": selected_word,
    "is_correct": is_correct,
  };

  $.ajax({
    type: 'POST',
    url: "https://elosoft.tw/picture-dictionary-editor/log_report.php",
    data: report_data,
    dataType: "json",
    success: function (resultData) {
//    console.log(resultData);
      if (resultData.result == 'saved') {
      }
    },
    error: function (xhr, status, error) {
      console.log("Report Logging Error. Network connection error. Please check with your network administrator. Error:" + status);
    }
  });
}

