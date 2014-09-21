var DEFINITIONS_URL = "https://quizlet.com/create-set/autodefine";
var WORD_LANGUAGE = "en";
var DEFINITION_LANGUAGE = "en";

var Autocomplete = function() {
  var wordToDefinitions = {};
  var wordToSuccessFunction = {};

  // TODO: Handle error.
  this.getDefinitions = function(word, onSuccess) {
    var safeWord = word.trim().toLowerCase();

    if (wordToDefinitions.hasOwnProperty(safeWord)) {
      onSuccess(wordToDefinitions[safeWord]);
      return;
    }

    // Necessary if typing quickly and multiple calls are made before the result is cached.
    if (wordToSuccessFunction.hasOwnProperty(safeWord)) {
      return;
    }

    wordToSuccessFunction[safeWord] = onSuccess;

    $.getJSON(
        DEFINITIONS_URL,
        {
          text: word,
          wordLang: WORD_LANGUAGE,
          defLang: DEFINITION_LANGUAGE
        },
        function(data) {
          wordToDefinitions[safeWord] = data.definitions;

          var successFunction = wordToSuccessFunction[safeWord];
          delete wordToSuccessFunction[safeWord];

          successFunction(data.definitions);
        });
  };
};