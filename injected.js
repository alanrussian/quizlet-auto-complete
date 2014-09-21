var DEFINITIONS_URL = "https://quizlet.com/create-set/autodefine";
var WORD_LANGUAGE = "en";
var DEFINITION_LANGUAGE = "en";

// TODO: Handle error.
// TODO: Cache results.
var getDefinitions = function(word, onSuccess) {
  $.getJSON(
      DEFINITIONS_URL,
      {
        text: word,
        wordLang: WORD_LANGUAGE,
        defLang: DEFINITION_LANGUAGE
      },
      function(data) {
        onSuccess(data.definitions);
      });
};

var onGetDefinitionsSuccess = function(definitions, definitionElement) {
  if (definitions.length) {
    // TODO: Show grayed out in overlay instead of overwriting.
    // TODO: Show relevant results.
    definitionElement.val(definitions[0]);
  }
};

var handleKeyUp = function() {
  var element = $(this);

  var word = element.closest(".text").find(".qWordTextarea").val();

  getDefinitions(
    word,
    function(definitions) {
      onGetDefinitionsSuccess(definitions, element);
    });
};

$(function() {
  $(".text").on("keyup", ".qDefTextarea", handleKeyUp);
});